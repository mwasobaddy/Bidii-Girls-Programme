<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'role',
        'bio',
        'email',
        'order_index',
        'image'
    ];
    // ...existing code...
}
