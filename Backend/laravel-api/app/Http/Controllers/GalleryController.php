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
                $meta = Storage::disk('public')->getMetadata($file);
                $images[] = [
                    'name' => basename($file),
                    'url' => '/storage/' . $file,
                    'category' => $folder,
                    'size' => $meta['size'] ?? null,
                    'lastModified' => isset($meta['timestamp']) ? date('c', $meta['timestamp']) : null,
                ];
            }
        }
        usort($images, function ($a, $b) {
            return strtotime($b['lastModified']) <=> strtotime($a['lastModified']);
        });
        return response()->json($images);
    }
}
