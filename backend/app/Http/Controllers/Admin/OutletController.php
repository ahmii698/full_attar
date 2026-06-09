<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use Illuminate\Http\Request;

class OutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::all();
        return response()->json($outlets);
    }

    public function show($id)
    {
        $outlet = Outlet::findOrFail($id);
        return response()->json($outlet);
    }

    public function store(Request $request)
    {
        $outlet = Outlet::create($request->all());
        return response()->json($outlet, 201);
    }

    public function update(Request $request, $id)
    {
        $outlet = Outlet::findOrFail($id);
        $outlet->update($request->all());
        return response()->json($outlet);
    }

    public function destroy($id)
    {
        Outlet::destroy($id);
        return response()->json(['success' => true]);
    }
}