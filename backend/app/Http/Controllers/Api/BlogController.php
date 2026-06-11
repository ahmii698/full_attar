<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Get all blogs with full image URLs
    public function index(Request $request)
    {
        $query = Blog::query();
        
        if ($request->category && $request->category != 'all') {
            $query->where('category', $request->category);
        }
        
        $blogs = $query->orderBy('created_at', 'desc')->get();
        
        // ✅ Add full image URLs for frontend
        foreach ($blogs as $blog) {
            if ($blog->image_url) {
                // Agar image storage mein hai toh full URL bana do
                if (str_starts_with($blog->image_url, '/storage/')) {
                    $blog->image_url = 'http://127.0.0.1:8000' . $blog->image_url;
                }
                // Agar assets mein hai toh waisa hi rahne do (React public folder se lega)
            }
        }
        
        return response()->json($blogs);
    }
    
    // Get single blog with full image URL
    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        
        // ✅ Add full image URL for frontend
        if ($blog->image_url && str_starts_with($blog->image_url, '/storage/')) {
            $blog->image_url = 'http://127.0.0.1:8000' . $blog->image_url;
        }
        
        return response()->json($blog);
    }
    
    // Get blog categories
    public function categories()
    {
        $categories = ['Oud', 'Attar Guide', 'Trending', 'Tips & Tricks', 'Craftsmanship', 'Seasonal Guide'];
        return response()->json($categories);
    }
}