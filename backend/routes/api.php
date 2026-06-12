<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\HeroController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\ContactController; 
use App\Http\Controllers\Admin\SubscriberController;
use App\Http\Controllers\Admin\HeroController as AdminHeroController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\OutletController as AdminOutletController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =====================================================
// PUBLIC APIs (No authentication required)
// =====================================================

// ========== AUTH APIs (Public) ==========
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/top-sellers', [ProductController::class, 'topSellers']);
Route::get('/new-arrivals', [ProductController::class, 'newArrivals']);
Route::get('/deals', [ProductController::class, 'deals']);
Route::get('/categories', [ProductController::class, 'categories']);

// Blogs
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);
Route::get('/blog-categories', [BlogController::class, 'categories']);

// Contact & Newsletter
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/newsletter', [NewsletterController::class, 'subscribe']);

// Testimonials - Public API
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/testimonials', [TestimonialController::class, 'store']);

// ========== HERO SECTION APIs ==========
Route::get('/hero', [HeroController::class, 'index']);
Route::get('/hero-stats', [HeroController::class, 'stats']);
Route::get('/site-settings', [SiteSettingController::class, 'index']);
Route::get('/social-links', [SiteSettingController::class, 'socialLinks']);
Route::get('/banners', [BannerController::class, 'index']);

// ========== FAQ APIs ==========
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/faq-categories', [FaqController::class, 'categories']);

// ========== OUTLETS APIs ==========
Route::get('/outlets', [OutletController::class, 'index']);
Route::get('/outlets/{id}', [OutletController::class, 'show']);

// ========== ASSETS ROUTE FOR IMAGES ==========
Route::get('/assets/{filename}', function ($filename) {
    $path = public_path('assets/' . $filename);
    if (file_exists($path)) {
        return response()->file($path);
    }
    return response()->json(['error' => 'Image not found'], 404);
});

// =====================================================
// PROTECTED APIs (Authentication required - Sanctum)
// =====================================================
Route::middleware('auth:sanctum')->group(function () {
    // Auth Logout & User Info
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Profile Update Routes
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Cart
    Route::get('/cart', [OrderController::class, 'getCart']);
    Route::post('/cart/add', [OrderController::class, 'addToCart']);
    Route::delete('/cart/remove/{id}', [OrderController::class, 'removeFromCart']);
    
    // Wishlist
    Route::get('/wishlist', [OrderController::class, 'getWishlist']);
    Route::post('/wishlist/add', [OrderController::class, 'addToWishlist']);
    Route::delete('/wishlist/remove/{id}', [OrderController::class, 'removeFromWishlist']);
    
    // Orders
    Route::post('/order', [OrderController::class, 'placeOrder']);
    Route::get('/orders', [OrderController::class, 'myOrders']);
    
    // Profile (OrderController ka - optional)
    Route::get('/profile', [OrderController::class, 'profile']);
    Route::put('/profile', [OrderController::class, 'updateProfile']);
});

