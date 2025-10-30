<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all();
        return response()->json([
            'success' => true,
            'message' => 'Daftar semua restoran',
            'data' => $restaurants
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'restaurant_name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'desc' => 'nullable|string',
        ]);

        $restaurant = Restaurant::create([
            'restaurant_id' => Str::uuid(),
            'restaurant_name' => $request->restaurant_name,
            'address' => $request->address,
            'phone' => $request->phone,
            'email' => $request->email,
            'desc' => $request->desc,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Restoran berhasil ditambahkan',
            'data' => $restaurant
        ], 201);
    }

    public function show($id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'success' => false,
                'message' => 'Restoran tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $restaurant
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'success' => false,
                'message' => 'Restoran tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'restaurant_name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'desc' => 'nullable|string',
        ]);

        $restaurant->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data restoran berhasil diperbarui',
            'data' => $restaurant
        ], 200);
    }

    public function destroy($id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json([
                'success' => false,
                'message' => 'Restoran tidak ditemukan'
            ], 404);
        }

        $restaurant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Restoran berhasil dihapus'
        ], 200);
    }
}
