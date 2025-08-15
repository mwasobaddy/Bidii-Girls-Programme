<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'title',
        'description',
        'featured_image',
        'goal_amount',
        'raised_amount',
        'status',
        'start_date',
        'end_date'
    ];
}
