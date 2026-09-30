<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shoe extends Model
{
    protected $table = 'shoes';
    protected $primaryKey = 'shoe_id';

    protected $fillable = [
        'name', 'slug', 'description', 'price',
        'gender', 'color', 'is_new', 'is_active',
    ];

    protected $casts = [
        'price'     => 'float',
        'is_new'    => 'boolean',
        'is_active' => 'boolean',
    ];

    public function images()
    {
        return $this->hasMany(ShoeImage::class, 'shoe_id', 'shoe_id')->orderBy('display_order');
    }

    public function sizes()
    {
        return $this->hasMany(ShoeSize::class, 'shoe_id', 'shoe_id')->orderBy('size');
    }

    public function categories()
    {
        return $this->belongsToMany(
            Category2::class,
            'shoe_categories',
            'shoe_id',
            'category_id',
            'shoe_id',
            'category_id'
        );
    }
} 