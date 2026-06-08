<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;
    
    protected $table = 'users';            // YEH ADD KARO
    protected $primaryKey = 'user_id';     // YEH ADD KARO
    protected $fillable = ['name', 'email', 'password', 'phone', 'address'];
    protected $hidden = ['password'];
    
    public $timestamps = true;              // YEH ADD KARO
}