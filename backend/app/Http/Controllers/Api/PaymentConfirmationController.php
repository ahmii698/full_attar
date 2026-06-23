<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentConfirmation;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PaymentConfirmationController extends Controller
{
    // Get user's payment confirmations
    public function index()
    {
        $confirmations = PaymentConfirmation::with('order')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($confirmations);
    }

    // Get single payment confirmation
    public function show($id)
    {
        $confirmation = PaymentConfirmation::with('order')
            ->where('user_id', Auth::id())
            ->findOrFail($id);
            
        return response()->json($confirmation);
    }

    // Upload payment confirmation (alternative to OrderController method)
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'order_id' => 'required|exists:orders,order_id',
    //         'screenshot' => 'required|image|mimes:jpeg,png,jpg|max:5120',
    //         'transaction_id' => 'nullable|string|max:255'
    //     ]);

    //     $order = Order::where('user_id', Auth::id())
    //         ->where('order_id', $request->order_id)
    //         ->firstOrFail();
        
    //     // Check if already exists
    //     $existing = PaymentConfirmation::where('order_id', $order->order_id)->first();
    //     if ($existing) {
    //         return response()->json(['error' => 'Payment confirmation already submitted'], 400);
    //     }

    //     // Upload screenshot
    //     $file = $request->file('screenshot');
    //     $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
    //     $destinationPath = public_path('uploads/payments');
        
    //     if (!file_exists($destinationPath)) {
    //         mkdir($destinationPath, 0777, true);
    //     }
        
    //     $file->move($destinationPath, $filename);
    //     $screenshotPath = '/uploads/payments/' . $filename;

    //     $confirmation = PaymentConfirmation::create([
    //         'order_id' => $order->order_id,
    //         'user_id' => Auth::id(),
    //         'transaction_id' => $request->transaction_id,
    //         'screenshot_path' => $screenshotPath,
    //         'amount' => $order->total_amount,
    //         'status' => 'pending'
    //     ]);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Payment confirmation uploaded successfully',
    //         'data' => $confirmation
    //     ], 201);
    // }



    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,order_id',
            'screenshot' => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'transaction_id' => 'nullable|string|max:255'
        ]);

        $order = Order::where('user_id', Auth::id())
            ->where('order_id', $request->order_id)
            ->firstOrFail();

        // Check if already exists
        $existing = PaymentConfirmation::where('order_id', $order->order_id)->first();
        if ($existing) {
            return response()->json(['error' => 'Payment confirmation already submitted'], 400);
        }

        // ✅ Upload screenshot using storage
        $path = $request->file('screenshot')->store('payments', 'public');

        $screenshotPath = Storage::url($path);

        $confirmation = PaymentConfirmation::create([
            'order_id' => $order->order_id,
            'user_id' => Auth::id(),
            'transaction_id' => $request->transaction_id,
            'screenshot_path' => $screenshotPath,
            'amount' => $order->total_amount,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmation uploaded successfully',
            'data' => $confirmation
        ], 201);
    }


}