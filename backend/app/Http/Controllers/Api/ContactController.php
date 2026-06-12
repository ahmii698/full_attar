<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Store a new contact query
     */
    public function store(Request $request)
    {
        try {
            // Log incoming request for debugging
            Log::info('Contact form submission received:', $request->all());
            
            // Validate request
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'query_date' => 'required|date',
                'message' => 'nullable|string'
            ]);

            // Create contact query
            $contact = ContactQuery::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'query_date' => $request->query_date,
                'message' => $request->message,
                'is_read' => false
            ]);

            Log::info('Contact query saved successfully. ID: ' . $contact->query_id);

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully! We will get back to you soon.',
                'data' => $contact
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Contact form validation failed:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error in contact form: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Database error. Please check your database connection.',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all contact queries (for admin) - ORDER BY query_id instead of created_at
     */
    public function index()
    {
        try {
            // ✅ CHANGED: Use query_id instead of created_at since timestamps are disabled
            $queries = ContactQuery::orderBy('query_id', 'desc')->get();
            return response()->json($queries);
        } catch (\Exception $e) {
            Log::error('Error fetching contact queries: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch queries'
            ], 500);
        }
    }

    /**
     * Get single contact query
     */
    public function show($id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            return response()->json($query);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Query not found'
            ], 404);
        }
    }

    /**
     * Mark query as read
     */
    public function markAsRead($id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            $query->is_read = true;
            $query->save();

            return response()->json([
                'success' => true,
                'message' => 'Query marked as read'
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking query as read: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark as read'
            ], 500);
        }
    }

    /**
     * Delete contact query
     */
    public function destroy($id)
    {
        try {
            $query = ContactQuery::findOrFail($id);
            $query->delete();

            return response()->json([
                'success' => true,
                'message' => 'Query deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting query: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete query'
            ], 500);
        }
    }
}