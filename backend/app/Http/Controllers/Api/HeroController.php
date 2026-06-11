<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use App\Models\HeroStat;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function index()
    {
        $sliders = HeroSlider::where('is_active', 1)
            ->orderBy('display_order')
            ->get();
        
        foreach ($sliders as $slider) {
            if ($slider->image_url) {
                if (str_starts_with($slider->image_url, '/images/')) {
                    $slider->image_url = 'http://127.0.0.1:8000' . $slider->image_url;
                } elseif (str_starts_with($slider->image_url, '/storage/')) {
                    $slider->image_url = 'http://127.0.0.1:8000' . $slider->image_url;
                }
            }
        }
        
        return response()->json($sliders);
    }
    
    public function stats()
    {
        // First try to get from database
        $statsFromDb = HeroStat::where('is_active', 1)
            ->orderBy('display_order')
            ->get();
        
        if ($statsFromDb->isNotEmpty()) {
            return response()->json($statsFromDb);
        }
        
        // Fallback to default stats
        $stats = [
            ['stat_value' => '100%', 'stat_label' => 'Natural Ingredients'],
            ['stat_value' => '24+', 'stat_label' => 'Hours Longevity'],
            ['stat_value' => '50+', 'stat_label' => 'Premium Blends'],
        ];
        return response()->json($stats);
    }
}