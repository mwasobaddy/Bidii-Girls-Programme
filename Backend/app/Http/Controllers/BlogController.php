<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BlogPost;

class BlogController extends Controller
{
    // GET /api/blog?admin=1
    public function index(Request $request)
    {
        $query = BlogPost::query();
        if ($request->boolean('admin')) {
            // Return all posts for admin
            $posts = $query->get();
        } else {
            // Only published posts for public
            $posts = $query->where('published', true)->get();
        }
        return response()->json($posts);
    }

    // GET /api/blog/{id}
    public function show($id)
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return response()->json(['error' => 'Blog post not found'], 404);
        }
        return response()->json($post);
    }

    // POST /api/blog
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'slug' => 'required|string|unique:blog_posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'nullable|string',
            'author' => 'nullable|string',
            'author_image' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published' => 'boolean',
            'published_date' => 'nullable|date',
            'tags' => 'nullable|string',
        ]);
        $post = BlogPost::create($data);
        return response()->json($post, 201);
    }

    // PUT /api/blog/{id}
    public function update(Request $request, $id)
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return response()->json(['error' => 'Blog post not found'], 404);
        }
        $data = $request->validate([
            'title' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:blog_posts,slug,' . $id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|required|string',
            'category' => 'nullable|string',
            'author' => 'nullable|string',
            'author_image' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published' => 'boolean',
            'published_date' => 'nullable|date',
            'tags' => 'nullable|string',
        ]);
        $post->update($data);
        return response()->json($post);
    }

    // DELETE /api/blog/{id}
    public function destroy($id)
    {
        $post = BlogPost::find($id);
        if (!$post) {
            return response()->json(['error' => 'Blog post not found'], 404);
        }
        $post->delete();
        return response()->json(['message' => 'Blog post deleted']);
    }
}
