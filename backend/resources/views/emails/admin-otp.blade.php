<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0a0a0a;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 40px auto;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #d4af37;
            margin-bottom: 10px;
        }
        .subtitle {
            color: rgba(255,255,255,0.5);
            font-size: 14px;
            margin-bottom: 30px;
        }
        h2 {
            color: #ffffff;
            font-size: 22px;
            margin-bottom: 10px;
        }
        .otp-box {
            background: rgba(212,175,55,0.1);
            border: 1px solid rgba(212,175,55,0.3);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .otp-code {
            font-size: 40px;
            font-weight: 700;
            color: #d4af37;
            letter-spacing: 8px;
            font-family: monospace;
        }
        .message {
            color: rgba(255,255,255,0.6);
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            color: rgba(255,255,255,0.3);
            font-size: 12px;
            margin-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🪔 Royal Attar</div>
        <div class="subtitle">Password Reset Verification</div>
        
        <h2>Reset Your Password</h2>
        <p class="message">You requested to reset your admin password. Use the OTP below to verify your identity.</p>
        
        <div class="otp-box">
            <div class="otp-code">{{ $otp }}</div>
        </div>
        
        <p class="message">This OTP will expire in <strong>10 minutes</strong>.<br>If you didn't request this, please ignore this email.</p>
        
        <div class="footer">
            &copy; {{ date('Y') }} Royal Attar. All rights reserved.
        </div>
    </div>
</body>
</html>