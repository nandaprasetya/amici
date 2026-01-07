<?php


namespace App\Http\Controllers;

use App\Models\Restaurant;
use Inertia\Inertia;


class HomeController extends Controller {
    public function index()
{
    return Inertia::render('welcome', [
    'restaurants' => Restaurant::select(
        'restaurant_id',
        'restaurant_name',
        'map_x',
        'map_y',

    )
    ->whereNotNull('map_x')
    ->get()
]);

}
}