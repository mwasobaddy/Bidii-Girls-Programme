<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check route
Route::get('/health', function () {
    return response()->json([
        'service' => 'Bidii Girls Program API',
        'status' => 'healthy',
        'version' => '1.0.0',
        'timestamp' => now()->toISOString(),
    ]);
});

// Test database connection route
Route::get('/test-db', function () {
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
});

// Get authenticated user route (requires authentication)
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Placeholder routes that will be implemented in Phase 4
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('jwt.auth');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('jwt.auth');
    // Authentication routes will be added here
});

Route::prefix('blog')->group(function () {
    // Blog routes will be added here
});

Route::prefix('projects')->group(function () {
    // Project routes will be added here
});

Route::prefix('campaigns')->group(function () {
    // Campaign routes will be added here
});

Route::prefix('team')->group(function () {
    // Team routes will be added here
});

Route::prefix('sponsors')->group(function () {
    // Sponsor routes will be added here
});

Route::prefix('contact')->group(function () {
    // Contact routes will be added here
});

Route::prefix('upload')->group(function () {
    // Upload routes will be added here
});

Route::prefix('mpesa')->group(function () {
    // M-Pesa routes will be added here
});
