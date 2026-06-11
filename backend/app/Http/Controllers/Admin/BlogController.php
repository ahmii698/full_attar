<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::orderBy('created_at', 'desc')->get();
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
            $request->validate([
                'title' => 'required',
                'content' => 'required',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            $blog = new Blog();
            $blog->title = $request->title;
            $blog->category = $request->category;
            $blog->excerpt = $request->excerpt;
            $blog->content = $request->content;
            $blog->author = $request->author;
            $blog->tags = $request->tags;
            $blog->date = $request->date;
            $blog->read_time = $request->read_time;

            // ✅ DIRECT PUBLIC FOLDER - No storage symlink needed
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $image->getClientOriginalName());
                
                $destinationPath = public_path('images/blogs');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
                
                $image->move($destinationPath, $filename);
                $blog->image_url = '/images/blogs/' . $filename;
            } else if ($request->image_url) {
                $blog->image_url = $request->image_url;
            }

            $blog->save();

            return response()->json([
                'success' => true,
                'data' => $blog
            ], 201);

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
            if ($request->has('title')) $blog->title = $request->title;
            if ($request->has('category')) $blog->category = $request->category;
            if ($request->has('excerpt')) $blog->excerpt = $request->excerpt;
            if ($request->has('content')) $blog->content = $request->content;
            if ($request->has('author')) $blog->author = $request->author;
            if ($request->has('tags')) $blog->tags = $request->tags;
            if ($request->has('date')) $blog->date = $request->date;
            if ($request->has('read_time')) $blog->read_time = $request->read_time;
            if ($request->has('image_url')) $blog->image_url = $request->image_url;

            // ✅ DIRECT PUBLIC FOLDER
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($blog->image_url && file_exists(public_path($blog->image_url))) {
                    unlink(public_path($blog->image_url));
                }
                
                $image = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $image->getClientOriginalName());
                
                $destinationPath = public_path('images/blogs');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
                
                $image->move($destinationPath, $filename);
                $blog->image_url = '/images/blogs/' . $filename;
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
                // Delete associated image
                if ($blog->image_url && file_exists(public_path($blog->image_url))) {
                    unlink(public_path($blog->image_url));
                }
                $blog->delete();
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}