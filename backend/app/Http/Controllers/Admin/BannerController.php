<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('display_order')->get();
        return response()->json($banners);
    }

    public function show($id)
    {
        $banner = Banner::findOrFail($id);
        return response()->json($banner);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_banner.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('banners', $filename, 'public');
                $data['image_url'] = '/storage/' . $path;
            }
            
            $banner = Banner::create($data);
            return response()->json($banner, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $banner = Banner::find($id);
            
            if (!$banner) {
                return response()->json(['error' => 'Banner not found'], 404);
            }
            
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($banner->image_url && strpos($banner->image_url, '/storage/') === 0) {
                    $oldPath = str_replace('/storage/', '', $banner->image_url);
                    Storage::disk('public')->delete($oldPath);
                }
                
                $image = $request->file('image');
                $filename = time() . '_banner.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('banners', $filename, 'public');
                $banner->image_url = '/storage/' . $path;
            }
            // If image_url is provided directly (from URL or duplicate)
            else if ($request->has('image_url')) {
                $banner->image_url = $request->image_url;
            }
            
            // Update other fields
            if ($request->has('title')) {
                $banner->title = $request->title;
            }
            if ($request->has('subtitle')) {
                $banner->subtitle = $request->subtitle;
            }
            if ($request->has('description')) {
                $banner->description = $request->description;
            }
            if ($request->has('position')) {
                $banner->position = $request->position;
            }
            if ($request->has('button_text')) {
                $banner->button_text = $request->button_text;
            }
            if ($request->has('button_link')) {
                $banner->button_link = $request->button_link;
            }
            if ($request->has('is_active')) {
                $banner->is_active = $request->is_active;
            }
            
            $banner->save();
            
            return response()->json(['success' => true, 'data' => $banner]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $banner = Banner::find($id);
            
            // Delete image if exists
            if ($banner && $banner->image_url && strpos($banner->image_url, '/storage/') === 0) {
                $oldPath = str_replace('/storage/', '', $banner->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            Banner::destroy($id);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}