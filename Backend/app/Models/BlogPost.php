<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'category',
        'author',
        'author_image',
        'published_date',
        'featured_image',
        'tags',
        'published'
    ];
}
