<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Blog;
use App\Models\ContactQuery;
use App\Models\Newsletter;
use App\Models\Testimonial;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'totalProducts' => Product::count(),
            'totalOrders' => Order::count(),
            'totalUsers' => User::count(),
            'totalRevenue' => Order::sum('total_amount'),
            'totalBlogs' => Blog::count(),
            'totalContacts' => ContactQuery::count(),
            'totalSubscribers' => Newsletter::count(),
            'totalTestimonials' => Testimonial::count(),
            'recentOrders' => Order::with('user')->latest()->take(5)->get()
        ]);
    }
}