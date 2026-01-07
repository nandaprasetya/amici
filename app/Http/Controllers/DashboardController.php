<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Restaurant;
use App\Models\TableReservation;
use App\Models\Payment;
use App\Models\FoodReservation;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->relationLoaded('role')) {
            $user->load('role');
        }

        $roleName = $user->role->role_name ?? 'User';

        $data = [];

        if ($roleName === 'Admin' || $roleName === 'SuperAdmin') {

    $totalRevenue = Payment::where('payment_status', 'pending')->sum('amount');

    $data = [
        'total_restaurants' => Restaurant::count(),
        'total_reservations' => TableReservation::count(),
        'total_revenue' => $totalRevenue,
        'pending_count' => TableReservation::where('status', 'pending')->count(),
        'chart_data' => $this->getReservationChartData(),
    ];
}


        else {
            $userId = $user->user_id;
            $upcomingReservations = TableReservation::with('restaurant')
                ->where('user_id', $userId)
                ->where('reservation_time', '>=', Carbon::now())
                ->where('status', '!=', 'cancelled')
                ->orderBy('reservation_time', 'asc')
                ->limit(3)
                ->get();

            $data = [
                'my_total_reservations' => TableReservation::where('user_id', $userId)->count(),
                'upcoming_reservations' => $upcomingReservations
            ];
        }

        return Inertia::render('Dashboard', [
            'role' => $roleName,
            'dashboardData' => $data
        ]);
    }

    private function getReservationChartData()
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = TableReservation::whereDate('reservation_time', $date)->count();
            $data[] = [
                'date' => $date->format('d M'),
                'count' => $count
            ];
        }
        return $data;
    }
}
