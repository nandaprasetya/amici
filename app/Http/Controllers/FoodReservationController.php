<?php

namespace App\Http\Controllers;

use App\Models\FoodReservation;
use App\Models\DetailFoodReservation;
use App\Models\TableReservation;
use App\Models\Restaurant;
use App\Models\Menu;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FoodReservationController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Ambil reservation terbaru milik user yang masih pending
        $reservation = TableReservation::where('user_id', $userId)
            ->where('status', 'pending')
            ->latest('created_at')
            ->first();
        
        if (!$reservation) {
            return redirect()->route('reservation.page')
                ->with('error', 'No pending reservation found. Please create a reservation first.');
        }

        // Cek apakah sudah ada food reservation
        $existingFoodReservation = FoodReservation::where('reservation_id', $reservation->reservation_id)->first();
        
        if ($existingFoodReservation) {
            return redirect()->route('reservation.page')
                ->with('info', 'You have already placed a food order for this reservation.');
        }

        // Ambil restaurant berdasarkan reservation
        $restaurant = Restaurant::find($reservation->restaurant_id);

        if (!$restaurant) {
            return redirect()->route('reservation.page')
                ->with('error', 'Restaurant not found');
        }

        // Ambil menu dari restaurant
        $menus = Menu::where('restaurant_id', $restaurant->restaurant_id)->get();
        
        // Transform category jika disimpan sebagai JSON string
        $menus = $menus->map(function($menu) {
            if (is_string($menu->category)) {
                $menu->category = json_decode($menu->category, true) ?? [];
            }
            return $menu;
        });

        return Inertia::render('FoodReservation', [
            'reservation'   => $reservation,
            'restaurant'    => $restaurant,
            'menus'         => $menus,
            'minimumSpend'  => $reservation->minimum_spend ?? 0,
            'midtransClientKey' => config('midtrans.client_key')
        ]);
    }

   public function store(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:table_reservation,reservation_id',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,menu_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $reservation = TableReservation::find($request->reservation_id);

            if (!$reservation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reservation not found'
                ], 404);
            }

            // Cek apakah sudah ada food reservation
            $existingFoodReservation = FoodReservation::where('reservation_id', $request->reservation_id)->first();
            
            if ($existingFoodReservation) {
                // Delete existing untuk update
                $existingFoodReservation->delete();
            }

            // Hitung total dari items
            $itemDetails = [];
            $totalFoodPrice = 0;

            foreach ($request->items as $item) {
                $menu = Menu::findOrFail($item['menu_id']);
                
                $quantity = (int) $item['quantity'];
                $price = (float) $menu->price;
                $subtotal = $quantity * $price;

                $totalFoodPrice += $subtotal;

                // Prepare item untuk Midtrans - PENTING: Harus ada name dan tidak boleh null
                $itemDetails[] = [
                    'id' => $menu->menu_id,
                    'price' => (int) round($price), // Midtrans butuh integer
                    'quantity' => $quantity,
                    'name' => $menu->name ?? 'Menu Item', // WAJIB ada name
                ];
            }

            // Calculate tax dan service
            $tax = $totalFoodPrice * 0.10;
            $service = $totalFoodPrice * 0.05;
            $grandTotal = $totalFoodPrice + $tax + $service;

            // Add tax dan service ke item_details
            $itemDetails[] = [
                'id' => 'TAX-' . time(),
                'price' => (int) round($tax),
                'quantity' => 1,
                'name' => 'Tax 10%', // WAJIB ada name
            ];

            $itemDetails[] = [
                'id' => 'SERVICE-' . time(),
                'price' => (int) round($service),
                'quantity' => 1,
                'name' => 'Service Charge 5%', // WAJIB ada name
            ];

            // PENTING: Hitung ulang gross_amount dari item_details untuk memastikan match
            $calculatedGrossAmount = 0;
            foreach ($itemDetails as $item) {
                $calculatedGrossAmount += $item['price'] * $item['quantity'];
            }

            // Create food reservation
            $foodReservationId = 'FR-' . strtoupper(Str::random(10));
            
            $foodReservation = FoodReservation::create([
                'food_reservation_id' => $foodReservationId,
                'reservation_id' => $request->reservation_id,
                'total_food_price' => $totalFoodPrice,
                'tax' => $tax,
                'service_charge' => $service,
                'grand_total' => $grandTotal,
                'status' => 'pending',
            ]);

            // Create detail food reservations
            foreach ($request->items as $item) {
                $menu = Menu::findOrFail($item['menu_id']);
                
                $quantity = (int) $item['quantity'];
                $price = (float) $menu->price;
                $subtotal = $quantity * $price;

                DetailFoodReservation::create([
                    'detail_food_reservation_id' => (string) Str::uuid(),
                    'food_reservation_id' => $foodReservation->food_reservation_id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $subtotal,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // Update bill di table reservation
            $reservation->update([
                'bill' => $reservation->bill + $grandTotal
            ]);

            // Setup Midtrans
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production', false);
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            // Get user info
            $user = Auth::user();

            // Midtrans transaction params
            $params = [
                'transaction_details' => [
                    'order_id' => $foodReservationId,
                    'gross_amount' => $calculatedGrossAmount, // HARUS SAMA dengan sum of item_details
                ],
                'customer_details' => [
                    'first_name' => $user->name ?? 'Customer',
                    'email' => $user->email ?? 'customer@example.com',
                    'phone' => $user->phone ?? '081234567890',
                ],
                'item_details' => $itemDetails,
            ];

            \Log::info('Midtrans Request:', $params);

            // Get Snap Token
            $snapToken = \Midtrans\Snap::getSnapToken($params);

            // Simpan payment record
            Payment::create([
                'payment_id' => 'PAY-' . strtoupper(Str::random(10)),
                'food_reservation_id' => $foodReservation->food_reservation_id,
                'amount' => $grandTotal,
                'payment_method' => 'midtrans',
                'payment_status' => 'pending',
                'snap_token' => $snapToken,
            ]);

            DB::commit();

            // Return response dengan snap token
            return response()->json([
                'success' => true,
                'message' => 'Food reservation created successfully',
                'data' => [
                    'food_reservation_id' => $foodReservation->food_reservation_id,
                    'snap_token' => $snapToken,
                    'grand_total' => $grandTotal
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Food reservation error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to process order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Webhook untuk notifikasi dari Midtrans
    public function midtransCallback(Request $request)
    {
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production', false);

        try {
            $notification = new \Midtrans\Notification();

            $orderId = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status ?? 'accept';

            \Log::info('Midtrans Notification:', [
                'order_id' => $orderId,
                'transaction_status' => $transactionStatus,
                'fraud_status' => $fraudStatus
            ]);

            $payment = Payment::where('food_reservation_id', $orderId)->first();

            if (!$payment) {
                return response()->json(['message' => 'Payment not found'], 404);
            }

            $foodReservation = FoodReservation::find($orderId);

            if (!$foodReservation) {
                return response()->json(['message' => 'Food reservation not found'], 404);
            }

            // Update status berdasarkan response Midtrans
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'accept') {
                    $payment->payment_status = 'success';
                    $foodReservation->status = 'confirmed';
                }
            } else if ($transactionStatus == 'settlement') {
                $payment->payment_status = 'success';
                $foodReservation->status = 'confirmed';
            } else if ($transactionStatus == 'pending') {
                $payment->payment_status = 'pending';
                $foodReservation->status = 'pending';
            } else if ($transactionStatus == 'deny' || $transactionStatus == 'cancel' || $transactionStatus == 'expire') {
                $payment->payment_status = 'failed';
                $foodReservation->status = 'cancelled';
            }

            $payment->save();
            $foodReservation->save();

            return response()->json(['message' => 'Notification processed successfully']);

        } catch (\Exception $e) {
            \Log::error('Midtrans callback error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }
}