<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'status',
        'progress',
        'budget',
        'raised',
        'beneficiaries',
        'start_date',
        'featured_image'
    ];
}
