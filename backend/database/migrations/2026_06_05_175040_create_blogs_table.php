<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id('blog_id');
            $table->string('title', 255);
            $table->longText('content');
            $table->text('excerpt')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->string('category', 50);
            $table->string('tags', 255)->nullable();
            $table->string('author', 100)->default('Royal Attar');
            $table->string('date', 50)->nullable();
            $table->string('read_time', 20)->nullable();
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('blogs');
    }
};