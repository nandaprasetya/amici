<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TableGallery extends Model
{
    use HasFactory;

    protected $table = 'table_gallery';

    protected $primaryKey = 'table_gallery_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'img_menu',
        'table_id',
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
}
