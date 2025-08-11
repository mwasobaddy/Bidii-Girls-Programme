<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    // POST /api/contact (public contact form)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);
        $message = ContactMessage::create($data);
        return response()->json($message, 201);
    }

    // GET /api/contact (admin only)
    public function index()
    {
        $messages = ContactMessage::all();
        return response()->json($messages);
    }
}
