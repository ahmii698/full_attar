<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Product::query();
            
            if ($request->category && $request->category != 'All') {
                $query->where('category', $request->category);
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
                        $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
                    }
                }
                
                // ✅ FIX: Decode ml_prices if it's a string
                if ($product->ml_prices && is_string($product->ml_prices)) {
                    $product->ml_prices = json_decode($product->ml_prices, true);
                }
                
                // ✅ If null, set as empty array
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
            $product = Product::findOrFail($id);
            
            if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
            }
            
            // ✅ FIX: Decode ml_prices if it's a string
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
            $products = Product::where('is_top_seller', 1)->get();
            
            foreach ($products as $product) {
                if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                    $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
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
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function newArrivals()
    {
        try {
            $products = Product::where('is_new_arrival', 1)->get();
            
            foreach ($products as $product) {
                if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                    $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
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
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function deals()
    {
        try {
            $products = Product::where('is_deal', 1)->get();
            
            foreach ($products as $product) {
                if ($product->image_url && strpos($product->image_url, '/images/') === 0) {
                    $product->image_url = 'http://127.0.0.1:8000' . $product->image_url;
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
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    public function categories()
    {
        $categories = ['Premium', 'Western', 'Eastern'];
        return response()->json($categories);
    }
}