<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::where('is_active', 1)->orderBy('display_order')->get();
        return response()->json($banners);
    }
}