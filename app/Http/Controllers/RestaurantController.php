<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

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
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'restaurant_name' => 'required|string|max:100',
            'open_time' => 'required|date_format:H:i',
            'close_time' => 'required|date_format:H:i|after:open_time',
            'desc' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $restaurant = Restaurant::create([
            'restaurant_name' => $request->restaurant_name,
            'open_time' => $request->open_time,
            'close_time' => $request->close_time,
            'desc' => $request->desc,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Restaurant berhasil ditambahkan.',
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
