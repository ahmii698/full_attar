<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    // Get all blogs
    public function index()
    {
        $blogs = Blog::latest()->get();
        return response()->json($blogs);
    }
    
    // Get single blog
    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return response()->json($blog);
    }
    
    // Create new blog
    public function store(Request $request)
    {
        $blog = Blog::create($request->all());
        return response()->json($blog, 201);
    }
    
    // Update blog
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
        $blog->update($request->all());
        return response()->json($blog);
    }
    
    // Delete blog
    public function destroy($id)
    {
        Blog::destroy($id);
        return response()->json(['success' => true]);
    }
}