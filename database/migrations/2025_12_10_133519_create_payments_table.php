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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('payment_id')->primary();

            // Relasi ke food_reservations
            $table->uuid('food_reservation_id');
            $table->foreign('food_reservation_id')
                ->references('food_reservation_id')
                ->on('food_reservations')
                ->onDelete('cascade');

            $table->decimal('amount', 12, 2); // Total pembayaran
            $table->string('payment_method')->nullable(); // ex: midtrans, cash, etc.
            $table->string('payment_status')->default('pending'); // pending | paid | failed
            $table->string('snap_token')->nullable(); // Token dari Midtrans
            $table->timestamp('payment_time')->nullable(); // Waktu pembayaran sukses

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
