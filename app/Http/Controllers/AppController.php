<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
   public function index()
{
    dd(auth()->user());
    return view('app', [
        'user' => auth()->user(),
    ]);
}

}
