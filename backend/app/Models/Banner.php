<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;
    
    protected $table = 'banners';
    protected $primaryKey = 'banner_id';
    protected $fillable = ['title', 'subtitle', 'description', 'image_url', 'button_text', 'button_link', 'position', 'is_active', 'display_order'];
    
    // Disable timestamps if your table doesn't have created_at/updated_at
    public $timestamps = false;
}