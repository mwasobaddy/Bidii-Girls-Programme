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
        ]);
        /** @var UploadedFile $file */
        $file = $request->file('file');
        $path = $file->store('uploads', 'public');
        return response()->json(['path' => $path], 201);
    }

    // GET /api/images/{path}
    public function image($path)
    {
        $file = Storage::disk('public')->get($path);
        $mime = Storage::disk('public')->mimeType($path);
        return response($file, 200)->header('Content-Type', $mime);
    }
}
