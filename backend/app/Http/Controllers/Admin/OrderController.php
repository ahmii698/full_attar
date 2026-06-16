<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentConfirmation;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('user')->get();
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with('user', 'items')->findOrFail($id);
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();
        return response()->json($order);
    }

    // ✅ Update Payment Status
    public function updatePaymentStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->payment_status = $request->payment_status;
        $order->save();
        return response()->json($order);
    }

    // ✅ Get payment proof for order
    public function getPaymentProof($id)
    {
        try {
            $order = Order::findOrFail($id);
            $confirmation = PaymentConfirmation::where('order_id', $order->order_id)->first();
            
            if (!$confirmation) {
                return response()->json(['error' => 'No payment proof found for this order'], 404);
            }
            
            return response()->json($confirmation);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}