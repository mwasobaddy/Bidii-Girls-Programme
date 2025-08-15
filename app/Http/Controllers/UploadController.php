<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Response;

class UploadController extends Controller
{
    // POST /api/upload
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
            'folder' => 'nullable|string',
        ]);
        /** @var UploadedFile $file */
        $file = $request->file('file');
        $folder = $request->input('folder', 'uploads');
        $allowedFolders = [
            'sponsors', 'projects', 'campaigns', 'blog', 'stories', 'team', 'gallery', 'authors', 'uploads'
        ];
        if (!in_array($folder, $allowedFolders)) {
            return response()->json(['error' => 'Invalid folder'], 400);
        }
        $path = $file->store("uploads/{$folder}", 'public');

        // Placeholder for image optimization (e.g., Intervention Image)
        // TODO: Optimize/compress image if needed

        $url = '/storage/' . $path;
        return response()->json(['url' => $url, 'path' => $path], 201);
    }

    // GET /api/images/{path}
    public function image($path)
    {
        $file = Storage::disk('public')->get($path);
        $mime = Storage::disk('public')->mimeType($path);
        return response($file, 200)->header('Content-Type', $mime);
    }
}
