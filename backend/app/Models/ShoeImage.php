<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoeImage extends Model
{
    protected $table = 'shoe_images';
    protected $primaryKey = 'image_id';
    public $timestamps = false;

    protected $fillable = ['shoe_id', 'image_url', 'is_main', 'display_order'];
}