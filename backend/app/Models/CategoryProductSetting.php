<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryProductSetting extends Model
{
    protected $table = 'category_product_settings';
    
    protected $fillable = [
        'product_id',
        'category_id',
        'show_in_navbar'
    ];
    
    protected $casts = [
        'show_in_navbar' => 'boolean'
    ];
    
    public $timestamps = true;
    
    // ✅ Relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
    
    // ✅ Relationship with Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }
}