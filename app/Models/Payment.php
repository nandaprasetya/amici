<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $primaryKey = 'payment_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'payment_id',
        'food_reservation_id',
        'amount',
        'payment_method',
        'payment_status',
        'snap_token',
        'payment_time',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_time' => 'datetime',
    ];

    public function foodReservation()
    {
        return $this->belongsTo(FoodReservation::class, 'food_reservation_id', 'food_reservation_id');
    }
}