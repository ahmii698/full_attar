<!DOCTYPE html>
<html>
<head>
    <title>Reply from Royal Attar</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a2a; color: #fff;">
    <div style="background: rgba(212,175,55,0.1); border-radius: 16px; padding: 30px;">
        <h1 style="color: #d4af37;">Royal Attar</h1>
        
        <p>Dear <strong>{{ $name }}</strong>,</p>
        
        <p>Thank you for contacting Royal Attar. Here is our response to your query:</p>
        
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0;">{{ $reply }}</p>
        </div>
        
        <p>Your original message:</p>
        <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; font-style: italic; color: rgba(255,255,255,0.7);">
            "{{ $originalMessage }}"
        </div>
        
        <hr style="border-color: rgba(212,175,55,0.2); margin: 20px 0;">
        
        <p style="font-size: 12px; color: rgba(255,255,255,0.4);">
            This is an automated response from Royal Attar. Please do not reply to this email.
        </p>
    </div>
</body>
</html>