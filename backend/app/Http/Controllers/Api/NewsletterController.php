<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:newsletter_subscribers,email'
            ]);

            $subscriber = NewsletterSubscriber::create([
                'email' => $request->email,
                'subscribed_at' => now(),
                'is_active' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Successfully subscribed to newsletter!'
            ], 200);

        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->errorInfo[1] == 1062) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email is already subscribed!'
                ], 422);
            }
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}