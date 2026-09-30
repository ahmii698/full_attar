<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShoeSize extends Model
{
    protected $table = 'shoe_sizes';
    protected $primaryKey = 'size_id';
    public $timestamps = false;

    protected $fillable = ['shoe_id', 'size', 'stock'];
}