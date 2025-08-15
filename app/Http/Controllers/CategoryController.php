<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        // These categories match the folders used for uploads and gallery
        $categories = [
            ['name' => 'Blog Images', 'folder' => 'blog'],
            ['name' => 'Campaign Images', 'folder' => 'campaigns'],
            ['name' => 'Project Images', 'folder' => 'projects'],
            ['name' => 'Stories', 'folder' => 'stories'],
            ['name' => 'Team Photos', 'folder' => 'team'],
            ['name' => 'Sponsor Logos', 'folder' => 'sponsors'],
            ['name' => 'Author Avatars', 'folder' => 'authors'],
            ['name' => 'Gallery', 'folder' => 'gallery'],
            ['name' => 'Other', 'folder' => 'uploads'],
        ];
        return response()->json($categories);
    }
}
