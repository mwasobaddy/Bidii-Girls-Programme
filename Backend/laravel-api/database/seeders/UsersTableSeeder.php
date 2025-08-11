<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('users')->insert([
            [
                'email' => 'admin@bidiigirls.org',
                'password_hash' => '$2b$10$2Ar68X1fTWvN2cVVCIGQUOUNQfpYEe/Oz4O3vEOFBoDpYj/kYup/u',
                'role' => 'admin',
            ],
            [
                'email' => 'sarah@bidiigirls.org',
                'password_hash' => '$2b$10$2Ar68X1fTWvN2cVVCIGQUOUNQfpYEe/Oz4O3vEOFBoDpYj/kYup/u',
                'role' => 'admin',
            ],
        ]);
    }
}
