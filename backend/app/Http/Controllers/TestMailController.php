<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class TestMailController extends Controller
{
    public function sendTestMail()
    {
        try {
            $toEmail = 'xahmedmalik30600@gmail.com'; // apni email daal
            $toName = 'Ahmed Malik';
            
            Mail::send('emails.test', ['name' => 'Ahmed'], function ($message) use ($toEmail, $toName) {
                $message->to($toEmail, $toName)
                        ->subject('Test Email from Royal Attar')
                        ->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            });
            
            return "✅ Test email sent successfully to " . $toEmail;
            
        } catch (\Exception $e) {
            return "❌ Error: " . $e->getMessage();
        }
    }
}