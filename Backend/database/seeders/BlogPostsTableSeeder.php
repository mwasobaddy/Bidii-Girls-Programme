<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogPostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('blog_posts')->insert([
            [
                'title' => 'Breaking the Silence: Why Period Education Matters',
                'slug' => 'breaking-silence-period-education-matters',
                'excerpt' => 'Exploring the importance of comprehensive menstrual health education in breaking down stigma and empowering young girls.',
                'content' => 'Period education is crucial for empowering girls and breaking down harmful stigmas...',
                'category' => 'Education',
                'author' => 'Sarah Wanjiku',
                'published' => true,
            ],
            [
                'title' => 'Success Story: How Maria Overcame Period Poverty',
                'slug' => 'success-story-maria-overcame-period-poverty',
                'excerpt' => 'Meet Maria, a 16-year-old from Kibera who transformed her life through our menstrual hygiene program.',
                'content' => 'Maria\'s story is one of resilience and transformation...',
                'category' => 'Success Stories',
                'author' => 'Grace Muthoni',
                'published' => true,
            ],
            [
                'title' => 'The Economic Impact of Period Poverty in Kenya',
                'slug' => 'economic-impact-period-poverty-kenya',
                'excerpt' => 'Understanding how period poverty affects girls\' education and economic opportunities in Kenyan communities.',
                'content' => 'Period poverty has far-reaching economic consequences...',
                'category' => 'Research',
                'author' => 'David Kimani',
                'published' => true,
            ],
        ]);
    }
}
