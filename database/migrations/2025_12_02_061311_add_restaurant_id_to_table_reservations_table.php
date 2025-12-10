<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('table_reservation', function (Blueprint $table) {
        // Menambahkan kolom restaurant_id setelah user_id
        $table->uuid('restaurant_id')->after('user_id');
        
        // Menambahkan foreign key (opsional tapi bagus)
        $table->foreign('restaurant_id')
              ->references('restaurant_id')
              ->on('restaurants')
              ->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('table_reservation', function (Blueprint $table) {
        $table->dropForeign(['restaurant_id']);
        $table->dropColumn('restaurant_id');
    });
}
};
