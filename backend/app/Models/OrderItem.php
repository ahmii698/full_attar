<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    
    protected $table = 'order_items';
    protected $primaryKey = 'order_item_id';
    public $timestamps = false;
    
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'quantity',
        'ml',
        'price',
        'total',           // ✅ Add if exists
        'subtotal'         // ✅ Add if exists
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',        // ✅ Add if exists
        'subtotal' => 'decimal:2'      // ✅ Add if exists
    ];
    
    // ✅ Relationship with Order
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
    
    // ✅ Relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
    
    // ✅ Get total price for this item
    public function getTotalPriceAttribute()
    {
        return ($this->price ?? 0) * ($this->quantity ?? 1);
    }
    
    // ✅ Get formatted price
    public function getFormattedPriceAttribute()
    {
        return 'Rs. ' . number_format($this->price ?? 0, 0);
    }
    
    // ✅ Get formatted total
    public function getFormattedTotalAttribute()
    {
        return 'Rs. ' . number_format($this->getTotalPriceAttribute(), 0);
    }
    
    // ✅ Get display name with ml
    public function getDisplayNameAttribute()
    {
        $name = $this->product_name ?? 'Product';
        if ($this->ml) {
            $name .= ' (' . $this->ml . 'ml)';
        }
        return $name;
    }
    
    // ✅ Scope for order items
    public function scopeForOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }
    
    // ✅ Scope for product
    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }
}