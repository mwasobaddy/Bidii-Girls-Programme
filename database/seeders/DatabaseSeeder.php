<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call all custom table seeders
        $this->call([
            SponsorsTableSeeder::class,
            UsersTableSeeder::class,
            TeamMembersTableSeeder::class,
            ProjectsTableSeeder::class,
            BlogPostsTableSeeder::class,
            CampaignsTableSeeder::class,
        ]);
    }
}
