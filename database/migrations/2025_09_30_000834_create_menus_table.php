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
        Schema::create('menus', function (Blueprint $table) {
            $table->uuid('menu_id')->primary();
            $table->string('menu_name');
            $table->double('price');
            $table->text('desc');
            $table->double('calories');
            $table->double('protein');
            $table->double('carbo');
            $table->double('fat');
            $table->tinyInteger('is_vegan');
            $table->tinyInteger('is_halal');
            $table->tinyInteger('is_gluten_free');
            $table->uuid('category_id');
            $table->foreign('category_id')
            ->references('category_id')
            ->on('categories')
            ->onDelete('cascade');

            $table->uuid('restaurant_id');
            $table->foreign('restaurant_id')
                ->references('restaurant_id')
                ->on('restaurants')
                ->onDelete('cascade');
                    $table->timestamps();
                });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
