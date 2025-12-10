<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/RestaurantManagement', [
            'restaurants' => $restaurants
        ]);
    }

    public function create()
    {

        return Inertia::render('Admin/CreateRestaurant');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'restaurant_name' => 'required|string|max:100',
            'open_time'       => 'required',
            'close_time'      => 'required',
            'desc'            => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        Restaurant::create([
            'restaurant_id'   => (string) Str::uuid(),
            'restaurant_name' => $request->restaurant_name,
            'open_time'       => $request->open_time,
            'close_time'      => $request->close_time,
            'desc'            => $request->desc,
        ]);

        return redirect()->route('admin.restaurants.index')->with('success', 'Restoran berhasil ditambahkan.');
    }

    public function show($id)
    {
        $restaurant = Restaurant::find($id);
    }

    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::find($id);
        
        if (!$restaurant) {
            return redirect()->back()->with('error', 'Restoran tidak ditemukan.');
        }

        $request->validate([
            'restaurant_name' => 'required|string|max:255',
            'open_time'       => 'required',
            'close_time'      => 'required',
            'desc'            => 'nullable|string',
        ]);

        $restaurant->update($request->all());

        return redirect()->route('admin.restaurants.index')->with('success', 'Data restoran diperbarui.');
    }

    public function destroy($id)
    {
        $restaurant = Restaurant::find($id);
        
        if ($restaurant) {
            $restaurant->delete();
        }
        
        return redirect()->route('admin.restaurants.index')->with('success', 'Restoran berhasil dihapus.');
    }
}