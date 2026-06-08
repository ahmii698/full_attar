<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('name', 200);
            $table->string('price', 50);
            $table->integer('price_num');
            $table->integer('rating')->default(0);
            $table->string('category', 50);
            $table->string('gender', 20)->default('Unisex');
            $table->string('notes', 200)->nullable();
            $table->string('image_url', 500)->nullable();
            $table->text('description')->nullable();
            $table->integer('stock_quantity')->default(10);
            $table->boolean('is_top_seller')->default(false);
            $table->boolean('is_new_arrival')->default(false);
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('products');
    }
};