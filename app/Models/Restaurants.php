<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Restaurants extends Model
{
    use HasFactory;

    protected $table = 'restaurants';

    protected $primaryKey = 'restaurant_id';
    public $incrementing = false; 
    protected $keyType = 'string';

    protected $fillable = [
        'restaurant_id',
        'name',
        'description',
        'address',
        'phone',
        'email',
        'opening_hours',
        'closing_hours',
        'rating',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->restaurant_id)) {
                $model->restaurant_id = Str::uuid()->toString();
            }
        });
    }

    public function menus()
    {
        return $this->hasMany(Menu::class, 'restaurant_id', 'restaurant_id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'restaurant_id', 'restaurant_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'restaurant_id', 'restaurant_id');
    }
}
