<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::all();
        return response()->json($faqs);
    }

    public function show($id)
    {
        $faq = Faq::findOrFail($id);
        return response()->json($faq);
    }

    public function store(Request $request)
    {
        $faq = Faq::create($request->all());
        return response()->json($faq, 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);
        $faq->update($request->all());
        return response()->json($faq);
    }

    public function destroy($id)
    {
        Faq::destroy($id);
        return response()->json(['success' => true]);
    }
}