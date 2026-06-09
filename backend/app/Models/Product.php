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
        'is_deal', 'discount_price', 'discount_percent'  // ← YEH DO FIELDS ADD KARO
    ];
    
    public $timestamps = true;
    
    // Accessor for image URL
    public function getImageUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }
        
        // If image is in storage (uploaded via admin)
        if (strpos($value, '/storage/') === 0) {
            return asset($value);
        }
        
        // If image is in frontend assets
        if (strpos($value, '/assets/') === 0) {
            return 'http://localhost:5173' . $value;
        }
        
        return $value;
    }
}