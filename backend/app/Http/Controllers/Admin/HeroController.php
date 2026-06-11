<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use App\Models\HeroStat;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    // ========== HERO SLIDERS ==========
    public function index()
    {
        $sliders = HeroSlider::orderBy('display_order')->get();
        return response()->json($sliders);
    }

    public function show($id)
    {
        $slider = HeroSlider::findOrFail($id);
        return response()->json($slider);
    }

    public function store(Request $request)
    {
        try {
            $slider = new HeroSlider();
            $slider->title = $request->title;
            $slider->subtitle = $request->subtitle;
            $slider->description = $request->description;
            $slider->badge_text = $request->badge_text;
            $slider->button_text = $request->button_text;
            $slider->button_link = $request->button_link;
            $slider->stats = $request->stats;
            $slider->is_active = $request->is_active ?? 1;
            $slider->display_order = $request->display_order ?? 0;

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $image->getClientOriginalName());
                
                $destinationPath = public_path('images/hero');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
                
                $image->move($destinationPath, $filename);
                $slider->image_url = '/images/hero/' . $filename;
            } else if ($request->image_url) {
                $slider->image_url = $request->image_url;
            }

            $slider->save();

            return response()->json([
                'success' => true,
                'data' => $slider
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $slider = HeroSlider::find($id);
            
            if (!$slider) {
                return response()->json(['error' => 'Hero slider not found'], 404);
            }
            
            $slider->title = $request->title;
            $slider->subtitle = $request->subtitle;
            $slider->description = $request->description;
            $slider->badge_text = $request->badge_text;
            $slider->button_text = $request->button_text;
            $slider->button_link = $request->button_link;
            $slider->stats = $request->stats;
            $slider->is_active = $request->is_active ?? 1;
            $slider->display_order = $request->display_order ?? 0;

            if ($request->hasFile('image')) {
                if ($slider->image_url && file_exists(public_path($slider->image_url))) {
                    unlink(public_path($slider->image_url));
                }
                
                $image = $request->file('image');
                $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $image->getClientOriginalName());
                
                $destinationPath = public_path('images/hero');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0777, true);
                }
                
                $image->move($destinationPath, $filename);
                $slider->image_url = '/images/hero/' . $filename;
            } else if ($request->image_url) {
                $slider->image_url = $request->image_url;
            }
            
            $slider->save();
            
            return response()->json([
                'success' => true,
                'data' => $slider
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $slider = HeroSlider::find($id);
            if ($slider) {
                if ($slider->image_url && file_exists(public_path($slider->image_url))) {
                    unlink(public_path($slider->image_url));
                }
                $slider->delete();
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ========== HERO STATS ==========
    public function statsIndex()
    {
        try {
            $stats = HeroStat::orderBy('display_order')->get();
            
            if ($stats->isEmpty()) {
                $stats = collect([
                    (object)['stat_id' => 1, 'stat_value' => '100%', 'stat_label' => 'Natural Ingredients', 'display_order' => 1, 'is_active' => 1],
                    (object)['stat_id' => 2, 'stat_value' => '24+', 'stat_label' => 'Hours Longevity', 'display_order' => 2, 'is_active' => 1],
                    (object)['stat_id' => 3, 'stat_value' => '50+', 'stat_label' => 'Premium Blends', 'display_order' => 3, 'is_active' => 1],
                ]);
            }
            
            return response()->json($stats);
        } catch (\Exception $e) {
            $stats = [
                ['stat_id' => 1, 'stat_value' => '100%', 'stat_label' => 'Natural Ingredients', 'display_order' => 1, 'is_active' => 1],
                ['stat_id' => 2, 'stat_value' => '24+', 'stat_label' => 'Hours Longevity', 'display_order' => 2, 'is_active' => 1],
                ['stat_id' => 3, 'stat_value' => '50+', 'stat_label' => 'Premium Blends', 'display_order' => 3, 'is_active' => 1],
            ];
            return response()->json($stats);
        }
    }

    public function statsStore(Request $request)
    {
        try {
            $stat = HeroStat::create([
                'stat_value' => $request->stat_value,
                'stat_label' => $request->stat_label,
                'display_order' => $request->display_order ?? 0,
                'is_active' => $request->is_active ?? 1
            ]);
            
            return response()->json($stat, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // ✅ FINAL FIXED: statsUpdate method
    public function statsUpdate(Request $request, $id)
    {
        try {
            // Find or create stat
            $stat = HeroStat::find($id);
            if (!$stat) {
                $stat = new HeroStat();
                $stat->stat_id = $id;
            }
            
            // Get request data
            $data = $request->all();
            
            // Update fields if present
            if (isset($data['stat_value'])) {
                $stat->stat_value = $data['stat_value'];
            }
            if (isset($data['stat_label'])) {
                $stat->stat_label = $data['stat_label'];
            }
            if (isset($data['display_order'])) {
                $stat->display_order = $data['display_order'];
            }
            if (isset($data['is_active'])) {
                $stat->is_active = $data['is_active'];
            }
            
            $stat->save();
            
            return response()->json([
                'success' => true,
                'data' => $stat
            ]);
        } catch (\Exception $e) {
            \Log::error('Stats Update Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function statsDestroy($id)
    {
        try {
            $stat = HeroStat::find($id);
            if ($stat) {
                $stat->delete();
            }
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}