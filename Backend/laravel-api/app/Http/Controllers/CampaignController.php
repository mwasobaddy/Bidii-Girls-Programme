<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campaign;

class CampaignController extends Controller
{
    // GET /api/campaigns
    public function index()
    {
        $campaigns = Campaign::all();
        return response()->json($campaigns);
    }

    // GET /api/campaigns/{id}
    public function show($id)
    {
        $campaign = Campaign::find($id);
        if (!$campaign) {
            return response()->json(['error' => 'Campaign not found'], 404);
        }
        return response()->json($campaign);
    }

    // POST /api/campaigns
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'location' => 'nullable|string',
            'urgency' => 'nullable|string',
            'beneficiaries' => 'nullable|integer',
            'linked_blog' => 'nullable|integer',
            'feature_image' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);
        $campaign = Campaign::create($data);
        return response()->json($campaign, 201);
    }

    // PUT /api/campaigns/{id}
    public function update(Request $request, $id)
    {
        $campaign = Campaign::find($id);
        if (!$campaign) {
            return response()->json(['error' => 'Campaign not found'], 404);
        }
        $data = $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'location' => 'nullable|string',
            'urgency' => 'nullable|string',
            'beneficiaries' => 'nullable|integer',
            'linked_blog' => 'nullable|integer',
            'feature_image' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);
        $campaign->update($data);
        return response()->json($campaign);
    }

    // DELETE /api/campaigns/{id}
    public function destroy($id)
    {
        $campaign = Campaign::find($id);
        if (!$campaign) {
            return response()->json(['error' => 'Campaign not found'], 404);
        }
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted']);
    }
}
