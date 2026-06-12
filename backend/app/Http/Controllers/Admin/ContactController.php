<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        try {
            $contacts = ContactQuery::orderBy('created_at', 'desc')->get();
            return response()->json($contacts);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch contacts'], 500);
        }
    }

    public function show($id)
    {
        try {
            $contact = ContactQuery::findOrFail($id);
            return response()->json($contact);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Contact not found'], 404);
        }
    }

    public function markAsRead($id)
    {
        try {
            $contact = ContactQuery::findOrFail($id);
            $contact->is_read = true;
            $contact->save();
            return response()->json($contact);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to mark as read'], 500);
        }
    }

    // ✅ ADD THIS - Reply to contact
    public function reply(Request $request, $id)
    {
        try {
            $contact = ContactQuery::findOrFail($id);
            
            $request->validate([
                'message' => 'required|string'
            ]);

            // Send email to user
            Mail::send('emails.contact-reply', [
                'name' => $contact->full_name,
                'originalMessage' => $contact->message,
                'reply' => $request->message
            ], function ($message) use ($contact) {
                $message->to($contact->email)
                        ->subject('Reply from Royal Attar - ' . $contact->full_name);
            });

            // Mark as read
            $contact->is_read = 1;
            $contact->save();

            return response()->json([
                'success' => true,
                'message' => 'Reply sent successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Reply error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $contact = ContactQuery::findOrFail($id);
            $contact->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete contact'], 500);
        }
    }
}