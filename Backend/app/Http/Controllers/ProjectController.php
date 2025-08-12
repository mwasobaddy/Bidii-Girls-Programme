<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    // GET /api/projects
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects);
    }

    // GET /api/projects/{id}
    public function show($id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        return response()->json($project);
    }

    // POST /api/projects
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'location' => 'nullable|string',
            'status' => 'nullable|string',
            'progress' => 'nullable|integer',
            'budget' => 'nullable|numeric',
            'raised' => 'nullable|numeric',
            'beneficiaries' => 'nullable|integer',
            'start_date' => 'nullable|date',
        ]);
        $project = Project::create($data);
        return response()->json($project, 201);
    }

    // PUT /api/projects/{id}
    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        $data = $request->validate([
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'location' => 'nullable|string',
            'status' => 'nullable|string',
            'progress' => 'nullable|integer',
            'budget' => 'nullable|numeric',
            'raised' => 'nullable|numeric',
            'beneficiaries' => 'nullable|integer',
            'start_date' => 'nullable|date',
        ]);
        $project->update($data);
        return response()->json($project);
    }

    // DELETE /api/projects/{id}
    public function destroy($id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
}
