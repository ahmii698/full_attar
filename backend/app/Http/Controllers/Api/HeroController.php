<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use App\Models\HeroStat;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    // ✅ Helper function for image URL
    private function getImageUrl($imagePath)
    {
        if (!$imagePath) return null;
        
        // Agar already full URL hai toh wapas karo
        if (filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return $imagePath;
        }
        
        // Agar /assets/ se start ho raha hai toh frontend URL use karo
        if (strpos($imagePath, '/assets/') === 0) {
            return config('app.frontend_url', 'https://attar.fusixtech.com') . $imagePath;
        }
        
        // /images/ ya /storage/ ke liye backend URL use karo
        if (strpos($imagePath, '/images/') === 0 || strpos($imagePath, '/storage/') === 0) {
            return config('app.url') . $imagePath;
        }
        
        return $imagePath;
    }
    
    public function index()
    {
        try {
            $sliders = HeroSlider::where('is_active', 1)
                ->orderBy('display_order')
                ->get();
            
            foreach ($sliders as $slider) {
                if ($slider->image_url) {
                    $slider->image_url = $this->getImageUrl($slider->image_url);
                }
            }
            
            return response()->json($sliders);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
    
    public function stats()
    {
        try {
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
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}