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
        'item_type',
        'product_name',
        'quantity',
        'ml',
        'price',
        'total',
        'subtotal'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    // Sirf attar items ke liye
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    // Sirf shoe items ke liye
    public function shoe()
    {
        return $this->belongsTo(Shoe::class, 'product_id', 'shoe_id');
    }

    public function getTotalPriceAttribute()
    {
        return ($this->price ?? 0) * ($this->quantity ?? 1);
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rs. ' . number_format($this->price ?? 0, 0);
    }

    public function getFormattedTotalAttribute()
    {
        return 'Rs. ' . number_format($this->getTotalPriceAttribute(), 0);
    }

    public function getDisplayNameAttribute()
    {
        $name = $this->product_name ?? 'Product';
        if ($this->ml) {
            $name .= ' (' . $this->ml . 'ml)';
        }
        return $name;
    }

    public function scopeForOrder($query, $orderId)
    {
        return $query->where('order_id', $orderId);
    }

    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }
}