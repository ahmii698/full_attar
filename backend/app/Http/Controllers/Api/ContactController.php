<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Contact form data:', $request->all());

            // ✅ Simple validation
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'query_date' => 'required|date',
                'message' => 'nullable|string'
            ]);

            // ✅ Create contact
            $contact = new ContactQuery();
            $contact->full_name = $request->full_name;
            $contact->email = $request->email;
            $contact->phone = $request->phone;
            $contact->query_date = $request->query_date;
            $contact->message = $request->message ?? '';
            $contact->is_read = 0;
            $contact->save();

            Log::info('Contact saved. ID: ' . $contact->query_id);

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully!',
                'data' => $contact
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('Contact error: ' . $e->getMessage());
            Log::error('Line: ' . $e->getLine());
            Log::error('File: ' . $e->getFile());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $queries = ContactQuery::orderBy('query_id', 'desc')->get();
            return response()->json($queries);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            return response()->json($query);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Query not found'], 404);
        }
    }

    public function markAsRead($id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            $query->is_read = 1;
            $query->save();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            $query->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reply(Request $request, $id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            $query->is_read = 1;
            $query->save();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}