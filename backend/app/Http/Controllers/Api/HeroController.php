<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use App\Models\HeroStat;

class HeroController extends Controller
{
    public function index()
    {
        $hero = HeroSlider::where('is_active', 1)->orderBy('display_order')->first();
        return response()->json($hero);
    }
    
    public function stats()
    {
        $stats = HeroStat::where('is_active', 1)->orderBy('display_order')->get();
        return response()->json($stats);
    }
}