<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TableReservation;
use Illuminate\Support\Facades\Validator;
use App\Models\Restaurant;
use App\Models\Table;
use App\Models\User;
use Illuminate\Support\Str;
use App\Mail\ReservationReminderMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Models\DetailTableReservation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TableReservationController extends Controller
{
    public function index()
    {
        $reservations = TableReservation::with('user')
            ->orderBy('reservation_time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    public function store(Request $request)
{
    // Log untuk debugging
    Log::info('Reservation Request:', $request->all());

    if (!Auth::check()) {
        return back()->withErrors(['auth' => 'User not authenticated']);
    }

    $validator = Validator::make($request->all(), [
        'restaurant_id'     => 'required|exists:restaurants,restaurant_id',
        'name'              => 'required|string|max:255',
        'date'              => 'required|date|after_or_equal:today',
        'time'              => 'required|string',
        'guests'            => 'required|integer|min:1',
        'tables'            => 'required|array|min:1',
        'tables.*.table_id' => 'required|exists:tables,table_id',
        'tables.*.count'    => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return back()->withErrors($validator->errors());
    }

    try {
        DB::beginTransaction();

        // Parse waktu dari format "05:05 PM" ke format 24 jam
        $timeString = $request->time;
        $parsedTime = Carbon::createFromFormat('h:i A', $timeString);
        
        // Gabungkan tanggal dan waktu
        $dateTime = Carbon::parse($request->date)->setTimeFrom($parsedTime);

        Log::info('Parsed DateTime:', ['datetime' => $dateTime->toDateTimeString()]);

        // Hitung minimum spend
        $minimumSpend = 0;
        foreach ($request->tables as $tableData) {
            $table = Table::findOrFail($tableData['table_id']);
            $minimumSpend += $table->minimun_spend * $tableData['count'];
        }

        // Create reservation
        $reservation = TableReservation::create([
            'reservation_id'   => (string) Str::uuid(),
            'user_id'          => Auth::id(),
            'restaurant_id'    => $request->restaurant_id,
            'reservation_time' => $dateTime,
            'status'           => 'pending',
            'minimum_spend'    => $minimumSpend
        ]);

        // Insert detail tables
        foreach ($request->tables as $tableData) {
            for ($i = 0; $i < $tableData['count']; $i++) {
                DetailTableReservation::create([
                    'detail_table_reservation_id' => (string) Str::uuid(),
                    'table_id' => $tableData['table_id'],
                    'reservation_id' => $reservation->reservation_id
                ]);
            }
        }

        DB::commit();

        Log::info('Reservation Created:', ['reservation_id' => $reservation->reservation_id]);

        // Redirect if minimum spend exists - GUNAKAN REDIRECT, BUKAN JSON
if ($minimumSpend > 0) {
    return redirect()->route('food.reservation.page', [
        'reservation_id' => $reservation->reservation_id
    ])->with('success', 'Reservation created successfully');
}

        // Jika tidak ada minimum spend, redirect ke halaman success atau back
        return back()->with('success', 'Reservation created successfully without minimum spend');

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Reservation Error:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return back()->withErrors(['error' => 'Failed to create reservation: ' . $e->getMessage()]);
    }
}

    public function show($id)
    {
        $reservation = TableReservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

    public function update(Request $request, $id)
    {
        $reservation = TableReservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id'           => 'sometimes|exists:users,user_id',
            'reservation_time'  => 'sometimes|date',
            'status'            => 'sometimes|in:pending,confirmed,cancelled',
            'bill'              => 'sometimes|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $reservation->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Reservation updated successfully',
            'data' => $reservation
        ]);
    }

    public function destroy($id)
    {
        $reservation = TableReservation::find($id);

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservation deleted successfully'
        ]);
    }

    public function sendReminders()
    {
        $now = Carbon::now();
        $targetTime = $now->copy()->addDay();

        $reservations = TableReservation::where('is_reminder', false)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('reservation_time', $targetTime->toDateString())
            ->get();

        foreach ($reservations as $reservation) {
            if ($reservation->user) {
                Mail::to($reservation->user->email)
                    ->send(new ReservationReminderMail($reservation));

                $reservation->update([
                    'is_reminder' => true
                ]);
            }
        }

        return response()->json([
            'message' => 'Reminder checked & sent',
            'total_sent' => count($reservations)
        ]);
    }

    public function reservationPage(Request $request)
    {
        $restaurantId = $request->query('restaurant_id');

        if (!$restaurantId) {
            $restaurant = Restaurant::orderBy('created_at', 'asc')->first();
        } else {
            $restaurant = Restaurant::find($restaurantId);

            if (!$restaurant) {
                $restaurant = Restaurant::orderBy('created_at', 'asc')->first();
            }
        }

        if (!$restaurant) {
            return Inertia::render('reservation', [
                'restaurant' => null,
                'tables' => [],
                'message' => 'Belum ada restoran yang terdaftar.'
            ]);
        }

        $tables = Table::where('restaurant_id', $restaurant->restaurant_id)->get();

        return Inertia::render('reservation', [
            'restaurant' => $restaurant,
            'tables' => $tables
        ]);
    }
}