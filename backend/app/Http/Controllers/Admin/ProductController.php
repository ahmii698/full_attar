<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Get all products
    public function index()
    {
        $products = Product::latest()->get();
        return response()->json($products);
    }
    
    // Get single product
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
    
    // Create new product
    public function store(Request $request)
    {
        $product = Product::create($request->all());
        return response()->json($product, 201);
    }
    
    // Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }
    
    // Delete product
    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json(['success' => true]);
    }
}