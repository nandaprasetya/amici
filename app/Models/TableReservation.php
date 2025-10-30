<?php

namespace App\Models;

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
        'user_id',
        'reservation_time',
        'status',
        'bill',
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
}
