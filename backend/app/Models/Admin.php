<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasFactory, HasApiTokens;
    
    protected $table = 'admins';           // YEH ADD KARO
    protected $primaryKey = 'admin_id';    // YEH ADD KARO
    protected $fillable = ['admin_name', 'admin_email', 'admin_password'];
    protected $hidden = ['admin_password'];
    
    public $timestamps = true;              // YEH ADD KARO
    
    public function getAuthPassword()
    {
        return $this->admin_password;
    }
}