<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlider;
use App\Models\HeroStat;
use Illuminate\Http\Request;

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
        $slider = HeroSlider::create($request->all());
        return response()->json($slider, 201);
    }

    public function update(Request $request, $id)
    {
        $slider = HeroSlider::findOrFail($id);
        $slider->update($request->all());
        return response()->json($slider);
    }

    public function destroy($id)
    {
        HeroSlider::destroy($id);
        return response()->json(['success' => true]);
    }

    public function statsStore(Request $request)
    {
        $stat = HeroStat::create($request->all());
        return response()->json($stat, 201);
    }

    public function statsUpdate(Request $request, $id)
    {
        $stat = HeroStat::findOrFail($id);
        $stat->update($request->all());
        return response()->json($stat);
    }

    public function statsDestroy($id)
    {
        HeroStat::destroy($id);
        return response()->json(['success' => true]);
    }
}