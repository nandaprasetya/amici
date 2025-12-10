<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\TableReservationController;
use App\Http\Controllers\FoodReservationController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public routes
Route::get('/restaurants', [AppController::class, 'index'])->name('restaurants.index.user');
Route::get('/reservation', [TableReservationController::class, 'reservationPage'])->name('reservation.page');

// Authenticated user routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/my-reservations', [TableReservationController::class, 'userIndex'])
        ->name('user.reservations.index'); 

    // Table Reservation routes
    Route::post('/reservation', [TableReservationController::class, 'store'])->name('reservation.store');
    Route::get('/reservation/{id}', [TableReservationController::class, 'show'])->name('reservation.show');
    Route::put('/reservation/{id}', [TableReservationController::class, 'update'])->name('reservation.update');
    Route::delete('/reservation/{id}', [TableReservationController::class, 'destroy'])->name('reservation.destroy');
    

    Route::get('/menu-reservation', [FoodReservationController::class, 'index'])
        ->name('food.reservation.page');
    
    Route::post('/food-reservation', [FoodReservationController::class, 'store'])
        ->name('food.reservation.store');
});

// Admin routes
Route::middleware(['auth', 'verified', 'role:Admin,SuperAdmin'])
    ->prefix('admin')
    ->name('admin.') 
    ->group(function () {

    Route::prefix('restaurants')->group(function () {
        Route::get('/', [RestaurantController::class, 'index'])->name('restaurants.index');
        Route::get('/create', [RestaurantController::class, 'create'])->name('restaurants.create');
        Route::post('/', [RestaurantController::class, 'store'])->name('restaurants.store');
        Route::get('/{id}', [RestaurantController::class, 'show'])->name('restaurants.show');
        Route::put('/{id}', [RestaurantController::class, 'update'])->name('restaurants.update');
        Route::delete('/{id}', [RestaurantController::class, 'destroy'])->name('restaurants.destroy');
    });

    Route::prefix('reservation')->group(function () {
        Route::get('/', [TableReservationController::class, 'index'])->name('reservation.index');
        Route::post('/', [TableReservationController::class, 'store'])->name('reservation.store');
        Route::get('/{id}', [TableReservationController::class, 'show'])->name('reservation.show');
        Route::put('/{id}', [TableReservationController::class, 'update'])->name('reservation.update');
        Route::delete('/{id}', [TableReservationController::class, 'destroy'])->name('reservation.destroy');
    });

    Route::get('/send-reminders', [TableReservationController::class, 'sendReminders'])->name('send-reminders');
});

Route::post('/midtrans/callback', [FoodReservationController::class, 'midtransCallback'])
    ->name('midtrans.callback');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';