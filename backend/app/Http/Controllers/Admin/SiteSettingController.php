<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all();
        return response()->json($settings);
    }

    public function update(Request $request, $key)
    {
        $setting = SiteSetting::where('setting_key', $key)->first();
        if ($setting) {
            $setting->update(['setting_value' => $request->value]);
        }
        return response()->json(['success' => true]);
    }

    public function socialLinksIndex()
    {
        $links = SocialLink::all();
        return response()->json($links);
    }

    public function socialLinksUpdate(Request $request, $id)
    {
        $link = SocialLink::findOrFail($id);
        $link->update($request->all());
        return response()->json($link);
    }
}