<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();
        
        if ($request->category && $request->category != 'All') {
            $query->where('category', $request->category)->orWhere('name', $request->category);
        }
        
        if ($request->gender && $request->gender != 'All') {
            $query->where('gender', $request->gender);
        }
        
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        if ($request->min_price) {
            $query->where('price_num', '>=', $request->min_price);
        }
        
        if ($request->max_price) {
            $query->where('price_num', '<=', $request->max_price);
        }
        
        $products = $query->get();
        
        // ✅ Add full image URLs
        foreach ($products as $product) {
            if ($product->image_url) {
                if (str_starts_with($product->image_url, '/images/')) {
                    $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
                }
            }
        }
        
        return response()->json($products);
    }
    
    public function show($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->image_url && str_starts_with($product->image_url, '/images/')) {
            $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
        }
        
        return response()->json($product);
    }
    
    public function topSellers()
    {
        $products = Product::where('is_top_seller', 1)->get();
        
        foreach ($products as $product) {
            if ($product->image_url && str_starts_with($product->image_url, '/images/')) {
                $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
            }
        }
        
        return response()->json($products);
    }
    
    public function newArrivals()
    {
        $products = Product::where('is_new_arrival', 1)->get();
        
        foreach ($products as $product) {
            if ($product->image_url && str_starts_with($product->image_url, '/images/')) {
                $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
            }
        }
        
        return response()->json($products);
    }
    
    public function deals()
    {
        $products = Product::where('is_deal', 1)->get();
        
        foreach ($products as $product) {
            if ($product->image_url && str_starts_with($product->image_url, '/images/')) {
                $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
            }
        }
        
        return response()->json($products);
    }
    
    public function categories()
    {
        $categories = ['Premium', 'Western', 'Eastern'];
        return response()->json($categories);
    }
}