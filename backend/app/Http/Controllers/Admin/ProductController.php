<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('product_id', 'desc')->get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
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
            $product->category = $request->category;
            $product->gender = $request->gender;
            $product->notes = $request->notes;
            $product->stock_quantity = $request->stock_quantity ?? 10;
            $product->is_top_seller = $request->is_top_seller ?? 0;
            $product->is_new_arrival = $request->is_new_arrival ?? 0;

            // ✅ Handle ML Prices
            if ($request->has('ml_prices')) {
                $mlPrices = $request->ml_prices;
                // If it's a JSON string, decode it
                if (is_string($mlPrices)) {
                    $mlPrices = json_decode($mlPrices, true);
                }
                $product->ml_prices = json_encode($mlPrices);
            }

            // ✅ Handle image upload - direct public folder
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $image->getClientOriginalName());
                
                $destinationPath = public_path('images/products');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
                
                $image->move($destinationPath, $filename);
                $product->image_url = '/images/products/' . $filename;
            } else if ($request->image_url) {
                $product->image_url = $request->image_url;
            }

            $product->save();

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
            
            $product->name = $request->name;
            $product->price = $request->price;
            $product->price_num = $request->price_num;
            $product->discount_price = $request->discount_price;
            $product->discount_percent = $request->discount_percent;
            $product->is_deal = $request->is_deal ?? 0;
            $product->rating = $request->rating ?? 0;
            $product->category = $request->category;
            $product->gender = $request->gender;
            $product->notes = $request->notes;
            $product->stock_quantity = $request->stock_quantity ?? 10;
            $product->is_top_seller = $request->is_top_seller ?? 0;
            $product->is_new_arrival = $request->is_new_arrival ?? 0;

            // ✅ Handle ML Prices
            if ($request->has('ml_prices')) {
                $mlPrices = $request->ml_prices;
                // If it's a JSON string, decode it
                if (is_string($mlPrices)) {
                    $mlPrices = json_decode($mlPrices, true);
                }
                $product->ml_prices = json_encode($mlPrices);
            } else {
                // If no ml_prices sent, keep existing or set null
                // You can choose to keep existing or set null
                // $product->ml_prices = null;
            }

            // ✅ Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image_url && file_exists(public_path($product->image_url))) {
                    unlink(public_path($product->image_url));
                }
                
                $image = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $image->getClientOriginalName());
                
                $destinationPath = public_path('images/products');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
                
                $image->move($destinationPath, $filename);
                $product->image_url = '/images/products/' . $filename;
            } else if ($request->image_url) {
                $product->image_url = $request->image_url;
            }
            
            $product->save();
            
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::find($id);
            if ($product) {
                // Delete associated image
                if ($product->image_url && file_exists(public_path($product->image_url))) {
                    unlink(public_path($product->image_url));
                }
                $product->delete();
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}