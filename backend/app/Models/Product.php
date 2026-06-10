<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $table = 'products';
    protected $primaryKey = 'product_id';
    protected $fillable = [
        'name', 'price', 'price_num', 'rating', 'category', 
        'gender', 'notes', 'image_url', 'description', 
        'stock_quantity', 'is_top_seller', 'is_new_arrival',
        'is_deal', 'discount_price', 'discount_percent'
    ];
    
    public $timestamps = false;  // ← YEH ADD KARO (true ki jagah false)
}