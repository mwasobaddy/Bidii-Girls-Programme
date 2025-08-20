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
        'author_image', // now stored as longText (base64)
        'published_date',
        'featured_image', // now stored as longText (base64)
        'tags',
        'published'
    ];
}
