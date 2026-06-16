<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    public $timestamps = false;
    
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'payment_status',
        'shipping_address',
        'payment_method',
        'order_date',
        'full_name',
        'email',
        'phone',
        'city',
        'zipcode',
        'notes'
    ];
    
    protected $casts = [
        'order_date' => 'datetime',
        'total_amount' => 'decimal:2'
    ];
    
    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    // Relationship with Order Items
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }
    
    // Relationship with Payment Confirmation
    public function paymentConfirmation()
    {
        return $this->hasOne(PaymentConfirmation::class, 'order_id', 'order_id');
    }
}