<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sponsor;

class SponsorController extends Controller
{
    // GET /api/sponsors
    public function index()
    {
        $sponsors = Sponsor::all();
        return response()->json($sponsors);
    }

    // GET /api/sponsors/{id}
    public function show($id)
    {
        $sponsor = Sponsor::find($id);
        if (!$sponsor) {
            return response()->json(['error' => 'Sponsor not found'], 404);
        }
        return response()->json($sponsor);
    }

    // POST /api/sponsors
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|string',
        ]);
        $sponsor = Sponsor::create($data);
        return response()->json($sponsor, 201);
    }

    // PUT /api/sponsors/{id}
    public function update(Request $request, $id)
    {
        $sponsor = Sponsor::find($id);
        if (!$sponsor) {
            return response()->json(['error' => 'Sponsor not found'], 404);
        }
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'logo' => 'nullable|string',
            'website' => 'nullable|string',
        ]);
        $sponsor->update($data);
        return response()->json($sponsor);
    }

    // DELETE /api/sponsors/{id}
    public function destroy($id)
    {
        $sponsor = Sponsor::find($id);
        if (!$sponsor) {
            return response()->json(['error' => 'Sponsor not found'], 404);
        }
        $sponsor->delete();
        return response()->json(['message' => 'Sponsor deleted']);
    }
}
