<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;
    
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $fillable = ['name', 'email', 'password', 'phone', 'address'];
    protected $hidden = ['password'];
    
    public $timestamps = true;
    
    // Add this relation
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'user_id');
    }
}