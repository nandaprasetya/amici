<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('menu_gallery', function (Blueprint $table) {
            $table->uuid('menu_gallery_id');
            $table->string('img_menu');
            $table->uuid('menu_id');
            $table->foreign('menu_id')->references('menu_id')->on('menus')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_gallery');
    }
};
