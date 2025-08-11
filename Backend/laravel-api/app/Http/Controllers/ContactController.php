<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Mail;

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

        // Send notification email
        try {
            Mail::raw(
                "New contact form submission:\n\nName: {$data['name']}\nEmail: {$data['email']}\nMessage: {$data['message']}",
                function ($mail) use ($data) {
                    $mail->to(config('mail.from.address'))
                        ->subject('New Contact Form Submission');
                }
            );
        } catch (\Exception $e) {
            // Log error but do not block response
            \Log::error('Failed to send contact notification email: ' . $e->getMessage());
        }

        return response()->json($message, 201);
    }

    // GET /api/contact (admin only)
    public function index()
    {
        $messages = ContactMessage::all();
        return response()->json($messages);
    }
}
