<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant;
use Inertia\Inertia;

class AppController extends Controller
{
public function index(Request $request)
    {

        $query = Restaurant::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('restaurant_name', 'like', "%{$search}%")
                  ->orWhere('desc', 'like', "%{$search}%");
        }

        $restaurants = $query->orderBy('restaurant_name', 'asc')->get();
        
        return Inertia::render('Customer/Restaurants/Index', [
            'restaurants' => $restaurants,
            'filters' => $request->only(['search']),
        ]);
    }

}
