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
        Schema::create('food_reservations', function (Blueprint $table) {
            $table->uuid('food_reservation_id')->primary();
            $table->uuid('reservation_id');
            $table->foreign('reservation_id')
                ->references('reservation_id')
                ->on('table_reservation')
                ->onDelete('cascade');
            $table->double('total_food_price');
            $table->double('tax')->default(0);
            $table->double('service_charge')->default(0);
            $table->double('grand_total');
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamps();
        });

        // Tabel detail food reservation (untuk multiple items)
        Schema::create('detail_food_reservations', function (Blueprint $table) {
            $table->uuid('detail_food_reservation_id')->primary();
            $table->uuid('food_reservation_id');
            $table->foreign('food_reservation_id')
                ->references('food_reservation_id')
                ->on('food_reservations')
                ->onDelete('cascade');
            $table->uuid('menu_id');
            $table->foreign('menu_id')
                ->references('menu_id')
                ->on('menus')
                ->onDelete('cascade');
            $table->integer('quantity');
            $table->double('price'); // Harga per item saat order
            $table->double('subtotal'); // quantity * price
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_food_reservations');
        Schema::dropIfExists('food_reservations');
    }
};
