<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';

    // ✅ Add first_name and last_name to fillable
    protected $fillable = [
        'first_name',   // ✅ New field
        'last_name',    // ✅ New field
        'name',         // Keep for backward compatibility
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ✅ Get full name attribute
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    // ✅ Get display name (fallback to name if first_name not set)
    public function getDisplayNameAttribute()
    {
        if ($this->first_name && $this->last_name) {
            return $this->first_name . ' ' . $this->last_name;
        }
        return $this->name ?? $this->email;
    }

    // ✅ Get first name (fallback)
    public function getFirstNameAttribute($value)
    {
        return $value ?? '';
    }

    // ✅ Get last name (fallback)
    public function getLastNameAttribute($value)
    {
        return $value ?? '';
    }

    // ✅ Set full name (split into first and last)
    public function setFullNameAttribute($value)
    {
        $parts = explode(' ', $value, 2);
        $this->attributes['first_name'] = $parts[0] ?? '';
        $this->attributes['last_name'] = $parts[1] ?? '';
        $this->attributes['name'] = $value;
    }
}