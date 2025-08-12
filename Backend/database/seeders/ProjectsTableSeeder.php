<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('projects')->insert([
            [
                'title' => 'Menstrual Hygiene Education Program',
                'description' => 'Comprehensive education program teaching girls about menstrual health, hygiene practices, and body positivity in 10 schools across Kibera slum.',
                'location' => 'Kibera, Nairobi',
                'status' => 'active',
                'progress' => 75,
                'budget' => 15000.00,
                'raised' => 11250.00,
                'beneficiaries' => 250,
                'start_date' => '2024-01-01',
            ],
            [
                'title' => 'Sanitary Pad Distribution Initiative',
                'description' => 'Monthly distribution of reusable sanitary pads and hygiene kits to girls in Mathare slum, ensuring they don\'t miss school during their periods.',
                'location' => 'Mathare, Nairobi',
                'status' => 'active',
                'progress' => 60,
                'budget' => 8000.00,
                'raised' => 4800.00,
                'beneficiaries' => 180,
                'start_date' => '2024-03-01',
            ],
            [
                'title' => 'Girls Empowerment Workshops',
                'description' => 'Weekly workshops focusing on leadership skills, self-confidence, and career guidance for teenage girls in Mukuru slum.',
                'location' => 'Mukuru, Nairobi',
                'status' => 'planning',
                'progress' => 25,
                'budget' => 5000.00,
                'raised' => 1250.00,
                'beneficiaries' => 120,
                'start_date' => '2024-06-01',
            ],
            [
                'title' => 'School Infrastructure Improvement',
                'description' => 'Building and renovating toilet facilities in schools to provide private, clean spaces for girls to manage their periods with dignity.',
                'location' => 'Kawangware, Nairobi',
                'status' => 'completed',
                'progress' => 100,
                'budget' => 25000.00,
                'raised' => 25000.00,
                'beneficiaries' => 300,
                'start_date' => '2023-09-01',
            ],
        ]);
    }
}
