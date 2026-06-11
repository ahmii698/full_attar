<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroStat extends Model
{
    protected $table = 'hero_stats';
    protected $primaryKey = 'stat_id';
    protected $fillable = ['stat_value', 'stat_label', 'display_order', 'is_active'];
    
    public $timestamps = false;
}