<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\CategoryProductSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Get all categories (for shop page - ALL categories)
     */
    public function index()
    {
        try {
            // ✅ REMOVED: where('show_in_navbar', 1) - SAARI categories dikhao
            $categories = Category::orderBy('category_id', 'asc')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            Log::error('Category index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = Category::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $category
            ]);
        } catch (\Exception $e) {
            Log::error('Category show error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function products($id)
    {
        try {
            $category = Category::findOrFail($id);
            
            $products = $category->products()
                ->orderBy('name')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $products,
                'category' => $category
            ]);
        } catch (\Exception $e) {
            Log::error('Category products error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Navbar Categories - Only show categories with show_in_navbar = 1
     */
    public function navbarCategories()
    {
        try {
            // ✅ Navbar ke liye sirf show_in_navbar = 1 wali categories
            $categories = Category::where('show_in_navbar', 1)
                ->orderBy('category_id', 'asc')
                ->get();
            
            $result = [];
            
            foreach ($categories as $cat) {
                $key = strtolower($cat->category_name);
                if (empty($key)) continue;
                
                $productIds = CategoryProductSetting::where('category_id', $cat->category_id)
                    ->where('show_in_navbar', 1)
                    ->pluck('product_id')
                    ->toArray();
                
                if (empty($productIds)) {
                    $productIds = $cat->products()->pluck('products.product_id')->toArray();
                }
                
                $products = Product::whereIn('product_id', $productIds)
                    ->orderBy('name')
                    ->limit(3)
                    ->get(['product_id', 'name']);
                
                $items = [];
                
                $items[] = [
                    'id' => $cat->category_id,
                    'name' => $cat->category_name,
                    'display_name' => $cat->category_name,
                    'filter' => $cat->category_name,
                    'is_category' => true,
                ];
                
                foreach ($products as $product) {
                    $items[] = [
                        'id' => $product->product_id,
                        'name' => $product->name,
                        'display_name' => $product->name,
                        'filter' => $product->name,
                        'is_category' => false,
                    ];
                }
                
                $result[$key] = $items;
            }
            
            $result['gender'] = [
                ['name' => 'Male', 'filter' => 'Male', 'display_name' => 'Male'],
                ['name' => 'Female', 'filter' => 'Female', 'display_name' => 'Female'],
                ['name' => 'Unisex', 'filter' => 'Unisex', 'display_name' => 'Unisex']
            ];
            
            return response()->json([
                'success' => true,
                'data' => $result
            ]);
            
        } catch (\Exception $e) {
            Log::error('Navbar Categories Error: ' . $e->getMessage());
            Log::error('Error line: ' . $e->getLine());
            Log::error('Error file: ' . $e->getFile());
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}