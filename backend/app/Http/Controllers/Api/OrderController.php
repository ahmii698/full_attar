<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Wishlist;
use App\Models\ContactQuery;
use App\Models\Newsletter;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // ========== CART FUNCTIONS ==========
    
    public function getCart(Request $request)
    {
        $cart = Cart::with('product')->where('user_id', $request->user()->user_id)->get();
        return response()->json($cart);
    }
    
    public function addToCart(Request $request)
    {
        $cart = Cart::updateOrCreate(
            [
                'user_id' => $request->user()->user_id,
                'product_id' => $request->product_id
            ],
            ['quantity' => $request->quantity]
        );
        return response()->json($cart);
    }
    
    public function removeFromCart($id)
    {
        Cart::destroy($id);
        return response()->json(['success' => true]);
    }
    
    // ========== WISHLIST FUNCTIONS ==========
    
    public function getWishlist(Request $request)
    {
        $wishlist = Wishlist::with('product')->where('user_id', $request->user()->user_id)->get();
        return response()->json($wishlist);
    }
    
    public function addToWishlist(Request $request)
    {
        $wishlist = Wishlist::firstOrCreate([
            'user_id' => $request->user()->user_id,
            'product_id' => $request->product_id
        ]);
        return response()->json($wishlist);
    }
    
    public function removeFromWishlist($id)
    {
        Wishlist::destroy($id);
        return response()->json(['success' => true]);
    }
    
    // ========== ORDER FUNCTIONS ==========
    
    public function placeOrder(Request $request)
    {
        $order = Order::create([
            'user_id' => $request->user()->user_id,
            'order_number' => 'ORD-' . time() . rand(1000, 9999),
            'total_amount' => $request->total_amount,
            'shipping_address' => $request->shipping_address,
            'payment_method' => $request->payment_method
        ]);
        
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->order_id,
                'product_id' => $item['product_id'],
                'product_name' => $item['product_name'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }
        
        // Clear cart after order
        Cart::where('user_id', $request->user()->user_id)->delete();
        
        return response()->json($order);
    }
    
    public function myOrders(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->user_id)->with('items')->latest()->get();
        return response()->json($orders);
    }
    
    // ========== PROFILE FUNCTIONS ==========
    
    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json($user);
    }
    
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $user->update($request->only(['name', 'phone', 'address']));
        return response()->json($user);
    }
    
    // ========== CONTACT & NEWSLETTER ==========
    
    public function contact(Request $request)
    {
        $contact = ContactQuery::create($request->all());
        return response()->json($contact);
    }
    
    public function newsletter(Request $request)
    {
        $newsletter = Newsletter::firstOrCreate(['email' => $request->email]);
        return response()->json($newsletter);
    }
    
    public function testimonials()
    {
        $testimonials = Testimonial::where('is_approved', 1)->latest()->get();
        return response()->json($testimonials);
    }
}