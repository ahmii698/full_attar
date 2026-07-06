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
        'gender', 
        'notes', 
        'image_url', 
        'description',
        'top_highlights',
        'stock_quantity', 
        'is_top_seller', 
        'is_new_arrival',
        'is_deal', 
        'discount_price', 
        'discount_percent',
        'ml_prices',
        'show_in_navbar',  // ✅ ADDED
    ];
    
    protected $casts = [
        'ml_prices' => 'array',
        'top_highlights' => 'array',
        'is_deal' => 'boolean',
        'is_top_seller' => 'boolean',
        'is_new_arrival' => 'boolean',
        'show_in_navbar' => 'boolean',
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
    
    // ✅ Many-to-Many relationship with categories
    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'product_categories',
            'product_id',
            'category_id'
        );
    }
    
    // ✅ NEW: Category Product Settings relationship
    public function categorySettings()
    {
        return $this->hasMany(CategoryProductSetting::class, 'product_id', 'product_id');
    }
    
    // ✅ NEW: Get navbar status for specific category
    public function getNavbarStatus($categoryId)
    {
        $setting = $this->categorySettings()->where('category_id', $categoryId)->first();
        return $setting ? (bool)$setting->show_in_navbar : false;
    }
    
    // ✅ Helper to get category names as array
    public function getCategoryNamesAttribute()
    {
        return $this->categories->pluck('category_name')->toArray();
    }
    
    // ✅ Helper to get category ids as array
    public function getCategoryIdsAttribute()
    {
        return $this->categories->pluck('category_id')->toArray();
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