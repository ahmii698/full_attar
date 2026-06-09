<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $table = 'social_links';
    protected $primaryKey = 'social_id';
    protected $fillable = ['platform', 'icon', 'url', 'display_order', 'is_active'];
}