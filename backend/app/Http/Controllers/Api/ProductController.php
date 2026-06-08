<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Get all products with filters
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
        return response()->json($products);
    }
    
    // Get single product
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
    
    // Get top sellers
    public function topSellers()
    {
        $products = Product::where('is_top_seller', 1)->get();
        return response()->json($products);
    }
    
    // Get new arrivals
    public function newArrivals()
    {
        $products = Product::where('is_new_arrival', 1)->get();
        return response()->json($products);
    }
    
    // Get categories
    public function categories()
    {
        $categories = ['Premium', 'Western', 'Eastern'];
        return response()->json($categories);
    }
}