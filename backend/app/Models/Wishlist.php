<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;
    
    protected $table = 'wishlist';           // YEH ADD KARO
    protected $primaryKey = 'wishlist_id';   // YEH ADD KARO
    protected $fillable = ['user_id', 'product_id'];
    
    public $timestamps = true;               // YEH ADD KARO
}