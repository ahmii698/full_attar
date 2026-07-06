<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\CategoryProductSetting; // ✅ ADD THIS
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Get all categories with product count
     */
    public function index()
    {
        $categories = Category::orderBy('category_id', 'asc')->get();
            
        $categories->each(function($category) {
            $category->product_count = $category->products()->count();
        });
            
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Get single category
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * Create new category
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name',
            'category_slug' => 'nullable|string|max:255|unique:categories,category_slug',
        ]);

        $category = Category::create([
            'category_name' => $request->category_name,
            'category_slug' => $request->category_slug ?? Str::slug($request->category_name),
            'show_in_navbar' => $request->has('show_in_navbar') ? (int)$request->show_in_navbar : 1,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }

    /**
     * ✅ Update category - Simplified for show_in_navbar toggle
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        if ($request->has('show_in_navbar') && !$request->has('category_name') && !$request->has('category_slug')) {
            $category->show_in_navbar = (int)$request->show_in_navbar;
            $category->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        }

        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name,' . $id . ',category_id',
            'category_slug' => 'nullable|string|max:255|unique:categories,category_slug,' . $id . ',category_id',
        ]);

        $updateData = [
            'category_name' => $request->category_name,
            'category_slug' => $request->category_slug ?? Str::slug($request->category_name),
        ];

        if ($request->has('show_in_navbar')) {
            $updateData['show_in_navbar'] = (int)$request->show_in_navbar;
        }

        $category->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    /**
     * Delete category (only if no products)
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        $productCount = $category->products()->count();
        if ($productCount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete category with ' . $productCount . ' products.'
            ], 422);
        }
        
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    /**
     * ✅ Get products by category with category-specific show_in_navbar
     */
    public function products($id)
    {
        $category = Category::findOrFail($id);
        
        // ✅ Get all product IDs for this category
        $productIds = $category->products()->pluck('products.product_id')->toArray();
        
        // ✅ Get settings from category_product_settings table
        $settings = CategoryProductSetting::where('category_id', $id)
            ->whereIn('product_id', $productIds)
            ->get()
            ->keyBy('product_id');
        
        // ✅ Get products
        $products = Product::whereIn('product_id', $productIds)
            ->orderBy('name')
            ->get();
        
        // ✅ Add show_in_navbar from settings
        $products->each(function($product) use ($settings) {
            $product->show_in_navbar = $settings->has($product->product_id) 
                ? (int)$settings->get($product->product_id)->show_in_navbar 
                : 0;
        });
            
        return response()->json([
            'success' => true,
            'data' => $products,
            'category' => $category
        ]);
    }
}