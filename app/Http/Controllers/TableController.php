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
            'table_number' => 'required|string|max:50',
            'total_chair' => 'required|integer|min:1',
            'minimun_spend' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'desc' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $table = Table::create([
            'table_id' => Str::uuid(),
            'table_number' => $request->table_number,
            'total_chair' => $request->total_chair,
            'minimun_spend' => $request->minimun_spend,
            'price' => $request->price,
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
            'table_number' => 'sometimes|string|max:50',
            'total_chair' => 'sometimes|integer|min:1',
            'minimun_spend' => 'sometimes|numeric|min:0',
            'price' => 'sometimes|numeric|min:0',
            'desc' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $validator->errors()
            ], 422);
        }

        $table->update($request->all());

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
