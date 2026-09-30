<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category2 extends Model
{
    protected $table = 'categories2';
    protected $primaryKey = 'category_id';
    public $timestamps = false;

    protected $fillable = ['name'];
}