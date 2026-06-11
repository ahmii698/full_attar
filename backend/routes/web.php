<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\TestMailController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// Test products route
Route::get('/test-products', [ProductController::class, 'index']);

// ✅ Test Mail Route - Check if email is working
Route::get('/test-mail', [TestMailController::class, 'sendTestMail']);