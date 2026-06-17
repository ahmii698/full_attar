<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $table = 'password_resets';
    public $timestamps = false;
    
    protected $fillable = [
        'email',
        'otp',
        'expires_at',
        'used',
        'created_at'
    ];
    
    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean'
    ];
}