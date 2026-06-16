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
        'price'
    ];
    
    // Relationship with Order
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
    
    // Relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}