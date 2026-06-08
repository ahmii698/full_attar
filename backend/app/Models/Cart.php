<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    
    protected $table = 'cart';               // YEH ADD KARO
    protected $primaryKey = 'cart_id';       // YEH ADD KARO
    protected $fillable = ['user_id', 'product_id', 'quantity'];
    
    public $timestamps = true;               // YEH ADD KARO
}