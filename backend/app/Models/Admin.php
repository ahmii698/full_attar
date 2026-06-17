<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasFactory, HasApiTokens;
    
    protected $table = 'admins';
    protected $primaryKey = 'admin_id';
    
    protected $fillable = [
        'admin_name', 
        'admin_email', 
        'admin_password',
        'admin_role',
        'remember_token'
    ];
    
    protected $hidden = [
        'admin_password',
        'remember_token'
    ];
    
    public $timestamps = true;
    
    // ✅ For Sanctum authentication - password field
    public function getAuthPassword()
    {
        return $this->admin_password;
    }
    
    // ✅ For Sanctum authentication - username field
    public function getAuthIdentifierName()
    {
        return 'admin_id';
    }
    
    // ✅ For Sanctum authentication - remember token
    public function getRememberToken()
    {
        return $this->remember_token;
    }
    
    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }
    
    public function getRememberTokenName()
    {
        return 'remember_token';
    }
}