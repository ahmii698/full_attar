<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;
    
    protected $table = 'testimonials';       // YEH ADD KARO
    protected $primaryKey = 'testimonial_id'; // YEH ADD KARO
    protected $fillable = ['user_name', 'user_location', 'rating', 'review', 'date', 'is_approved'];
    
    public $timestamps = true;               // YEH ADD KARO
}