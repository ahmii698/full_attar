<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $table = 'orders';             // YEH ADD KARO
    protected $primaryKey = 'order_id';      // YEH ADD KARO
    protected $fillable = ['user_id', 'order_number', 'total_amount', 'status', 'payment_status', 'shipping_address', 'payment_method'];
    
    public $timestamps = true;               // YEH ADD KARO
    
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }
}