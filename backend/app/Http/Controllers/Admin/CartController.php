<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Get all carts
    public function index()
    {
        $carts = Cart::with(['user', 'product'])
            ->orderBy('cart_id', 'desc')
            ->get();
            
        // Decode ml_prices for each product
        foreach ($carts as $item) {
            if ($item->product && $item->product->ml_prices) {
                $item->product->ml_prices = json_decode($item->product->ml_prices, true);
            }
        }
            
        return response()->json($carts);
    }

    // Get single cart item
    public function show($id)
    {
        $cart = Cart::with(['user', 'product'])
            ->findOrFail($id);
            
        if ($cart->product && $cart->product->ml_prices) {
            $cart->product->ml_prices = json_decode($cart->product->ml_prices, true);
        }
            
        return response()->json($cart);
    }

    // Update cart item (admin override)
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'ml' => 'sometimes|integer|in:50,60,70,80,90,100'
        ]);

        $cart = Cart::findOrFail($id);
        
        if ($request->has('quantity')) {
            $cart->quantity = $request->quantity;
        }
        
        if ($request->has('ml')) {
            $cart->ml = $request->ml;
        }
        
        $cart->save();

        return response()->json([
            'success' => true,
            'data' => $cart
        ]);
    }

    // Delete cart item
    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        $cart->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Cart item deleted'
        ]);
    }

    // Delete all carts of a user
    public function clearUserCart($userId)
    {
        Cart::where('user_id', $userId)->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'User cart cleared'
        ]);
    }

    // Get cart statistics
    public function stats()
    {
        $totalItems = Cart::count();
        $totalUsers = Cart::distinct('user_id')->count();
        
        return response()->json([
            'total_items' => $totalItems,
            'total_users' => $totalUsers
        ]);
    }
}