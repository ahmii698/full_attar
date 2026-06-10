<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::all();
        return response()->json($blogs);
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return response()->json($blog);
    }

    public function store(Request $request)
    {
        try {
            $blog = Blog::create($request->all());
            return response()->json($blog, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $blog = Blog::find($id);
            
            if (!$blog) {
                return response()->json(['error' => 'Blog not found'], 404);
            }
            
            // Update fields
            if ($request->has('title')) {
                $blog->title = $request->title;
            }
            if ($request->has('category')) {
                $blog->category = $request->category;
            }
            if ($request->has('excerpt')) {
                $blog->excerpt = $request->excerpt;
            }
            if ($request->has('content')) {
                $blog->content = $request->content;
            }
            if ($request->has('author')) {
                $blog->author = $request->author;
            }
            if ($request->has('tags')) {
                $blog->tags = $request->tags;
            }
            if ($request->has('image_url')) {
                $blog->image_url = $request->image_url;
            }
            if ($request->has('date')) {
                $blog->date = $request->date;
            }
            if ($request->has('read_time')) {
                $blog->read_time = $request->read_time;
            }
            
            $blog->save();
            
            return response()->json([
                'success' => true,
                'data' => $blog
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $blog = Blog::find($id);
            if ($blog) {
                $blog->delete();
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}