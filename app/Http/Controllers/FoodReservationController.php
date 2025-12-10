<?php

namespace App\Http\Controllers;

use App\Models\FoodReservation;
use App\Models\DetailFoodReservation;
use App\Models\TableReservation;
use App\Models\Menu;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FoodReservationController extends Controller
{
public function index()
{
    $userId = Auth::id();

    // Ambil reservation terbaru milik user yang masih pending
    $reservation = TableReservation::where('user_id', $userId)
        ->where('status', 'pending')
        ->latest()
        ->first();

        dd($userId);
    if (!$reservation) {
        return redirect()->route('reservation.page')
            ->with('error', 'No pending reservation found for your account');
    }

    // Ambil restaurant berdasarkan reservation
    $restaurant = Restaurant::find($reservation->restaurant_id);

    // Ambil menu dari restaurant
    $menus = Menu::where('restaurant_id', $restaurant->restaurant_id)->get();

    // Ambil food reservation jika sudah ada
    $existingFoodReservation = FoodReservation::where('reservation_id', $reservation->reservation_id)
        ->with('details.menu')
        ->first();

    return Inertia::render('FoodReservation', [
        'reservation'   => $reservation,
        'restaurant'    => $restaurant,
        'menus'         => $menus,
        'minimumSpend'  => $restaurant->minimum_spend ?? 0,
        'existingFoodReservation' => $existingFoodReservation
    ]);
}


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservation_id' => 'required|exists:table_reservation,reservation_id',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,menu_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string|max:500',
            'tax_rate' => 'nullable|numeric|min:0|max:1', // 0.10 untuk 10%
            'service_rate' => 'nullable|numeric|min:0|max:1' // 0.05 untuk 5%
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $reservation = TableReservation::find($request->reservation_id);
            
            // Hapus food reservation lama jika ada (untuk update)
            $oldFoodReservation = FoodReservation::where('reservation_id', $request->reservation_id)->first();
            $oldFoodTotal = 0;
            
            if ($oldFoodReservation) {
                $oldFoodTotal = $oldFoodReservation->grand_total;
                $oldFoodReservation->delete(); // Akan cascade delete details
            }

            // Hitung total
            $totalFoodPrice = 0;
            $itemsData = [];

            foreach ($request->items as $item) {
                $menu = Menu::find($item['menu_id']);
                $subtotal = $menu->price * $item['quantity'];
                $totalFoodPrice += $subtotal;
                
                $itemsData[] = [
                    'menu' => $menu,
                    'quantity' => $item['quantity'],
                    'price' => $menu->price,
                    'subtotal' => $subtotal,
                    'notes' => $item['notes'] ?? null
                ];
            }

            // Calculate tax dan service
            $taxRate = $request->tax_rate ?? 0.10; // Default 10%
            $serviceRate = $request->service_rate ?? 0.05; // Default 5%
            
            $tax = $totalFoodPrice * $taxRate;
            $service = $totalFoodPrice * $serviceRate;
            $grandTotal = $totalFoodPrice + $tax + $service;

            // Create food reservation
            $foodReservation = FoodReservation::create([
                'food_reservation_id' => (string) Str::uuid(),
                'reservation_id' => $request->reservation_id,
                'total_food_price' => $totalFoodPrice,
                'tax' => $tax,
                'service_charge' => $service,
                'grand_total' => $grandTotal,
                'status' => 'pending'
            ]);

            // Create detail food reservations
            foreach ($itemsData as $itemData) {
                DetailFoodReservation::create([
                    'detail_food_reservation_id' => (string) Str::uuid(),
                    'food_reservation_id' => $foodReservation->food_reservation_id,
                    'menu_id' => $itemData['menu']->menu_id,
                    'quantity' => $itemData['quantity'],
                    'price' => $itemData['price'],
                    'subtotal' => $itemData['subtotal'],
                    'notes' => $itemData['notes']
                ]);
            }

            // Update bill di table reservation
            // Kurangi old food total, tambah new food total
            $newBill = ($reservation->bill - $oldFoodTotal) + $grandTotal;
            
            $reservation->update([
                'bill' => $newBill
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Food reservation created successfully',
                'data' => [
                    'food_reservation_id' => $foodReservation->food_reservation_id,
                    'reservation_id' => $reservation->reservation_id,
                    'total_food_price' => $totalFoodPrice,
                    'tax' => $tax,
                    'service_charge' => $service,
                    'grand_total' => $grandTotal,
                    'total_bill' => $newBill,
                    'items_count' => count($itemsData)
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create food reservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getByReservation($reservationId)
    {
        $foodReservation = FoodReservation::where('reservation_id', $reservationId)
            ->with('details.menu')
            ->first();

        if (!$foodReservation) {
            return response()->json([
                'success' => false,
                'message' => 'Food reservation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'food_reservation' => $foodReservation,
                'total_items' => $foodReservation->details->sum('quantity')
            ]
        ]);
    }

    public function update(Request $request, $foodReservationId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $foodReservation = FoodReservation::find($foodReservationId);
            
            if (!$foodReservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Food reservation not found'
                ], 404);
            }

            $foodReservation->update([
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Food reservation status updated',
                'data' => $foodReservation
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update food reservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete($foodReservationId)
    {
        try {
            DB::beginTransaction();

            $foodReservation = FoodReservation::find($foodReservationId);
            
            if (!$foodReservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Food reservation not found'
                ], 404);
            }

            $reservation = $foodReservation->reservation;
            $grandTotal = $foodReservation->grand_total;

            // Update bill di table reservation
            $reservation->update([
                'bill' => $reservation->bill - $grandTotal
            ]);

            // Delete food reservation (will cascade delete details)
            $foodReservation->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Food reservation deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete food reservation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}