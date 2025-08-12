<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\DashboardController;

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

// Health check and DB test endpoints
Route::get('/health', [HealthController::class, 'health']);
Route::get('/test-db', [HealthController::class, 'testDb']);

// Dashboard statistics (public routes for basic stats)
Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/recent-activity', [DashboardController::class, 'recentActivity']);
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
    Route::get('/', [BlogController::class, 'index']);
    Route::get('/{id}', [BlogController::class, 'show']);
    Route::post('/', [BlogController::class, 'store'])->middleware('jwt.auth');
    Route::put('/{id}', [BlogController::class, 'update'])->middleware('jwt.auth');
    Route::delete('/{id}', [BlogController::class, 'destroy'])->middleware('jwt.auth');
});

Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::get('/{id}', [ProjectController::class, 'show']);
    Route::post('/', [ProjectController::class, 'store'])->middleware('jwt.auth');
    Route::put('/{id}', [ProjectController::class, 'update'])->middleware('jwt.auth');
    Route::delete('/{id}', [ProjectController::class, 'destroy'])->middleware('jwt.auth');
});
Route::prefix('campaigns')->group(function () {
    Route::get('/', [CampaignController::class, 'index']);
    Route::get('/{id}', [CampaignController::class, 'show']);
    Route::post('/', [CampaignController::class, 'store'])->middleware('jwt.auth');
    Route::put('/{id}', [CampaignController::class, 'update'])->middleware('jwt.auth');
    Route::delete('/{id}', [CampaignController::class, 'destroy'])->middleware('jwt.auth');
});


Route::prefix('team')->group(function () {
    Route::get('/', [TeamController::class, 'index']);
    Route::get('/{id}', [TeamController::class, 'show']);
    Route::post('/', [TeamController::class, 'store'])->middleware('jwt.auth');
    Route::put('/{id}', [TeamController::class, 'update'])->middleware('jwt.auth');
    Route::delete('/{id}', [TeamController::class, 'destroy'])->middleware('jwt.auth');
});

Route::prefix('sponsors')->group(function () {
    Route::get('/', [SponsorController::class, 'index']);
    Route::get('/{id}', [SponsorController::class, 'show']);
    Route::post('/', [SponsorController::class, 'store'])->middleware('jwt.auth');
    Route::put('/{id}', [SponsorController::class, 'update'])->middleware('jwt.auth');
    Route::delete('/{id}', [SponsorController::class, 'destroy'])->middleware('jwt.auth');
});

Route::prefix('contact')->group(function () {
    Route::post('/', [ContactController::class, 'store']); // public contact form
    Route::get('/', [ContactController::class, 'index'])->middleware('jwt.auth'); // admin only
});

Route::prefix('upload')->group(function () {
    Route::post('/', [UploadController::class, 'upload'])->middleware('jwt.auth');
    Route::get('/images/{path}', [UploadController::class, 'image'])->where('path', '.*');
});

// Categories and Gallery routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/gallery-scan', [GalleryController::class, 'scan']);

// Mpesa routes
Route::prefix('mpesa')->group(function () {
    Route::post('/initiate', [MpesaController::class, 'initiate']);
    Route::post('/callback', [MpesaController::class, 'callback']);
});
