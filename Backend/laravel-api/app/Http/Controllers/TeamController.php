<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TeamMember;

class TeamController extends Controller
{
    // GET /api/team
    public function index()
    {
        $team = TeamMember::all();
        return response()->json($team);
    }

    // GET /api/team/{id}
    public function show($id)
    {
        $member = TeamMember::find($id);
        if (!$member) {
            return response()->json(['error' => 'Team member not found'], 404);
        }
        return response()->json($member);
    }

    // POST /api/team
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'role' => 'required|string',
            'bio' => 'nullable|string',
            'email' => 'nullable|email',
            'order_index' => 'nullable|integer',
        ]);
        $member = TeamMember::create($data);
        return response()->json($member, 201);
    }

    // PUT /api/team/{id}
    public function update(Request $request, $id)
    {
        $member = TeamMember::find($id);
        if (!$member) {
            return response()->json(['error' => 'Team member not found'], 404);
        }
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'role' => 'sometimes|required|string',
            'bio' => 'nullable|string',
            'email' => 'nullable|email',
            'order_index' => 'nullable|integer',
        ]);
        $member->update($data);
        return response()->json($member);
    }

    // DELETE /api/team/{id}
    public function destroy($id)
    {
        $member = TeamMember::find($id);
        if (!$member) {
            return response()->json(['error' => 'Team member not found'], 404);
        }
        $member->delete();
        return response()->json(['message' => 'Team member deleted']);
    }
}
