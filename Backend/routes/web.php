<?php

use App\Http\Controllers\ProfileController;
use App\Models\TeamMember;
use App\Models\Project;
use App\Models\BlogPost;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'campaigns' => [],
        'projects' => [],
        'sponsors' => [],
    ]);
});

Route::get('/about', function () {
    $teamMembers = TeamMember::orderBy('order_index', 'asc')
                            ->orderBy('id', 'asc')
                            ->get();
                            
    return Inertia::render('About', [
        'teamMembers' => $teamMembers,
    ]);
})->name('about');

Route::get('/projects', function () {
    $projects = Project::orderBy('created_at', 'desc')->get();
                            
    return Inertia::render('Projects', [
        'projects' => $projects,
    ]);
})->name('projects');

Route::get('/projects/{id}', function ($id) {
    $project = Project::findOrFail($id);
                            
    return Inertia::render('ProjectDetail', [
        'project' => $project,
    ]);
})->name('projects.show');

Route::get('/blog', function () {
    $blogPosts = BlogPost::orderBy('created_at', 'desc')->get();
                            
    return Inertia::render('Blog', [
        'blogPosts' => $blogPosts,
    ]);
})->name('blog');

Route::get('/blog/{id}', function ($id) {
    $blogPost = BlogPost::findOrFail($id);
                            
    return Inertia::render('BlogDetail', [
        'blogPost' => $blogPost,
    ]);
})->name('blog.show');

Route::get('/gallery', function () {
    return Inertia::render('Gallery', [
        'images' => [],
    ]);
})->name('gallery');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');


// Admin routes
Route::get('/admin/login', function () {
    return Inertia::render('LoginForm');
})->name('admin.login');

Route::get('/admin/dashboard', function () {
    return Inertia::render('admin/dashboard/page');
})->name('admin.dashboard');

Route::get('/admin/sponsors', function () {
    return Inertia::render('admin/sponsors/page');
})->name('admin.sponsors');

Route::get('/admin/projects', function () {
    return Inertia::render('admin/projects/page');
})->name('admin.projects');

Route::get('/admin/campaigns', function () {
    return Inertia::render('admin/campaigns/page');
})->name('admin.campaigns');

Route::get('/admin/blog', function () {
    return Inertia::render('admin/blog/page');
})->name('admin.blog');

Route::get('/admin/gallery', function () {
    return Inertia::render('admin/gallery/page');
})->name('admin.gallery');

Route::get('/admin/team', function () {
    return Inertia::render('admin/team/page');
})->name('admin.team');

Route::get('/admin/applications', function () {
    return Inertia::render('admin/applications/page');
})->name('admin.applications');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
