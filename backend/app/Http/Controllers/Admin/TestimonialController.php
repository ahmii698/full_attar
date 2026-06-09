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
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->update([
                'user_name' => $request->user_name,
                'user_location' => $request->user_location,
                'rating' => $request->rating,
                'review' => $request->review,
                'date' => $request->date,
                'is_approved' => $request->is_approved ?? $testimonial->is_approved
            ]);
            return response()->json($testimonial);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update testimonial'], 500);
        }
    }

    public function destroy($id)
    {
        Testimonial::destroy($id);
        return response()->json(['success' => true]);
    }
}