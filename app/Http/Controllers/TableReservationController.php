<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TableReservation;
use Illuminate\Support\Facades\Validator;
use App\Models\TableReservation;
use App\Models\Restaurant;
use App\Models\Table;
use App\Models\User;
use Illuminate\Support\Str;
use App\Mail\ReservationReminderMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\DetailTableReservation;


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
    
    public function foodReservation()
    {
        Inertia::render("FoodReservation");
    }

    public function store(Request $request)
{
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
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors'  => $validator->errors()
        ], 422);
    }

    try {
        DB::beginTransaction();

        $dateTime = Carbon::parse($request->date . ' ' . $request->time);

        /** HITUNG TOTAL MINIMUM SPEND **/
        $minimumSpend = 0;

        foreach ($request->tables as $tableData) {
            $table = Table::findOrFail($tableData['table_id']);
            $minimumSpend += ($table->minimun_spend * $tableData['count']);
        }

        /** GET USER ID **/
        $userId = auth()->id() ?? User::first()->user_id;

        /** CREATE RESERVATION **/
        $reservation = TableReservation::create([
            'reservation_id'   => (string) Str::uuid(),
            'user_id'          => $userId,
            'reservation_time' => $dateTime,
            'status'           => 'pending',
            'minimum_spend'    => $minimumSpend,   // ⬅ SIMPAN DI SINI
        ]);

        /** INSERT DETAIL TABLE **/
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


        /** CEK KALO ADA MINIMUM SPEND, REDIRECT KE FOOD PAGE **/
        if ($minimumSpend > 0) {
            return response()->json([
                'success' => true,
                'redirect_url' => route('food.reservation.page', [
                    'reservation_id' => $reservation->reservation_id
                    // Tidak perlu minimum_spend / restaurant_id lagi
                ])
            ]);
        }

        /** TIDAK ADA MINIMUM SPEND **/
        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data' => [
                'reservation_id' => $reservation->reservation_id,
                'customer_name' => $request->name,
                'reservation_time' => $dateTime->format('Y-m-d H:i:s'),
                'guests' => $request->guests,
                'minimum_spend' => $minimumSpend,
                'status' => $reservation->status
            ],
            'redirect_url' => null
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Failed to create reservation',
            'error' => $e->getMessage()
        ], 500);
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
        
        // Jika tidak ada restaurant_id di query, ambil restaurant pertama
        if (!$restaurantId) {
            $restaurant = Restaurant::orderBy('created_at', 'asc')->first();
        } else {
            $restaurant = Restaurant::find($restaurantId);
            
            // Jika restaurant tidak ditemukan, ambil yang pertama
            if (!$restaurant) {
                $restaurant = Restaurant::orderBy('created_at', 'asc')->first();
            }
        }
        
        // Jika tidak ada restaurant sama sekali
        if (!$restaurant) {
            return Inertia::render('reservation', [
                'restaurant' => null,
                'tables' => [],
                'message' => 'Belum ada restoran yang terdaftar.'
            ]);
        }
        
        // Ambil tabel berdasarkan restaurant_id
        $tables = Table::where('restaurant_id', $restaurant->restaurant_id)->get();
        
        return Inertia::render('reservation', [
            'restaurant' => $restaurant,
            'tables' => $tables
        ]);
    }
}
