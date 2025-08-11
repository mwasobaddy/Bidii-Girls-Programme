<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'amount',
        'donor_name',
        'donor_email',
        'donor_phone',
        'payment_method',
        'transaction_id',
        'status',
        'campaign_id',
        'project_id',
        'anonymous'
    ];
}
