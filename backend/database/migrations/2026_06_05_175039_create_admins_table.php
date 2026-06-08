<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id('admin_id');
            $table->string('admin_name', 100);
            $table->string('admin_email', 100)->unique();
            $table->string('admin_password', 255);
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('admins');
    }
};