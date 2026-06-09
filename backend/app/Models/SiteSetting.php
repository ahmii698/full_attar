<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $table = 'site_settings';
    protected $primaryKey = 'setting_id';
    protected $fillable = ['setting_key', 'setting_value', 'setting_type'];
}