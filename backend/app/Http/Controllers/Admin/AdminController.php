<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Blog;
use App\Models\Testimonial;
use App\Models\ContactQuery;
use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    // Admin Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        
        $admin = Admin::where('admin_email', $request->email)->first();
        
        if ($admin && Hash::check($request->password, $admin->admin_password)) {
            $token = $admin->createToken('admin-token')->plainTextToken;
            return response()->json([
                'success' => true,
                'token' => $token,
                'admin' => $admin
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }
    
    // Admin Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true]);
    }
    
    // Dashboard
    public function dashboard()
    {
        return response()->json([
            'totalProducts' => Product::count(),
            'totalOrders' => Order::count(),
            'totalUsers' => User::count(),
            'totalRevenue' => Order::sum('total_amount'),
            'recentOrders' => Order::with('user')->latest()->take(5)->get(),
            'totalBlogs' => Blog::count(),
            'totalTestimonials' => Testimonial::count(),
        ]);
    }
    
    // Users Management
    public function users()
    {
        $users = User::latest()->get();
        return response()->json($users);
    }
    
    public function deleteUser($id)
    {
        User::destroy($id);
        return response()->json(['success' => true]);
    }
    
    // Testimonials Management
    public function testimonials()
    {
        $testimonials = Testimonial::latest()->get();
        return response()->json($testimonials);
    }
    
    public function approveTestimonial($id)
    {
        $testimonial = Testimonial::find($id);
        $testimonial->is_approved = !$testimonial->is_approved;
        $testimonial->save();
        return response()->json(['success' => true]);
    }
    
    public function deleteTestimonial($id)
    {
        Testimonial::destroy($id);
        return response()->json(['success' => true]);
    }
    
    // Contact Queries
    public function contacts()
    {
        $contacts = ContactQuery::latest()->get();
        return response()->json($contacts);
    }
    
    public function deleteContact($id)
    {
        ContactQuery::destroy($id);
        return response()->json(['success' => true]);
    }
    
    // Newsletter Subscribers
    public function subscribers()
    {
        $subscribers = Newsletter::latest()->get();
        return response()->json($subscribers);
    }
    
    public function deleteSubscriber($id)
    {
        Newsletter::destroy($id);
        return response()->json(['success' => true]);
    }
}