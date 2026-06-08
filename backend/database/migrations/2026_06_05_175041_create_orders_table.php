<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('order_number', 50)->unique();
            $table->integer('total_amount');
            $table->string('status', 50)->default('pending');
            $table->string('payment_status', 50)->default('unpaid');
            $table->text('shipping_address')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};