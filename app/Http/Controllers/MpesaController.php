<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MpesaController extends Controller
{
    // POST /api/mpesa/initiate
    public function initiate(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
            'msisdn' => 'required|string',
            'reference' => 'required|string',
        ]);

        $payload = [
            'api_key' => 'h255154yefZMp',
            'account_id' => 'HP409133',
            'amount' => $validated['amount'],
            'msisdn' => $validated['msisdn'],
            'reference' => $validated['reference'],
        ];

        try {
            $response = \Http::post('https://api.hashback.co.ke/initiatestk', $payload);
            return response()->json($response->json(), $response->status());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    // POST /api/mpesa/callback
    public function callback(Request $request)
    {
        // Placeholder: Implement M-Pesa callback handling logic here
        return response()->json(['message' => 'M-Pesa callback received (mock)'], 200);
    }
}
