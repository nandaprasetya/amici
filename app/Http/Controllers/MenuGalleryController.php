<?php

namespace App\Http\Controllers;

use App\Models\MenuGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MenuGalleryController extends Controller
{
    public function index()
    {
        $menuGalleries = MenuGallery::all();
        return response()->json([
            'status' => true,
            'data' => $menuGalleries
        ], 200);
    }

    /**
     * Tambahkan data gallery menu baru
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'img_menu' => 'required|string|max:255',
            'menu_id' => 'required|exists:menus,menu_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $menuGallery = MenuGallery::create([
            'menu_gallery_id' => Str::uuid(),
            'img_menu' => $request->img_menu,
            'menu_id' => $request->menu_id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Menu gallery berhasil ditambahkan.',
            'data' => $menuGallery
        ], 201);
    }

    /**
     * Tampilkan 1 data gallery berdasarkan ID
     */
    public function show($id)
    {
        $menuGallery = MenuGallery::find($id);

        if (!$menuGallery) {
            return response()->json([
                'status' => false,
                'message' => 'Menu gallery tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $menuGallery
        ], 200);
    }

    /**
     * Update data gallery menu
     */
    public function update(Request $request, $id)
    {
        $menuGallery = MenuGallery::find($id);

        if (!$menuGallery) {
            return response()->json([
                'status' => false,
                'message' => 'Menu gallery tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'img_menu' => 'sometimes|required|string|max:255',
            'menu_id' => 'sometimes|required|exists:menus,menu_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $menuGallery->update($request->only(['img_menu', 'menu_id']));

        return response()->json([
            'status' => true,
            'message' => 'Menu gallery berhasil diperbarui.',
            'data' => $menuGallery
        ], 200);
    }

    /**
     * Hapus data gallery menu
     */
    public function destroy($id)
    {
        $menuGallery = MenuGallery::find($id);

        if (!$menuGallery) {
            return response()->json([
                'status' => false,
                'message' => 'Menu gallery tidak ditemukan.'
            ], 404);
        }

        $menuGallery->delete();

        return response()->json([
            'status' => true,
            'message' => 'Menu gallery berhasil dihapus.'
        ], 200);
    }
}
