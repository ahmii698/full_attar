<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SocialLink;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->pluck('setting_value', 'setting_key');
        return response()->json($settings);
    }
    
    public function socialLinks()
    {
        $links = SocialLink::where('is_active', 1)->orderBy('display_order')->get();
        return response()->json($links);
    }
}