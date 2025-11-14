<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class MenuController extends Controller
{
    public function index()
    {
        $menus = Menu::with(['category', 'restaurant'])->get();

        return response()->json([
            'status' => true,
            'message' => 'Daftar semua menu.',
            'data' => $menus
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'menu_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'desc' => 'nullable|string',
            'calories' => 'required|numeric|min:0',
            'protein' => 'required|numeric|min:0',
            'carbo' => 'required|numeric|min:0',
            'fat' => 'required|numeric|min:0',
            'is_vegan' => 'required|boolean',
            'is_halal' => 'required|boolean',
            'is_gluten_free' => 'required|boolean',
            'category_id' => 'required|exists:categories,category_id',
            'restaurant_id' => 'required|exists:restaurants,restaurant_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $menu = Menu::create([
            'menu_id' => Str::uuid(),
            'menu_name' => $request->menu_name,
            'price' => $request->price,
            'desc' => $request->desc,
            'calories' => $request->calories,
            'protein' => $request->protein,
            'carbo' => $request->carbo,
            'fat' => $request->fat,
            'is_vegan' => $request->is_vegan,
            'is_halal' => $request->is_halal,
            'is_gluten_free' => $request->is_gluten_free,
            'category_id' => $request->category_id,
            'restaurant_id' => $request->restaurant_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Menu berhasil ditambahkan.',
            'data' => $menu
        ], 201);
    }

    public function show($id)
    {
        $menu = Menu::with(['category', 'restaurant'])->find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Menu tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $menu
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Menu tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'menu_name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'desc' => 'nullable|string',
            'calories' => 'sometimes|numeric|min:0',
            'protein' => 'sometimes|numeric|min:0',
            'carbo' => 'sometimes|numeric|min:0',
            'fat' => 'sometimes|numeric|min:0',
            'is_vegan' => 'sometimes|boolean',
            'is_halal' => 'sometimes|boolean',
            'is_gluten_free' => 'sometimes|boolean',
            'category_id' => 'sometimes|exists:categories,category_id',
            'restaurant_id' => 'sometimes|exists:restaurants,restaurant_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $menu->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data menu berhasil diperbarui.',
            'data' => $menu
        ], 200);
    }

    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Menu tidak ditemukan.'
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'status' => true,
            'message' => 'Menu berhasil dihapus.'
        ], 200);
    }

    public function recommend(Request $request)
    {
        $city = $request->input('city', 'Denpasar');
        $apiKey = env('5367c9d2ebd24f151473a72dee5bd774');

        $weatherResponse = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $city,
            'appid' => $apiKey,
            'units' => 'metric',
        ]);

        if ($weatherResponse->failed()) {
            return response()->json(['error' => 'Gagal mengambil data cuaca'], 500);
        }

        return response()->json([
            'success' => true,
            'prompt' => $weatherResponse,
        ]);

        $weatherData = $weatherResponse->json();
        $weather = $weatherData['weather'][0]['main'] ?? 'Unknown';
        $temp = $weatherData['main']['temp'] ?? 0;

        $hour = now()->format('H');
        if ($hour >= 5 && $hour < 11) {
            $dayTime = 'pagi';
        } elseif ($hour >= 11 && $hour < 15) {
            $dayTime = 'siang';
        } elseif ($hour >= 15 && $hour < 18) {
            $dayTime = 'sore';
        } else {
            $dayTime = 'malam';
        }

        $menus = Menu::select('menu_name', 'desc', 'price')->get();

        $menuList = $menus->map(fn($m) => "- {$m->menu_name} ({$m->price}): {$m->desc}")
                        ->implode("\n");

        $prompt = "
        Cuaca saat ini: $weather ($temp°C)
        Waktu: $dayTime
        Daftar menu tersedia:
        $menuList

        Dari daftar menu di atas, rekomendasikan 3 makanan yang paling cocok dengan kondisi cuaca dan waktu ini.
        Jelaskan alasan singkat untuk masing-masing pilihan.
        ";

        return response()->json([
            'success' => true,
            'prompt' => $prompt,
        ]);
    }
}
