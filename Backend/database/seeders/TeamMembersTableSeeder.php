<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeamMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('team_members')->insert([
            [
                'name' => 'Sarah Wanjiku',
                'role' => 'Founder & Executive Director',
                'bio' => 'Sarah founded Bidii Girls Program in 2021 after witnessing firsthand the challenges girls face due to period poverty. With over 10 years of experience in community development, she leads our mission with passion and dedication.',
                'email' => 'sarah@bidiigirls.org',
                'order_index' => 1,
            ],
            [
                'name' => 'Grace Muthoni',
                'role' => 'Program Manager',
                'bio' => 'Grace oversees our educational programs and community outreach initiatives. Her background in social work and her deep understanding of local communities make her invaluable to our mission.',
                'email' => 'grace@bidiigirls.org',
                'order_index' => 2,
            ],
            [
                'name' => 'David Kimani',
                'role' => 'Operations Director',
                'bio' => 'David manages our day-to-day operations and ensures efficient distribution of resources. His expertise in logistics and supply chain management helps us reach more girls effectively.',
                'email' => 'david@bidiigirls.org',
                'order_index' => 3,
            ],
            [
                'name' => 'Mary Akinyi',
                'role' => 'Community Coordinator',
                'bio' => 'Mary works directly with schools and communities to implement our programs. Her grassroots approach and cultural sensitivity ensure our initiatives are well-received and effective.',
                'email' => 'mary@bidiigirls.org',
                'order_index' => 4,
            ],
        ]);
    }
}
