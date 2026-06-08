<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    
    protected $table = 'order_items';        // YEH ADD KARO
    protected $primaryKey = 'order_item_id'; // YEH ADD KARO
    protected $fillable = ['order_id', 'product_id', 'product_name', 'quantity', 'price'];
    
    public $timestamps = false;              // YEH ADD KARO (agar timestamp column nahi hai)
}