// =====================================================
// ADMIN APIs
// =====================================================
Route::prefix('admin')->group(function () {
    // Admin Auth
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // Products Management
    Route::get('/products', [AdminProductController::class, 'index']);
    Route::get('/products/{id}', [AdminProductController::class, 'show']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::put('/products/{id}', [AdminProductController::class, 'update']);
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);
    
    // Blogs Management
    Route::get('/blogs', [AdminBlogController::class, 'index']);
    Route::get('/blogs/{id}', [AdminBlogController::class, 'show']);
    Route::post('/blogs', [AdminBlogController::class, 'store']);
    Route::put('/blogs/{id}', [AdminBlogController::class, 'update']);
    Route::delete('/blogs/{id}', [AdminBlogController::class, 'destroy']);
    
    // Orders Management
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
    
    // Users Management
    Route::get('/users', [UserController::class, 'index']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    
    // ========== TESTIMONIALS MANAGEMENT ==========
    Route::put('/testimonials/{id}/approve', [AdminTestimonialController::class, 'approve']);
    Route::get('/testimonials', [AdminTestimonialController::class, 'index']);
    Route::get('/testimonials/{id}', [AdminTestimonialController::class, 'show']);
    Route::put('/testimonials/{id}', [AdminTestimonialController::class, 'update']);
    Route::delete('/testimonials/{id}', [AdminTestimonialController::class, 'destroy']);
    
    // ========== CONTACT QUERIES MANAGEMENT ==========
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);
    Route::put('/contacts/{id}/read', [ContactController::class, 'markAsRead']);
    Route::post('/contacts/{id}/reply', [ContactController::class, 'reply']);  // ✅ reply route
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
    
    // Newsletter Subscribers
    Route::get('/subscribers', [SubscriberController::class, 'index']);
    Route::get('/subscribers/{id}', [SubscriberController::class, 'show']);
    Route::put('/subscribers/{id}/status', [SubscriberController::class, 'updateStatus']);
    Route::delete('/subscribers/{id}', [SubscriberController::class, 'destroy']);
    
    // ========== HERO SECTION ADMIN APIs ==========
    Route::get('/hero-sliders', [AdminHeroController::class, 'index']);
    Route::get('/hero-sliders/{id}', [AdminHeroController::class, 'show']);
    Route::post('/hero-sliders', [AdminHeroController::class, 'store']);
    Route::put('/hero-sliders/{id}', [AdminHeroController::class, 'update']);
    Route::delete('/hero-sliders/{id}', [AdminHeroController::class, 'destroy']);
    
    Route::get('/hero-stats', [AdminHeroController::class, 'statsIndex']);
    Route::post('/hero-stats', [AdminHeroController::class, 'statsStore']);
    Route::put('/hero-stats/{id}', [AdminHeroController::class, 'statsUpdate']);
    Route::delete('/hero-stats/{id}', [AdminHeroController::class, 'statsDestroy']);
    
    // Banners Management
    Route::get('/banners', [AdminBannerController::class, 'index']);
    Route::get('/banners/{id}', [AdminBannerController::class, 'show']);
    Route::post('/banners', [AdminBannerController::class, 'store']);
    Route::put('/banners/{id}', [AdminBannerController::class, 'update']);
    Route::delete('/banners/{id}', [AdminBannerController::class, 'destroy']);
    
    // Site Settings Management
    Route::get('/site-settings', [AdminSiteSettingController::class, 'index']);
    Route::put('/site-settings/{key}', [AdminSiteSettingController::class, 'update']);
    
    // Social Links Management
    Route::get('/social-links', [AdminSiteSettingController::class, 'socialLinksIndex']);
    Route::put('/social-links/{id}', [AdminSiteSettingController::class, 'socialLinksUpdate']);
    
    // FAQ ADMIN APIs
    Route::get('/faqs', [AdminFaqController::class, 'index']);
    Route::get('/faqs/{id}', [AdminFaqController::class, 'show']);
    Route::post('/faqs', [AdminFaqController::class, 'store']);
    Route::put('/faqs/{id}', [AdminFaqController::class, 'update']);
    Route::delete('/faqs/{id}', [AdminFaqController::class, 'destroy']);
    Route::post('/faqs/reorder', [AdminFaqController::class, 'updateOrder']);
    
    // OUTLETS ADMIN APIs
    Route::get('/outlets', [AdminOutletController::class, 'index']);
    Route::get('/outlets/{id}', [AdminOutletController::class, 'show']);
    Route::post('/outlets', [AdminOutletController::class, 'store']);
    Route::put('/outlets/{id}', [AdminOutletController::class, 'update']);
    Route::delete('/outlets/{id}', [AdminOutletController::class, 'destroy']);
    Route::post('/outlets/reorder', [AdminOutletController::class, 'updateOrder']);
});