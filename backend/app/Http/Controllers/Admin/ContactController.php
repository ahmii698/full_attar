<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;

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