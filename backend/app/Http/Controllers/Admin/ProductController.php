<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
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
            \Log::info('Store method called', $request->all());
            
            $data = $request->all();
            
            // Handle boolean fields
            $data['is_top_seller'] = $request->is_top_seller ?? 0;
            $data['is_new_arrival'] = $request->is_new_arrival ?? 0;
            $data['is_deal'] = $request->is_deal ?? 0;
            
            // Handle image - priority: uploaded file > image_url from request
            if ($request->hasFile('image')) {
                // New image uploaded
                $image = $request->file('image');
                $filename = time() . '_' . $image->getClientOriginalName();
                $path = $image->storeAs('products', $filename, 'public');
                $data['image_url'] = '/storage/' . $path;
            }
            // If image_url is provided directly (for duplicate)
            else if ($request->has('image_url') && $request->image_url) {
                $data['image_url'] = $request->image_url;
            }
            
            $product = Product::create($data);
            
            \Log::info('Product created successfully', ['id' => $product->product_id, 'image_url' => $product->image_url]);
            
            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Error creating product: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }
            
            // Update all fields
            $product->name = $request->name;
            $product->price = $request->price;
            $product->price_num = $request->price_num;
            $product->rating = $request->rating;
            $product->category = $request->category;
            $product->gender = $request->gender;
            $product->notes = $request->notes;
            $product->description = $request->description;
            $product->stock_quantity = $request->stock_quantity;
            $product->is_top_seller = $request->is_top_seller ?? 0;
            $product->is_new_arrival = $request->is_new_arrival ?? 0;
            $product->is_deal = $request->is_deal ?? 0;
            $product->discount_price = $request->discount_price;
            $product->discount_percent = $request->discount_percent;
            
            // Handle image
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image_url && strpos($product->image_url, '/storage/') === 0) {
                    $oldPath = str_replace('/storage/', '', $product->image_url);
                    Storage::disk('public')->delete($oldPath);
                }
                
                $image = $request->file('image');
                $filename = time() . '_' . $image->getClientOriginalName();
                $path = $image->storeAs('products', $filename, 'public');
                $product->image_url = '/storage/' . $path;
            }
            // If image_url is provided directly (for duplicate/update)
            else if ($request->has('image_url') && $request->image_url) {
                $product->image_url = $request->image_url;
            }
            
            $product->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error updating product: ' . $e->getMessage());
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
            if ($product && $product->image_url && strpos($product->image_url, '/storage/') === 0) {
                $oldPath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            Product::destroy($id);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}