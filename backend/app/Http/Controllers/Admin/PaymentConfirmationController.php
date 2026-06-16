<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentConfirmation;
use App\Models\Order;
use Illuminate\Http\Request;

class PaymentConfirmationController extends Controller
{
    public function index()
    {
        $confirmations = PaymentConfirmation::with(['order', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($confirmations);
    }

    public function show($id)
    {
        $confirmation = PaymentConfirmation::with(['order', 'user'])
            ->findOrFail($id);
            
        return response()->json($confirmation);
    }

    public function approve($id)
    {
        $confirmation = PaymentConfirmation::findOrFail($id);
        $confirmation->status = 'approved';
        $confirmation->save();

        // Update order payment status
        $order = Order::find($confirmation->order_id);
        if ($order) {
            $order->payment_status = 'paid';
            $order->status = 'processing';
            $order->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmed and order approved'
        ]);
    }

    public function reject(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => 'nullable|string'
        ]);

        $confirmation = PaymentConfirmation::findOrFail($id);
        $confirmation->status = 'rejected';
        $confirmation->admin_notes = $request->admin_notes;
        $confirmation->save();

        // Update order payment status
        $order = Order::find($confirmation->order_id);
        if ($order) {
            $order->payment_status = 'failed';
            $order->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment rejected'
        ]);
    }

    public function destroy($id)
    {
        $confirmation = PaymentConfirmation::findOrFail($id);
        
        // Delete screenshot file
        if ($confirmation->screenshot_path && file_exists(public_path($confirmation->screenshot_path))) {
            unlink(public_path($confirmation->screenshot_path));
        }
        
        $confirmation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmation deleted'
        ]);
    }
}