<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Table extends Model
{
    use HasFactory;

    protected $table = 'tables';

    protected $primaryKey = 'table_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'table_number',
        'total_chair',
        'minimun_spend',
        'price',
        'desc',
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
}
