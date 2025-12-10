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
        Schema::create('tables', function (Blueprint $table) {
            $table->uuid('table_id')->primary();
                $table->uuid('restaurant_id');
                $table->foreign('restaurant_id')
                    ->references('restaurant_id')
                    ->on('restaurants')
                    ->onDelete('cascade');
                $table->string('table_name');
                $table->integer('table_number');
                $table->integer('total_chair');
                $table->double('minimun_spend');
                $table->text('desc');
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
