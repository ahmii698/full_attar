<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    
    protected $table = 'cart';
    protected $primaryKey = 'cart_id';
    protected $fillable = [
        'user_id', 
        'product_id', 
        'quantity',
        'ml'  // ✅ ADDED - ML column
    ];
    
    // ✅ Timestamps - added_at column exists in database
    public $timestamps = true;
    const CREATED_AT = 'added_at';
    const UPDATED_AT = null;  // No updated_at column in cart table
    
    // ✅ Relationship with Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
    
    // ✅ Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}