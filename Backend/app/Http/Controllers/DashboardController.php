<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sponsor;
use App\Models\Project;
use App\Models\Campaign;
use App\Models\BlogPost;
use App\Models\TeamMember;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'sponsors' => Sponsor::count(),
                'projects' => Project::count(),
                'campaigns' => Campaign::count(),
                'stories' => BlogPost::count(), // Assuming stories are blog posts
                'blog' => BlogPost::count(),
                'gallery' => 0, // No Gallery model found yet, set to 0
                'team' => TeamMember::count(),
                'categories' => 0, // No Category model found yet, set to 0
                'contacts' => ContactMessage::count(),
                'active_campaigns' => Campaign::where('urgency', 'active')->count(),
                'completed_projects' => Project::where('status', 'completed')->count(),
                'published_blogs' => BlogPost::where('published', true)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities summary
     *
     * @return JsonResponse
     */
    public function recentActivity(): JsonResponse
    {
        try {
            $recentActivity = [
                'recent_blogs' => BlogPost::latest()->limit(5)->get(['id', 'title', 'created_at']),
                'recent_projects' => Project::latest()->limit(5)->get(['id', 'title', 'created_at']),
                'recent_campaigns' => Campaign::latest()->limit(5)->get(['id', 'title', 'created_at']),
                'recent_contacts' => ContactMessage::latest()->limit(10)->get(['id', 'name', 'email', 'created_at']),
            ];

            return response()->json([
                'success' => true,
                'data' => $recentActivity
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
