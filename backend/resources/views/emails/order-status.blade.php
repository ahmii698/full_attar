<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #d4af37;
        }
        .header h1 {
            color: #d4af37;
            font-size: 28px;
            margin: 0;
        }
        .content {
            padding: 30px 20px;
        }
        .content h2 {
            color: #333;
            font-size: 22px;
            margin-top: 0;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 16px;
            margin: 10px 0;
        }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cce5ff; color: #004085; }
        .status-shipped { background: #d4edda; color: #155724; }
        .status-delivered { background: #d1ecf1; color: #0c5460; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        
        .order-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        .order-details p {
            margin: 8px 0;
            color: #555;
        }
        .order-details strong {
            color: #333;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #d4af37, #b8960c);
            color: #000000;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 15px;
        }
        .btn:hover {
            background: linear-gradient(135deg, #c4a030, #a08010);
            transform: translateY(-2px);
        }
        .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #eee;
            color: #888;
            font-size: 12px;
        }
        .footer a {
            color: #d4af37;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕌 Royal Attar</h1>
            <p style="color: #666; margin: 5px 0;">Premium Fragrances</p>
        </div>

        <div class="content">
            <h2>Hello, {{ $customerName }}!</h2>
            
            <p style="font-size: 16px; color: #555;">Your order status has been updated:</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <span class="status-badge status-{{ $status }}">
                    {{ ucfirst($status) }}
                </span>
            </div>

            <div class="order-details">
                <p><strong>Order Number:</strong> {{ $orderNumber }}</p>
                <p><strong>Order Date:</strong> {{ $orderDate }}</p>
                <p><strong>Total Amount:</strong> Rs. {{ number_format($totalAmount, 0) }}</p>
                <p><strong>Status:</strong> {{ ucfirst($status) }}</p>
            </div>

            <div style="text-align: center;">
                <a href="{{ url('/track-order') }}" class="btn">Track Your Order →</a>
            </div>

            <p style="color: #666; margin-top: 20px; font-size: 14px;">
                Thank you for shopping with Royal Attar! If you have any questions, please contact our support team.
            </p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Royal Attar. All rights reserved.</p>
            <p>
                <a href="{{ url('/') }}">Home</a> | 
                <a href="{{ url('/shop') }}">Shop</a> | 
                <a href="{{ url('/contact') }}">Contact</a>
            </p>
        </div>
    </div>
</body>
</html>