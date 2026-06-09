<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Outlet extends Model
{
    use HasFactory;
    
    protected $table = 'outlets';
    protected $primaryKey = 'outlet_id';
    protected $fillable = ['name', 'location', 'address', 'timings', 'phone', 'map_url', 'features', 'display_order', 'is_active'];
    
    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean'
    ];
}