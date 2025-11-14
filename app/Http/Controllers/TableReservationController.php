<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TableReservation;
use Illuminate\Support\Str;
use App\Mail\ReservationReminderMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;


class TableReservationController extends Controller
{
    public function index()
    {
        $reservations = TableReservation::all();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'           => 'required|exists:users,user_id',
            'reservation_time'  => 'required|date',
            'status'            => 'sometimes|in:pending,confirmed,cancelled',
            'bill'              => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $reservation = TableReservation::create([
            'reservation_id'   => (string) Str::uuid(),
            'user_id'          => $request->user_id,
            'reservation_time' => $request->reservation_time,
            'status'           => $request->status ?? 'pending',
            'bill'             => $request->bill
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data'    => $reservation
        ], 201);
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
            Mail::to($reservation->user->email)
                ->send(new ReservationReminderMail($reservation));

            $reservation->update([
                'is_reminder' => true
            ]);
        }

        return response()->json([
            'message' => 'Reminder checked & sent',
            'total_sent' => count($reservations)
        ]);
    }
}
