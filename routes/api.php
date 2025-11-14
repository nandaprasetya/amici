<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\TableReservationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::post('/restaurants', [RestaurantController::class, 'store']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);
Route::put('/restaurants/{id}', [RestaurantController::class, 'update']);
Route::delete('/restaurants/{id}', [RestaurantController::class, 'destroy']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

Route::get('/menus', [MenuController::class, 'index']);
Route::get('/recomendation', [MenuController::class, 'recommend']);
Route::post('/menus', [MenuController::class, 'store']);
Route::get('/menus/{id}', [MenuController::class, 'show']);
Route::put('/menus/{id}', [MenuController::class, 'update']);
Route::delete('/menus/{id}', [MenuController::class, 'destroy']);

Route::get('/tables', [TableController::class, 'index']);
Route::post('/tables', [TableController::class, 'store']);
Route::get('/tables/{id}', [TableController::class, 'show']);
Route::put('/tables/{id}', [TableController::class, 'update']);
Route::delete('/tables/{id}', [TableController::class, 'destroy']);

Route::get('/reservation', [TableReservationController::class, 'index']);
Route::post('/reservation', [TableReservationController::class, 'store']);
Route::get('/reservation/{id}', [TableReservationController::class, 'show']);
Route::put('/reservation/{id}', [TableReservationController::class, 'update']);
Route::delete('/reservation/{id}', [TableReservationController::class, 'destroy']);

Route::get('/roles', [RoleController::class, 'index']);
Route::post('/roles', [RoleController::class, 'store']);
Route::get('/roles/{id}', [RoleController::class, 'show']);
Route::put('/roles/{id}', [RoleController::class, 'update']);
Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);