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
        Schema::create('detail_table_reservation', function (Blueprint $table) {
            $table->uuid('detail_table_reservation_id')->primary();
            $table->uuid('table_id');
            $table->foreign('table_id')->references('table_id')->on('tables')->onDelete('cascade');
            $table->uuid('reservation_id');
            $table->foreign('reservation_id')->references('reservation_id')->on('table_reservation')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_table_reservation');
    }
};
