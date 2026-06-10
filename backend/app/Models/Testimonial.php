<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;
    
    protected $table = 'testimonials';
    protected $primaryKey = 'testimonial_id';
    protected $fillable = ['user_name', 'user_location', 'rating', 'review', 'date', 'is_approved'];
    
    // Temporarily disable timestamps
    public $timestamps = false;
}