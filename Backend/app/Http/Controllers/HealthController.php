<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Exception;

class HealthController extends Controller
{
    // GET /api/health
    public function health()
    {
        return response()->json([
            'service' => 'Bidii Girls Program API',
            'status' => 'healthy',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString(),
        ]);
    }

    // GET /api/test-db
    public function testDb()
    {
        try {
            DB::connection()->getPdo();
            return response()->json([
                'status' => 'success',
                'message' => 'Database connection successful',
                'connection' => true,
                'timestamp' => now()->toISOString(),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed',
                'error' => $e->getMessage(),
                'connection' => false,
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }
}
