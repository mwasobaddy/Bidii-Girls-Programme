<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\GalleryImage;

class GalleryController extends Controller
{
    // GET /api/gallery-scan
    public function scan(Request $request)
    {
        $category = $request->input('category');
        $query = GalleryImage::query();
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }
        $images = $query->orderByDesc('last_modified')->get()->map(function ($img) {
            return [
                'name' => $img->name,
                'base64' => $img->base64,
                'category' => $img->category,
                'size' => $img->size,
                'lastModified' => $img->last_modified,
                'alt_text' => $img->alt_text,
                'caption' => $img->caption,
            ];
        });
        return response()->json($images);
    }
    // POST /api/gallery
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'category' => 'required|string',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
        ]);

        $imageData = $request->input('image');
        $category = $request->input('category');
        $altText = $request->input('alt_text');
        $caption = $request->input('caption');

        // Validate base64 image format
        if (!preg_match('/^data:image\/(\w+);base64,/', $imageData)) {
            return response()->json(['message' => 'Invalid image format'], 422);
        }

        // Generate unique name
        $filename = uniqid('img_');

        // Save metadata and base64 to DB (removed 'path')
        $imgModel = GalleryImage::create([
            'name' => $filename,
            'base64' => $imageData,
            'category' => $category,
            'alt_text' => $altText,
            'caption' => $caption,
            'size' => strlen($imageData),
            'last_modified' => now(),
        ]);

        return response()->json([
            'message' => 'Image uploaded successfully',
            'name' => $filename,
            'base64' => $imgModel->base64,
            'category' => $category,
            'alt_text' => $altText,
            'caption' => $caption,
        ], 201);
    }
    // DELETE /api/gallery/{name}
    public function destroy($name)
    {
        $image = GalleryImage::where('name', $name)->first();
        if (!$image) {
            return response()->json(['message' => 'Image not found'], 404);
        }
        $image->delete();
        return response()->json(['message' => 'Image deleted']);
    }
}
