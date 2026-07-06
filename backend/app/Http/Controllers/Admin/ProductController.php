<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\CategoryProductSetting; // ✅ ADD THIS
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('categories')->orderBy('product_id', 'desc')->get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('categories')->findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        try {
            $product = new Product();
            $product->name = $request->name;
            $product->price = $request->price;
            $product->price_num = $request->price_num;
            $product->discount_price = $request->discount_price;
            $product->discount_percent = $request->discount_percent;
            $product->is_deal = $request->is_deal ?? 0;
            $product->rating = $request->rating ?? 0;
            $product->gender = $request->gender;
            $product->notes = $request->notes;
            $product->stock_quantity = $request->stock_quantity ?? 10;
            $product->is_top_seller = $request->is_top_seller ?? 0;
            $product->is_new_arrival = $request->is_new_arrival ?? 0;
            $product->description = $request->description ?? null;
            
            $product->show_in_navbar = $request->has('show_in_navbar') ? 1 : 0;
            
            if ($request->has('top_highlights')) {
                $highlights = $request->top_highlights;
                if (is_string($highlights)) {
                    $highlights = json_decode($highlights, true);
                }
                $product->top_highlights = $highlights;
            } else {
                $product->top_highlights = null;
            }

            if ($request->has('ml_prices')) {
                $mlPrices = $request->ml_prices;
                if (is_string($mlPrices)) {
                    $mlPrices = json_decode($mlPrices, true);
                }
                $product->ml_prices = json_encode($mlPrices);
            }

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $path = $image->store('products', 'public');
                $product->image_url = Storage::url($path);
            } else if ($request->image_url) {
                $product->image_url = $request->image_url;
            }

            $product->save();

            if ($request->has('category_ids')) {
                $categoryIds = json_decode($request->category_ids, true);
                if (is_array($categoryIds) && count($categoryIds) > 0) {
                    $product->categories()->sync($categoryIds);
                }
            }

            $product->load('categories');

            return response()->json([
                'success' => true,
                'data' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::find($id);
            
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }
            
            Log::info('Update Product Request:', [
                'product_id' => $id,
                'has_show_in_navbar' => $request->has('show_in_navbar'),
                'show_in_navbar_value' => $request->input('show_in_navbar'),
                'all_data' => $request->all()
            ]);
            
            if ($request->has('show_in_navbar')) {
                $product->show_in_navbar = (int)$request->show_in_navbar;
                $product->save();
                Log::info('Updated show_in_navbar to: ' . $product->show_in_navbar);
                
                if (!$request->has('name') && !$request->has('price_num') && !$request->has('gender')) {
                    $product->load('categories');
                    return response()->json([
                        'success' => true,
                        'data' => $product
                    ]);
                }
            }
            
            if ($request->has('name')) $product->name = $request->name;
            if ($request->has('price')) $product->price = $request->price;
            if ($request->has('price_num')) $product->price_num = $request->price_num;
            if ($request->has('discount_price')) $product->discount_price = $request->discount_price;
            if ($request->has('discount_percent')) $product->discount_percent = $request->discount_percent;
            if ($request->has('gender')) $product->gender = $request->gender;
            if ($request->has('notes')) $product->notes = $request->notes;
            if ($request->has('stock_quantity')) $product->stock_quantity = $request->stock_quantity;
            if ($request->has('description')) $product->description = $request->description;
            
            if ($request->has('is_deal')) $product->is_deal = (int)$request->is_deal;
            if ($request->has('is_top_seller')) $product->is_top_seller = (int)$request->is_top_seller;
            if ($request->has('is_new_arrival')) $product->is_new_arrival = (int)$request->is_new_arrival;
            if ($request->has('rating')) $product->rating = (float)$request->rating;
            
            if ($request->has('top_highlights')) {
                $highlights = $request->top_highlights;
                if (is_string($highlights)) {
                    $highlights = json_decode($highlights, true);
                }
                $product->top_highlights = $highlights;
            }

            if ($request->has('ml_prices')) {
                $mlPrices = $request->ml_prices;
                if (is_string($mlPrices)) {
                    $mlPrices = json_decode($mlPrices, true);
                }
                $product->ml_prices = json_encode($mlPrices);
            }

            if ($request->hasFile('image')) {
                if ($product->image_url) {
                    $oldPath = str_replace('/storage/', '', $product->image_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $path = $request->file('image')->store('products', 'public');
                $product->image_url = Storage::url($path);
            } else if ($request->has('image_url')) {
                $product->image_url = $request->image_url;
            }
            
            $product->save();

            if ($request->has('category_ids')) {
                $categoryIds = json_decode($request->category_ids, true);
                if (is_array($categoryIds) && count($categoryIds) > 0) {
                    $product->categories()->sync($categoryIds);
                }
            }

            $product->load('categories');
            
            Log::info('Product updated successfully:', [
                'product_id' => $id,
                'show_in_navbar' => $product->show_in_navbar
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
            
        } catch (\Exception $e) {
            Log::error('Update Product Error:', [
                'product_id' => $id,
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ NEW: Toggle product show_in_navbar for specific category
     */
    public function toggleNavbar(Request $request, $productId, $categoryId)
    {
        try {
            // ✅ Check if product exists
            $product = Product::find($productId);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'error' => 'Product not found'
                ], 404);
            }

            // ✅ Check if category exists
            $category = Category::find($categoryId);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'error' => 'Category not found'
                ], 404);
            }

            // ✅ Get or create setting
            $setting = CategoryProductSetting::where('product_id', $productId)
                ->where('category_id', $categoryId)
                ->first();

            $newStatus = $request->show_in_navbar ?? 0;

            if (!$setting) {
                $setting = CategoryProductSetting::create([
                    'product_id' => $productId,
                    'category_id' => $categoryId,
                    'show_in_navbar' => $newStatus
                ]);
            } else {
                $setting->show_in_navbar = $newStatus;
                $setting->save();
            }

            Log::info('Category Product Setting updated:', [
                'product_id' => $productId,
                'category_id' => $categoryId,
                'show_in_navbar' => $setting->show_in_navbar
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product navbar status updated successfully',
                'data' => $setting
            ]);

        } catch (\Exception $e) {
            Log::error('Toggle Navbar Error:', [
                'product_id' => $productId,
                'category_id' => $categoryId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::find($id);
            if ($product) {
                $product->categories()->detach();
                
                if ($product->image_url) {
                    $oldPath = str_replace('/storage/', '', $product->image_url);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
                $product->delete();
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}