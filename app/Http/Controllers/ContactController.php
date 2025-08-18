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
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);
        $message = ContactMessage::create($data);

        // Send notification email
        try {
            Mail::raw(
                "New contact form submission:\n\nName: {$data['name']}\nEmail: {$data['email']}\nSubject: {$data['subject']}\nMessage: {$data['message']}",
                function ($mail) use ($data) {
                    $mail->to(config('mail.from.address'))
                        ->subject('New Contact Form Submission');
                }
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send contact notification email: ' . $e->getMessage());
        }

        return response()->json($message, 201);
    }

    // POST /api/partner (public partner form)
    public function partner(Request $request)
    {
        $data = $request->validate([
            'fullName' => 'required|string',
            'email' => 'required|email',
            'phoneNumber' => 'required|string',
            'role' => 'nullable|string',
            'organizationName' => 'nullable|string',
            'type' => 'nullable|string',
        ]);

        // Send notification email
        try {
            Mail::raw(
                "New partnership inquiry:\n\nName: {$data['fullName']}\nEmail: {$data['email']}\nPhone: {$data['phoneNumber']}\nRole: {$data['role']}\nOrganization: {$data['organizationName']}\nType: {$data['type']}",
                function ($mail) use ($data) {
                    $mail->to(config('mail.from.address'))
                        ->subject('New Partnership Inquiry');
                }
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send partnership notification email: ' . $e->getMessage());
        }

        return response()->json(['success' => true], 201);
    }

    // POST /api/volunteer (public volunteer form)
    public function volunteer(Request $request)
    {
        $data = $request->validate([
            'fullName' => 'required|string',
            'email' => 'required|email',
            'phoneNumber' => 'required|string',
            'type' => 'nullable|string',
        ]);

        // Send notification email
        try {
            Mail::raw(
                "New volunteer application:\n\nName: {$data['fullName']}\nEmail: {$data['email']}\nPhone: {$data['phoneNumber']}\nType: {$data['type']}",
                function ($mail) use ($data) {
                    $mail->to(config('mail.from.address'))
                        ->subject('New Volunteer Application');
                }
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send volunteer notification email: ' . $e->getMessage());
        }

        return response()->json(['success' => true], 201);
    }

    // GET /api/contact (admin only)
    public function index()
    {
        $messages = ContactMessage::all();
        return response()->json($messages);
    }
}
