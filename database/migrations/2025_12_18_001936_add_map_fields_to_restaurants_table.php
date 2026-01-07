<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->string('map_x')->nullable();
            $table->string('map_y')->nullable();
            $table->string('map_icon')->nullable();
            $table->string('thumbnail')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['map_x', 'map_y', 'map_icon', 'thumbnail']);
        });
    }
};
