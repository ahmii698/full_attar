<?php
// app/Mail/OrderStatusMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $status;
    public $customerName;

    public function __construct($order, $status, $customerName)
    {
        $this->order = $order;
        $this->status = $status;
        $this->customerName = $customerName;
    }

    public function envelope(): Envelope
    {
        $statusDisplay = ucfirst(str_replace('payment_', '', $this->status));
        return new Envelope(
            subject: 'Order Status Update - ' . $statusDisplay . ' (# ' . $this->order->order_number . ')',
        );
    }

    public function content(): Content
    {
        // ✅ Load order items
        $items = $this->order->items()->get();
        
        return new Content(
            view: 'emails.order-status',
            with: [
                'orderNumber' => $this->order->order_number,
                'status' => $this->status,
                'customerName' => $this->customerName,
                'totalAmount' => $this->order->total_amount,
                'orderDate' => $this->order->order_date,
                'orderItems' => $items,
                'shippingAddress' => $this->order->shipping_address,
                'paymentMethod' => $this->order->payment_method,
                'paymentStatus' => $this->order->payment_status,
            ]
        );
    }
}