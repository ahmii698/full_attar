<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Get all orders
    public function index()
    {
        $orders = Order::with('user')->latest()->get();
        return response()->json($orders);
    }
    
    // Get single order
    public function show($id)
    {
        $order = Order::with('user', 'items')->findOrFail($id);
        return response()->json($order);
    }
    
    // Update order status
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();
        return response()->json($order);
    }
}