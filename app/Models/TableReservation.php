<?php

namespace App\Models;

use Illuminate\Http\Request;
use Inertia\Inertia;    
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TableReservation extends Model
{
    use HasFactory;

    protected $table = 'table_reservation';

    protected $primaryKey = 'reservation_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'reservation_id',
        'user_id',
        'reservation_time',
        'status',
        'minimum_spend',
        'is_reminder'
    ];

    protected $casts = [
        'reservation_time' => 'datetime',
        'bill' => 'double',
        'is_reminder' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function tables()
    {
        return $this->belongsToMany(Table::class, 'reservation_table', 'reservation_id', 'table_id');
    }

    public function userIndex(Request $request)
    {
        $userId = $request->user()->user_id;

        $reservations = TableReservation::where('user_id', $userId)
            ->orderBy('reservation_time', 'desc')
            ->get();

        return Inertia::render('Customer/Reservation', [
            'reservations' => $reservations
        ]);
    }

    public function restaurant()
{
    return $this->belongsTo(Restaurant::class, 'restaurant_id', 'restaurant_id');
}

    public function details()
    {
        return $this->hasMany(DetailTableReservation::class, 'reservation_id', 'reservation_id');
    }

    public function foodReservation()
    {
        return $this->hasOne(FoodReservation::class, 'reservation_id', 'reservation_id');
    }
}
