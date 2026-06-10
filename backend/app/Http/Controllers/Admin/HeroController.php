<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use App\Models\HeroStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroController extends Controller
{
    public function index()
    {
        $sliders = HeroSlider::all();
        return response()->json($sliders);
    }

    public function statsIndex()
    {
        $stats = HeroStat::all();
        return response()->json($stats);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_hero.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('hero', $filename, 'public');
                $data['image_url'] = '/storage/' . $path;
            }
            
            $slider = HeroSlider::create($data);
            return response()->json($slider, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $slider = HeroSlider::findOrFail($id);
            
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($slider->image_url && strpos($slider->image_url, '/storage/') === 0) {
                    $oldPath = str_replace('/storage/', '', $slider->image_url);
                    Storage::disk('public')->delete($oldPath);
                }
                
                $image = $request->file('image');
                $filename = time() . '_hero.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('hero', $filename, 'public');
                $slider->image_url = '/storage/' . $path;
            }
            // If image_url is provided directly (not from file upload)
            else if ($request->has('image_url')) {
                $slider->image_url = $request->image_url;
            }
            
            // Update other fields
            $slider->badge_text = $request->badge_text;
            $slider->title = $request->title;
            $slider->subtitle = $request->subtitle;
            $slider->description = $request->description;
            $slider->button_text = $request->button_text;
            $slider->button_link = $request->button_link ?? '/shop';
            $slider->is_active = $request->is_active ?? 1;
            
            $slider->save();
            
            return response()->json($slider);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $slider = HeroSlider::findOrFail($id);
            
            // Delete image if exists
            if ($slider->image_url && strpos($slider->image_url, '/storage/') === 0) {
                $oldPath = str_replace('/storage/', '', $slider->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $slider->delete();
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function statsStore(Request $request)
    {
        try {
            $stat = HeroStat::create($request->all());
            return response()->json($stat, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function statsUpdate(Request $request, $id)
    {
        try {
            $stat = HeroStat::findOrFail($id);
            $stat->update($request->all());
            return response()->json($stat);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function statsDestroy($id)
    {
        try {
            HeroStat::destroy($id);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}