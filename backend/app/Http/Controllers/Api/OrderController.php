<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // Create new order
    public function store(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:50',
                'street_address' => 'required|string',
                'city' => 'required|string|max:100',
                'zipcode' => 'nullable|string|max:50',
                'notes' => 'nullable|string',
                'payment_method' => 'required|in:bank_transfer,scan_qr,mobile_banking',
                'items' => 'required|array',
                'items.*.product_id' => 'required|exists:products,product_id',
                'items.*.product_name' => 'required|string',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.ml' => 'nullable|integer|in:50,60,70,80,90,100',
                'items.*.price' => 'required|numeric|min:0',
                'shipping_amount' => 'nullable|numeric|min:0'
            ]);

            $userId = Auth::id();
            $shippingAmount = $request->shipping_amount ?? 200;
            
            $subtotal = 0;
            foreach ($request->items as $item) {
                $subtotal += $item['price'] * $item['quantity'];
            }
            $grandTotal = $subtotal + $shippingAmount;

            $orderNumber = 'LXE' . time() . rand(100000, 999999);

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'total_amount' => $subtotal,
                'status' => 'pending',
                'payment_status' => 'pending',
                'shipping_address' => $request->street_address,
                'payment_method' => $request->payment_method,
                'order_date' => now(),
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'city' => $request->city,
                'zipcode' => $request->zipcode,
                'notes' => $request->notes
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'ml' => $item['ml'] ?? 50,
                    'price' => $item['price']
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'order' => $order,
                    'order_number' => $orderNumber,
                    'grand_total' => $grandTotal,
                    'subtotal' => $subtotal,
                    'shipping' => $shippingAmount
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    // Get user orders
    public function index()
    {
        try {
            $userId = Auth::id();
            $orders = Order::with(['items', 'paymentConfirmation'])
                ->where('user_id', $userId)
                ->orderBy('order_id', 'desc')
                ->get();
                
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Get single order
    public function show($id)
    {
        try {
            $userId = Auth::id();
            $order = Order::with(['items', 'paymentConfirmation'])
                ->where('user_id', $userId)
                ->findOrFail($id);
                
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ✅ Track order by order number (Public - No Auth Required)
    public function trackByOrderNumber($orderNumber)
    {
        try {
            $order = Order::with(['items'])
                ->where('order_number', $orderNumber)
                ->first();
            
            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }
            
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Upload payment proof
    public function uploadPaymentProof(Request $request, $id)
    {
        try {
            $request->validate([
                'screenshot' => 'required|image|mimes:jpeg,png,jpg|max:5120',
                'transaction_id' => 'nullable|string|max:255'
            ]);

            $userId = Auth::id();
            $order = Order::where('user_id', $userId)->findOrFail($id);
            
            // Check if payment confirmation already exists
            $existing = PaymentConfirmation::where('order_id', $order->order_id)->first();
            if ($existing) {
                return response()->json(['error' => 'Payment confirmation already submitted'], 400);
            }

            // Upload screenshot
            $file = $request->file('screenshot');
            $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
            $destinationPath = public_path('uploads/payments');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            
            $file->move($destinationPath, $filename);
            $screenshotPath = '/uploads/payments/' . $filename;

            // Create payment confirmation
            $confirmation = PaymentConfirmation::create([
                'order_id' => $order->order_id,
                'user_id' => $userId,
                'transaction_id' => $request->transaction_id ?? 'TXN' . time(),
                'screenshot_path' => $screenshotPath,
                'amount' => $order->total_amount,
                'status' => 'pending'
            ]);

            // Update order payment status
            $order->payment_status = 'pending';
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment confirmation uploaded successfully',
                'data' => $confirmation
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Get payment confirmation
    public function getPaymentConfirmation($id)
    {
        try {
            $userId = Auth::id();
            $confirmation = PaymentConfirmation::with('order')
                ->where('user_id', $userId)
                ->where('order_id', $id)
                ->first();
                
            if (!$confirmation) {
                return response()->json(['error' => 'Payment confirmation not found'], 404);
            }
            
            return response()->json($confirmation);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    // Place Order (Legacy - keep for compatibility)
    public function placeOrder(Request $request)
    {
        return $this->store($request);
    }
    
    // My Orders (Legacy)
    public function myOrders()
    {
        return $this->index();
    }
    
    // Wishlist
    public function getWishlist()
    {
        return response()->json([]);
    }
    
    public function addToWishlist(Request $request)
    {
        return response()->json(['message' => 'Use WishlistController']);
    }
    
    public function removeFromWishlist($id)
    {
        return response()->json(['message' => 'Use WishlistController']);
    }
    
    public function profile()
    {
        return response()->json(Auth::user());
    }
    
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        $user->update($request->all());
        return response()->json($user);
    }
}