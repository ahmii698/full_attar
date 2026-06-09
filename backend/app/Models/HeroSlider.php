<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlider extends Model
{
    protected $table = 'hero_sliders';
    protected $primaryKey = 'slider_id';
    protected $fillable = ['title', 'subtitle', 'description', 'badge_text', 'button_text', 'button_link', 'image_url', 'stats', 'is_active', 'display_order'];
    
    protected $casts = [
        'stats' => 'array'
    ];
}