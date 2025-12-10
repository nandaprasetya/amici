<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailFoodReservation extends Model
{
    protected $table = 'detail_food_reservations';
    protected $primaryKey = 'detail_food_reservation_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'detail_food_reservation_id',
        'food_reservation_id',
        'menu_id',
        'quantity',
        'price',
        'subtotal',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'double',
        'subtotal' => 'double'
    ];

    public function foodReservation()
    {
        return $this->belongsTo(FoodReservation::class, 'food_reservation_id', 'food_reservation_id');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id', 'menu_id');
    }
}