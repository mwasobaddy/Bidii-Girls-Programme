<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'urgency',
        'beneficiaries',
        'linked_blog',
        'feature_image', // now stored as longText (base64)
        'start_date',
        'end_date',
    ];
}
