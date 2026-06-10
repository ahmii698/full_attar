<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

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
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->is_approved = !$testimonial->is_approved;
        $testimonial->save();
        return response()->json($testimonial);
    }

    public function update(Request $request, $id)
    {
        try {
            $testimonial = Testimonial::find($id);
            
            if (!$testimonial) {
                return response()->json(['error' => 'Testimonial not found'], 404);
            }
            
            // Direct update
            $testimonial->user_name = $request->user_name;
            $testimonial->user_location = $request->user_location;
            $testimonial->rating = $request->rating;
            $testimonial->review = $request->review;
            $testimonial->date = $request->date;
            
            $testimonial->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Updated successfully',
                'data' => $testimonial
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function destroy($id)
    {
        Testimonial::destroy($id);
        return response()->json(['success' => true]);
    }
}