<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'order_id';

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
    ];

    protected $casts = [
        'order_date'   => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
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

    // Customer full name (fallback)
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

    // Customer email (fallback)
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

    // Order status label
    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending'    => 'Pending',
            'processing' => 'Processing',
            'shipped'    => 'Shipped',
            'delivered'  => 'Delivered',
            'cancelled'  => 'Cancelled',
        ];
        return $labels[$this->status] ?? ucfirst($this->status);
    }

    // Payment status label
    public function getPaymentStatusLabelAttribute()
    {
        $labels = [
            'pending'  => 'Pending',
            'paid'     => 'Paid',
            'failed'   => 'Failed',
            'refunded' => 'Refunded',
        ];
        return $labels[$this->payment_status] ?? ucfirst($this->payment_status);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeShipped($query)
    {
        return $query->where('status', 'shipped');
    }

    public function scopeDelivered($query)
    {
        return $query->where('status', 'delivered');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }
}