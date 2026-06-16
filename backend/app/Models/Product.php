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
        'name', 
        'price', 
        'price_num', 
        'rating', 
        'category', 
        'gender', 
        'notes', 
        'image_url', 
        'description', 
        'stock_quantity', 
        'is_top_seller', 
        'is_new_arrival',
        'is_deal', 
        'discount_price', 
        'discount_percent',
        'ml_prices'  // ✅ ADDED - ML Prices column
    ];
    
    // ✅ ADDED - Cast ml_prices to array when accessing
    protected $casts = [
        'ml_prices' => 'array',
        'is_deal' => 'boolean',
        'is_top_seller' => 'boolean',
        'is_new_arrival' => 'boolean'
    ];
    
    public $timestamps = false;
    
    // ✅ OPTIONAL - Accessor to decode ml_prices
    public function getMlPricesAttribute($value)
    {
        if ($value === null) {
            return null;
        }
        return json_decode($value, true);
    }
    
    // ✅ OPTIONAL - Mutator to encode ml_prices
    public function setMlPricesAttribute($value)
    {
        if ($value === null) {
            $this->attributes['ml_prices'] = null;
            return;
        }
        
        if (is_array($value)) {
            $this->attributes['ml_prices'] = json_encode($value);
        } else {
            $this->attributes['ml_prices'] = $value;
        }
    }
}