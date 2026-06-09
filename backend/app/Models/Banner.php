<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banners';
    protected $primaryKey = 'banner_id';
    protected $fillable = ['title', 'subtitle', 'description', 'image_url', 'button_text', 'button_link', 'position', 'is_active', 'display_order'];
}