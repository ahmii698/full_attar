<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    
    protected $primaryKey = 'category_id';
    
    public $incrementing = true;
    
    // ✅ DISABLE TIMESTAMPS - Since table doesn't have created_at/updated_at
    public $timestamps = false;
    
    protected $fillable = [
        'category_name',
        'category_slug',
        'show_in_navbar',
        'is_active',
    ];
    
    // ✅ OLD: One-to-Many (single category per product)
    // public function products()
    // {
    //     return $this->hasMany(Product::class, 'category', 'category_name');
    // }
    
    // ✅ NEW: Many-to-Many (multiple categories per product)
    public function products()
    {
        return $this->belongsToMany(
            Product::class,                 // Related model
            'product_categories',           // Pivot table name
            'category_id',                  // Foreign key on pivot table
            'product_id'                    // Related key on pivot table
        );
    }
    
    // Accessors for name/slug
    public function getNameAttribute()
    {
        return $this->category_name;
    }
    
    public function getSlugAttribute()
    {
        return $this->category_slug;
    }
}