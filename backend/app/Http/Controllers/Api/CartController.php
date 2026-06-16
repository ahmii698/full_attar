<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // Get user's cart
    public function index()
    {
        $cart = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();
            
        // Decode ml_prices for each product
        foreach ($cart as $item) {
            if ($item->product && $item->product->ml_prices) {
                $item->product->ml_prices = json_decode($item->product->ml_prices, true);
            }
        }
        
        return response()->json($cart);
    }

    // Add to cart
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'quantity' => 'required|integer|min:1',
            'ml' => 'nullable|integer|in:50,60,70,80,90,100'
        ]);

        $product = Product::find($request->product_id);
        $ml = $request->ml ?? 50;
        
        // Get price for selected ML
        $mlPrices = $product->ml_prices ? json_decode($product->ml_prices, true) : [];
        $price = $mlPrices[$ml] ?? $product->price_num;

        // Check if item already exists in cart with same product and ML
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->where('ml', $ml)
            ->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Create new cart item
            $cartItem = Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'ml' => $ml
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $cartItem,
            'message' => 'Item added to cart'
        ], 201);
    }

    // Update cart item quantity
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('cart_id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'success' => true,
            'data' => $cartItem
        ]);
    }

    // Update cart item ML
    public function updateMl(Request $request, $id)
    {
        $request->validate([
            'ml' => 'required|integer|in:50,60,70,80,90,100'
        ]);

        $cartItem = Cart::where('cart_id', $id)
            ->where('user_id', Auth::id())
            ->with('product')
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cartItem->ml = $request->ml;
        $cartItem->save();

        // Get updated cart
        $cart = Cart::with('product')
            ->where('user_id', Auth::id())
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cartItem,
            'cart' => $cart
        ]);
    }

    // Remove from cart
    public function destroy($id)
    {
        $cartItem = Cart::where('cart_id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart'
        ]);
    }

    // Clear cart
    public function clear()
    {
        Cart::where('user_id', Auth::id())->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared'
        ]);
    }
}