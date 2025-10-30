<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DetailTableReservation extends Model
{
    use HasFactory;

    protected $table = 'detail_table_reservation';

    protected $primaryKey = 'detail_table_reservation_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'table_id',
        'reservation_id',
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

    public function table()
    {
        return $this->belongsTo(Table::class, 'table_id', 'table_id');
    }

    public function reservation()
    {
        return $this->belongsTo(TableReservation::class, 'reservation_id', 'reservation_id');
    }
}
