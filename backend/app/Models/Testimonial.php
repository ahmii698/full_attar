<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;
    
    protected $table = 'testimonials';
    protected $primaryKey = 'testimonial_id';
    
    protected $fillable = [
        'user_name',
        'user_location',
        'rating',
        'review',
        'is_approved'
    ];
    
    // ✅ Disable timestamps (since table has no created_at/updated_at)
    public $timestamps = false;
    
    protected $casts = [
        'is_approved' => 'boolean',
        'rating' => 'integer'
    ];
}