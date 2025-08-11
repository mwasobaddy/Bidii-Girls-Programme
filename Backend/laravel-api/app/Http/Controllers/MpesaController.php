<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MpesaController extends Controller
{
    // POST /api/mpesa/initiate
    public function initiate(Request $request)
    {
        // Placeholder: Implement M-Pesa payment initiation logic here
        return response()->json(['message' => 'M-Pesa payment initiated (mock)'], 200);
    }

    // POST /api/mpesa/callback
    public function callback(Request $request)
    {
        // Placeholder: Implement M-Pesa callback handling logic here
        return response()->json(['message' => 'M-Pesa callback received (mock)'], 200);
    }
}
