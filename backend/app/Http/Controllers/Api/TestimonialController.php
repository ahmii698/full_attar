<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    // Get approved testimonials
    public function index()
    {
        $testimonials = Testimonial::where('is_approved', 1)
            ->orderBy('testimonial_id', 'desc')
            ->get();
        
        return response()->json($testimonials);
    }

    // Submit new testimonial (pending approval)
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_name' => 'required|string|max:255',
                'user_location' => 'nullable|string|max:255',
                'rating' => 'required|integer|min:1|max:5',
                'review' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 422);
            }

            $testimonial = Testimonial::create([
                'user_name' => $request->user_name,
                'user_location' => $request->user_location,
                'rating' => $request->rating,
                'review' => $request->review,
                'is_approved' => 0
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your testimonial has been submitted and will appear after approval.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}