<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MenuGallery extends Model
{
    use HasFactory;

    protected $table = 'menu_gallery';

    protected $primaryKey = 'menu_gallery_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'img_menu',
        'menu_id',
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

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id', 'menu_id');
    }
}
