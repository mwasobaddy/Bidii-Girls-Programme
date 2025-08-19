<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $fillable = [
        'name', 'base64', 'category', 'alt_text', 'caption', 'size', 'last_modified'
    ];
}
