<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Blog;
use App\Models\ContactQuery;
use App\Models\Newsletter;
use App\Models\Testimonial;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Woh orders jin mein kam az kam ek item is type ka ho
    private function ordersOf(string $type)
    {
        return Order::whereIn('order_id', function ($q) use ($type) {
            $q->select('order_id')
              ->from('order_items')
              ->where('item_type', $type);
        });
    }

    // Revenue sirf us type ke items se (mixed order mein bhi sahi rahega)
    private function revenueOf(string $type)
    {
        return (float) DB::table('order_items')
            ->where('item_type', $type)
            ->sum(DB::raw('price * quantity'));
    }

    public function index()
    {
        return response()->json([
            'totalAttar'   => DB::table('products')->count(),
            'totalShoes'   => DB::table('shoes')->count(),
            'totalUsers'   => User::count(),

            'attarOrders'  => $this->ordersOf('attar')->count(),
            'shoesOrders'  => $this->ordersOf('shoe')->count(),

            'attarRevenue' => $this->revenueOf('attar'),
            'shoesRevenue' => $this->revenueOf('shoe'),

            'totalBlogs'        => Blog::count(),
            'totalContacts'     => ContactQuery::count(),
            'totalSubscribers'  => Newsletter::count(),
            'totalTestimonials' => Testimonial::count(),

            'recentAttarOrders' => $this->ordersOf('attar')
                ->with('user')->latest()->take(5)->get(),
            'recentShoesOrders' => $this->ordersOf('shoe')
                ->with('user')->latest()->take(5)->get(),
        ]);
    }
}