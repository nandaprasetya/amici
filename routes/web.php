<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\TableReservationController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::prefix('restaurants')->group(function () {
    Route::get('/', [RestaurantController::class, 'index']);
    Route::post('/', [RestaurantController::class, 'store']);
    Route::get('/{id}', [RestaurantController::class, 'show']);
    Route::put('/{id}', [RestaurantController::class, 'update']);
    Route::delete('/{id}', [RestaurantController::class, 'destroy']);
    Route::get('/', [AppController::class, 'index'])->middleware('auth');
});

Route::get('/send-reminders', [TableReservationController::class, 'sendReminders']);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
