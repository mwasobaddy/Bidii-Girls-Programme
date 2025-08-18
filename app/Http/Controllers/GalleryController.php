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
                'url' => $img->path,
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

        // Parse base64 image
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $image = substr($imageData, strpos($imageData, ',') + 1);
            $image = base64_decode($image);
            $extension = strtolower($type[1]) === 'jpeg' ? 'jpg' : strtolower($type[1]);
        } else {
            return response()->json(['message' => 'Invalid image format'], 422);
        }

        // Generate unique filename
        $filename = uniqid('img_') . '.' . $extension;
        $folder = 'uploads/' . $category;
        $path = $folder . '/' . $filename;

        // Ensure folder exists
        if (!Storage::disk('public')->exists($folder)) {
            Storage::disk('public')->makeDirectory($folder);
        }

        // Save image
        Storage::disk('public')->put($path, $image);

        // Save metadata to DB
        $imgModel = GalleryImage::create([
            'name' => $filename,
            'path' => '/storage/' . $path,
            'category' => $category,
            'alt_text' => $altText,
            'caption' => $caption,
            'size' => strlen($image),
            'last_modified' => now(),
        ]);

        return response()->json([
            'message' => 'Image uploaded successfully',
            'name' => $filename,
            'url' => $imgModel->path,
            'category' => $category,
            'alt_text' => $altText,
            'caption' => $caption,
        ], 201);
    }
}
