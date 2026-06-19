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
        'notes',
        'subtotal',        // ✅ Add if exists
        'shipping_amount'  // ✅ Add if exists
    ];
    
    protected $casts = [
        'order_date' => 'datetime',
        'total_amount' => 'decimal:2',
        'subtotal' => 'decimal:2',        // ✅ Add if exists
        'shipping_amount' => 'decimal:2'  // ✅ Add if exists
    ];
    
    // ✅ Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    
    // ✅ Relationship with Order Items
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }
    
    // ✅ Relationship with Payment Confirmation
    public function paymentConfirmation()
    {
        return $this->hasOne(PaymentConfirmation::class, 'order_id', 'order_id');
    }
    
    // ✅ Get customer full name (fallback)
    public function getCustomerNameAttribute()
    {
        if ($this->full_name) {
            return $this->full_name;
        }
        if ($this->user) {
            return $this->user->name;
        }
        return 'Customer';
    }
    
    // ✅ Get customer email (fallback)
    public function getCustomerEmailAttribute()
    {
        if ($this->email) {
            return $this->email;
        }
        if ($this->user) {
            return $this->user->email;
        }
        return null;
    }
    
    // ✅ Get order status label
    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'shipped' => 'Shipped',
            'delivered' => 'Delivered',
            'cancelled' => 'Cancelled'
        ];
        return $labels[$this->status] ?? ucfirst($this->status);
    }
    
    // ✅ Get payment status label
    public function getPaymentStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Pending',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'refunded' => 'Refunded'
        ];
        return $labels[$this->payment_status] ?? ucfirst($this->payment_status);
    }
    
    // ✅ Scope for pending orders
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
    
    // ✅ Scope for processing orders
    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }
    
    // ✅ Scope for shipped orders
    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }
    
    // ✅ Scope for delivered orders
    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }
    
    // ✅ Scope for cancelled orders
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }
    
    // ✅ Scope for paid orders
    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }
}