<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SponsorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('sponsors')->insert([
            [
                'name' => 'UNICEF',
                'logo' => '/placeholder.svg?height=80&width=120',
                'website' => 'https://unicef.org',
            ],
            [
                'name' => 'World Vision',
                'logo' => '/placeholder.svg?height=80&width=120',
                'website' => 'https://worldvision.org',
            ],
        ]);
    }
}
