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

    return response()->json($blogs);
}

public function show($id)
{
    $blog = Blog::findOrFail($id);
    return response()->json($blog);
}


    
    // Get blog categories
    public function categories()
    {
        $categories = ['Oud', 'Attar Guide', 'Trending', 'Tips & Tricks', 'Craftsmanship', 'Seasonal Guide'];
        return response()->json($categories);
    }
}