<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request)
    {
        $query = Faq::where('is_active', 1)->orderBy('display_order');
        
        if ($request->category) {
            $query->where('category', $request->category);
        }
        
        $faqs = $query->get();
        return response()->json($faqs);
    }
    
    public function categories()
    {
        $categories = Faq::where('is_active', 1)
            ->select('category')
            ->distinct()
            ->pluck('category');
        
        return response()->json($categories);
    }
}