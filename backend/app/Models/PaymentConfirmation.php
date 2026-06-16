<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentConfirmation extends Model
{
    use HasFactory;
    
    protected $table = 'payment_confirmations';
    public $timestamps = true;
    
    protected $fillable = [
        'order_id',
        'user_id',
        'transaction_id',
        'screenshot_path',
        'amount',
        'status',
        'admin_notes'
    ];
    
    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    // Relationship with Order
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
    
    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}