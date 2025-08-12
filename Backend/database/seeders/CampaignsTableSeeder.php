<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CampaignsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('campaigns')->insert([
            [
                'title' => 'Emergency Period Kits for Kibera',
                'description' => 'Providing immediate relief with emergency menstrual hygiene kits for 200 girls in Kibera slum.',
                'location' => 'Kibera, Nairobi',
                'urgency' => 'Urgent',
                'beneficiaries' => 200,
                'linked_blog' => 1,
                'feature_image' => '/placeholder.svg?height=300&width=400',
                'start_date' => '2024-07-01',
                'end_date' => '2024-08-01',
            ],
            [
                'title' => 'School Toilet Renovation Project',
                'description' => 'Building private, clean toilet facilities in 5 schools to ensure girls have dignified spaces.',
                'location' => 'Mathare, Nairobi',
                'urgency' => 'Active',
                'beneficiaries' => 500,
                'linked_blog' => 2,
                'feature_image' => '/placeholder.svg?height=300&width=400',
                'start_date' => '2024-09-01',
                'end_date' => '2024-12-01',
            ],
        ]);
    }
}
