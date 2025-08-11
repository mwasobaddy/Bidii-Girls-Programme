<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login endpoint: POST /api/auth/login
     */
    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid credentials.'], 422);
        }

        try {
            if (! $token = auth('api')->attempt($credentials)) {
                return response()->json(['error' => 'Invalid email or password.'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
        ]);
    }

    /**
     * Logout endpoint: POST /api/auth/logout
     */
    public function logout()
    {
        try {
            \Tymon\JWTAuth\Facades\JWTAuth::invalidate(\Tymon\JWTAuth\Facades\JWTAuth::getToken());
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout, token may be invalid'], 401);
        }
    }

    /**
     * Refresh endpoint: POST /api/auth/refresh
     */
    public function refresh()
    {
        try {
            $newToken = \Tymon\JWTAuth\Facades\JWTAuth::refresh(\Tymon\JWTAuth\Facades\JWTAuth::getToken());
            return response()->json([
                'access_token' => $newToken,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to refresh token'], 401);
        }
    }
}
