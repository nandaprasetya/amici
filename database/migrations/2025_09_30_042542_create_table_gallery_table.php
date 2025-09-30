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
        Schema::create('table_gallery', function (Blueprint $table) {
            $table->uuid('table_gallery_id');
            $table->string('img_menu');
            $table->uuid('table_id');
            $table->foreign('table_id')->references('table_id')->on('tables')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_gallery');
    }
};
