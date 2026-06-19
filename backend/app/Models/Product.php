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
        'top_highlights',  // ✅ ADDED - Top Highlights column
        'stock_quantity', 
        'is_top_seller', 
        'is_new_arrival',
        'is_deal', 
        'discount_price', 
        'discount_percent',
        'ml_prices'
    ];
    
    protected $casts = [
        'ml_prices' => 'array',
        'top_highlights' => 'array',  // ✅ ADDED - Cast to array
        'is_deal' => 'boolean',
        'is_top_seller' => 'boolean',
        'is_new_arrival' => 'boolean'
    ];
    
    public $timestamps = false;
    
    // ✅ Accessor for ml_prices
    public function getMlPricesAttribute($value)
    {
        if ($value === null) {
            return null;
        }
        return json_decode($value, true);
    }
    
    // ✅ Mutator for ml_prices
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
    
    // ✅ Accessor for top_highlights
    public function getTopHighlightsAttribute($value)
    {
        if ($value === null) {
            return $this->getDefaultHighlights();
        }
        return json_decode($value, true);
    }
    
    // ✅ Mutator for top_highlights
    public function setTopHighlightsAttribute($value)
    {
        if ($value === null || empty($value)) {
            $this->attributes['top_highlights'] = json_encode($this->getDefaultHighlights());
            return;
        }
        
        if (is_array($value)) {
            $this->attributes['top_highlights'] = json_encode($value);
        } else {
            $this->attributes['top_highlights'] = $value;
        }
    }
    
    // ✅ Default highlights for attar products
    public function getDefaultHighlights()
    {
        return [
            ['label' => 'Fragrance Family', 'value' => 'Oud, Amber, Musk'],
            ['label' => 'Longevity', 'value' => '24+ Hours'],
            ['label' => 'Alcohol-Free', 'value' => 'Yes'],
            ['label' => 'Handcrafted', 'value' => 'Traditional Techniques'],
            ['label' => 'Concentration', 'value' => 'Pure Attar Oil'],
            ['label' => 'Origin', 'value' => 'Premium Quality'],
            ['label' => 'Suitable For', 'value' => 'Men & Women'],
            ['label' => 'Occasion', 'value' => 'Daily Wear, Special Events']
        ];
    }
}