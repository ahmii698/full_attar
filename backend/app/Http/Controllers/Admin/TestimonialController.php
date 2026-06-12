<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')->get();
        return response()->json($testimonials);
    }

    public function show($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        return response()->json($testimonial);
    }

    public function approve($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->is_approved = 1;
            $testimonial->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Testimonial approved successfully',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            
            $testimonial->user_name = $request->user_name;
            $testimonial->user_location = $request->user_location;
            $testimonial->rating = $request->rating;
            $testimonial->review = $request->review;
            $testimonial->is_approved = $request->is_approved ?? $testimonial->is_approved;
            
            $testimonial->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Updated successfully',
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}