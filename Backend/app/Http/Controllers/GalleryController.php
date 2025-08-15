<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    // POST /api/gallery-scan
    public function scan(Request $request)
    {
        $category = $request->input('category');
        $folders = [
            'authors', 'blog', 'campaigns', 'projects', 'stories', 'team', 'sponsors', 'gallery', 'uploads'
        ];
        $images = [];
        $basePath = 'uploads';
        foreach ($folders as $folder) {
            if ($category && $category !== 'all' && $category !== $folder) {
                continue;
            }
            $folderPath = $basePath . '/' . $folder;
            if (!Storage::disk('public')->exists($folderPath)) {
                continue;
            }
            $files = Storage::disk('public')->files($folderPath);
            foreach ($files as $file) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                    continue;
                }
                $size = Storage::disk('public')->size($file);
                $lastModified = Storage::disk('public')->lastModified($file);
                $images[] = [
                    'name' => basename($file),
                    'url' => '/storage/' . $file,
                    'category' => $folder,
                    'size' => $size,
                    'lastModified' => $lastModified ? date('c', $lastModified) : null,
                ];
            }
        }
        usort($images, function ($a, $b) {
            return strtotime($b['lastModified']) <=> strtotime($a['lastModified']);
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

        // Optionally, save metadata to DB here (not implemented)

        return response()->json([
            'message' => 'Image uploaded successfully',
            'name' => $filename,
            'url' => '/storage/' . $path,
            'category' => $category,
            'alt_text' => $altText,
            'caption' => $caption,
        ], 201);
    }
}
