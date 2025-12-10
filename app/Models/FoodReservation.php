<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FoodReservation extends Model
{
    protected $table = 'food_reservations';
    protected $primaryKey = 'food_reservation_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'food_reservation_id',
        'reservation_id',
        'total_food_price',
        'tax',
        'service_charge',
        'grand_total',
        'status'
    ];

    protected $casts = [
        'total_food_price' => 'double',
        'tax' => 'double',
        'service_charge' => 'double',
        'grand_total' => 'double'
    ];

    public function reservation()
    {
        return $this->belongsTo(TableReservation::class, 'reservation_id', 'reservation_id');
    }

    public function details()
    {
        return $this->hasMany(DetailFoodReservation::class, 'food_reservation_id', 'food_reservation_id');
    }
}