<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            // ✅ Load categories relationship
            $query = Product::with('categories');
            
            // ✅ Category filter - through relationship
            if ($request->category && $request->category != 'All') {
                $query->whereHas('categories', function($q) use ($request) {
                    $q->where('category_name', $request->category);
                });
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
            
            foreach ($products as $product) {
                // Image URL fix
                if ($product->image_url) {
                    if (strpos($product->image_url, '/images/') === 0) {
                        $product->image_url = env('APP_URL') . $product->image_url;
                    }
                }
                
                // ✅ FIX: Decode ml_prices if it's a string
                if ($product->ml_prices && is_string($product->ml_prices)) {
                    $product->ml_prices = json_decode($product->ml_prices, true);
                }
                
                if ($product->ml_prices === null) {
                    $product->ml_prices = [];
                }
            }
            
            return response()->json($products);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
    
    public function show($id)
    {
        try {
            // ✅ Load categories relationship
            $product = Product::with('categories')->findOrFail($id);
            
            if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                $product->image_url = env('APP_URL') . $product->image_url;
            }
            
            if ($product->ml_prices && is_string($product->ml_prices)) {
                $product->ml_prices = json_decode($product->ml_prices, true);
            }
            
            if ($product->ml_prices === null) {
                $product->ml_prices = [];
            }
            
            return response()->json($product);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function topSellers()
    {
        try {
            // ✅ Load categories relationship
            $products = Product::with('categories')->where('is_top_seller', 1)->get();
            
            foreach ($products as $product) {
                if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                    $product->image_url = env('APP_URL') . $product->image_url;
                }
                
                if ($product->ml_prices && is_string($product->ml_prices)) {
                    $product->ml_prices = json_decode($product->ml_prices, true);
                }
                
                if ($product->ml_prices === null) {
                    $product->ml_prices = [];
                }
            }
            
            return response()->json($products);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function newArrivals()
    {
        try {
            // ✅ Load categories relationship
            $products = Product::with('categories')->where('is_new_arrival', 1)->get();
            
            foreach ($products as $product) {
                if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                    $product->image_url = env('APP_URL') . $product->image_url;
                }
                
                if ($product->ml_prices && is_string($product->ml_prices)) {
                    $product->ml_prices = json_decode($product->ml_prices, true);
                }
                
                if ($product->ml_prices === null) {
                    $product->ml_prices = [];
                }
            }
            
            return response()->json($products);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function deals()
    {
        try {
            // ✅ Load categories relationship
            $products = Product::with('categories')->where('is_deal', 1)->get();
            
            foreach ($products as $product) {
                if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                    $product->image_url = env('APP_URL') . $product->image_url;
                }
                
                if ($product->ml_prices && is_string($product->ml_prices)) {
                    $product->ml_prices = json_decode($product->ml_prices, true);
                }
                
                if ($product->ml_prices === null) {
                    $product->ml_prices = [];
                }
            }
            
            return response()->json($products);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function categories()
    {
        // ✅ Get categories from database
        $categories = Category::where('show_in_navbar', 1)
            ->orderBy('category_id')
            ->pluck('category_name')
            ->toArray();
            
        return response()->json($categories);
    }
}