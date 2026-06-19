<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentConfirmation;
use App\Models\User;
use App\Mail\OrderStatusMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

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

    // ✅ UPDATE ORDER STATUS - FIXED EMAIL
    public function updateStatus(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            $newStatus = $request->status;
            
            // ✅ Update order status
            $order->status = $newStatus;
            $order->save();

            // ✅ PRIORITY: Order email first, then user email
            $customerEmail = $order->email ?? $order->user->email ?? null;
            $customerName = $order->full_name ?? $order->user->name ?? 'Customer';

            // ✅ LOG EMAIL DETAILS
            Log::info('📧 Order Email: ' . ($order->email ?? 'NULL'));
            Log::info('📧 User Email: ' . ($order->user->email ?? 'NULL'));
            Log::info('📧 Final Email: ' . ($customerEmail ?? 'NULL'));
            Log::info('📧 Order ID: ' . $order->order_id);
            Log::info('📧 Order Number: ' . $order->order_number);

            // ✅ Send email to customer
            if ($customerEmail) {
                try {
                    Mail::to($customerEmail)->send(new OrderStatusMail($order, $newStatus, $customerName));
                    Log::info('✅ Order status email sent to: ' . $customerEmail);
                } catch (\Exception $e) {
                    Log::error('❌ Failed to send order status email: ' . $e->getMessage());
                }
            } else {
                Log::warning('⚠️ No email found for order: ' . $order->order_number);
            }

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => $order,
                'email_sent' => $customerEmail ? true : false,
                'customer_email' => $customerEmail,
                'order_email' => $order->email,
                'user_email' => $order->user->email ?? null
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating order status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }

    // ✅ UPDATE PAYMENT STATUS - FIXED EMAIL
    public function updatePaymentStatus(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            $newPaymentStatus = $request->payment_status;
            
            // ✅ Update payment status
            $order->payment_status = $newPaymentStatus;
            $order->save();

            // ✅ PRIORITY: Order email first, then user email
            $customerEmail = $order->email ?? $order->user->email ?? null;
            $customerName = $order->full_name ?? $order->user->name ?? 'Customer';

            Log::info('📧 Payment Email: ' . ($customerEmail ?? 'NULL'));

            // ✅ Send email to customer
            if ($customerEmail) {
                try {
                    Mail::to($customerEmail)->send(new OrderStatusMail($order, 'payment_' . $newPaymentStatus, $customerName));
                    Log::info('✅ Payment status email sent to: ' . $customerEmail);
                } catch (\Exception $e) {
                    Log::error('❌ Failed to send payment status email: ' . $e->getMessage());
                }
            } else {
                Log::warning('⚠️ No email found for order: ' . $order->order_number);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment status updated successfully',
                'data' => $order,
                'email_sent' => $customerEmail ? true : false,
                'customer_email' => $customerEmail
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating payment status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status: ' . $e->getMessage()
            ], 500);
        }
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
            Log::error('Error fetching payment proof: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}