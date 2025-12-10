<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::all();

        return response()->json([
            'success' => true,
            'message' => 'Daftar semua meja.',
            'data' => $tables
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'required|exists:restaurants,restaurant_id',
            'table_number' => 'required|integer|max:50',
            'table_name' => 'required|string',
            'total_chair' => 'required|integer|min:1',
            'minimun_spend' => 'required|numeric|min:0',
            'desc' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        // UUID sudah otomatis di model, jadi tidak perlu di-set
        $table = Table::create([
            'restaurant_id' => $request->restaurant_id,
            'table_name' => $request->table_name,
            'table_number' => $request->table_number,
            'total_chair' => $request->total_chair,
            'minimun_spend' => $request->minimun_spend,
            'desc' => $request->desc
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil ditambahkan.',
            'data' => $table
        ], 201);
    }

    public function show($id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Meja tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $table
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Meja tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'restaurant_id' => 'sometimes|exists:restaurants,restaurant_id',
            'table_number' => 'sometimes|string|max:50',
            'total_chair' => 'sometimes|integer|min:1',
            'minimun_spend' => 'sometimes|numeric|min:0',
            'desc' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Gunakan hanya kolom yang boleh di-update
        $table->update($request->only([
            'restaurant_id',
            'table_number',
            'total_chair',
            'minimun_spend',
            'desc'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Data meja berhasil diperbarui.',
            'data' => $table
        ], 200);
    }

    public function destroy($id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'success' => false,
                'message' => 'Meja tidak ditemukan.'
            ], 404);
        }

        $table->delete();

        return response()->json([
            'success' => true,
            'message' => 'Meja berhasil dihapus.'
        ], 200);
    }
}
