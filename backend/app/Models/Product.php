<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $table = 'products';              // YEH ADD KARO
    protected $primaryKey = 'product_id';       // YEH ADD KARO
    protected $fillable = [
        'name', 'price', 'price_num', 'rating', 'category', 
        'gender', 'notes', 'image_url', 'description', 
        'stock_quantity', 'is_top_seller', 'is_new_arrival'
    ];
    
    public $timestamps = true;                   // YEH ADD KARO
}