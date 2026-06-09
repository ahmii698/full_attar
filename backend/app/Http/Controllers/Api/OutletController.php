<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use Illuminate\Http\Request;

class OutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::where('is_active', 1)->orderBy('display_order')->get();
        return response()->json($outlets);
    }
    
    public function show($id)
    {
        $outlet = Outlet::findOrFail($id);
        return response()->json($outlet);
    }
}