<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =====================================================
// PUBLIC APIs (No authentication required)
// =====================================================

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/top-sellers', [ProductController::class, 'topSellers']);
Route::get('/new-arrivals', [ProductController::class, 'newArrivals']);
Route::get('/categories', [ProductController::class, 'categories']);

// Blogs
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);
Route::get('/blog-categories', [BlogController::class, 'categories']);

// Contact & Newsletter
Route::post('/contact', [OrderController::class, 'contact']);
Route::post('/newsletter', [OrderController::class, 'newsletter']);
Route::get('/testimonials', [OrderController::class, 'testimonials']);

// =====================================================
// PROTECTED APIs (Authentication required - Sanctum)
// =====================================================
Route::middleware('auth:sanctum')->group(function () {
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
    
    // Profile
    Route::get('/profile', [OrderController::class, 'profile']);
    Route::put('/profile', [OrderController::class, 'updateProfile']);
});

// =====================================================
// ADMIN APIs (Authentication required - Admin)
// =====================================================
Route::prefix('admin')->group(function () {
    // Admin Login (Public)
    Route::post('/login', [AdminController::class, 'login']);
    Route::post('/logout', [AdminController::class, 'logout']);
    
    // Protected Admin Routes
    Route::middleware('auth:admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
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
        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Testimonials Management
        Route::get('/testimonials', [AdminController::class, 'testimonials']);
        Route::put('/testimonials/{id}/approve', [AdminController::class, 'approveTestimonial']);
        Route::delete('/testimonials/{id}', [AdminController::class, 'deleteTestimonial']);
        
        // Contact Queries
        Route::get('/contacts', [AdminController::class, 'contacts']);
        Route::delete('/contacts/{id}', [AdminController::class, 'deleteContact']);
        
        // Newsletter Subscribers
        Route::get('/subscribers', [AdminController::class, 'subscribers']);
        Route::delete('/subscribers/{id}', [AdminController::class, 'deleteSubscriber']);
    });
});