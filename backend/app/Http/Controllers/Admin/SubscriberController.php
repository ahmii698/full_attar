<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function index()
    {
        try {
            $subscribers = Newsletter::orderBy('subscribed_at', 'desc')->get();
            return response()->json($subscribers);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch subscribers'], 500);
        }
    }

    public function show($id)
    {
        try {
            $subscriber = Newsletter::findOrFail($id);
            return response()->json($subscriber);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Subscriber not found'], 404);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $subscriber = Newsletter::findOrFail($id);
            $subscriber->is_active = $request->is_active;
            $subscriber->save();
            return response()->json($subscriber);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update status'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $subscriber = Newsletter::findOrFail($id);
            $subscriber->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete subscriber'], 500);
        }
    }
}