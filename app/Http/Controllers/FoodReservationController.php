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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FoodReservationController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        $reservation = TableReservation::where('user_id', $userId)
            ->where('status', 'pending')
            ->latest('created_at')
            ->first();
        
        if (!$reservation) {
            return redirect()->route('reservation.page')
                ->with('error', 'No pending reservation found. Please create a reservation first.');
        }

        $existingFoodReservation = FoodReservation::where('reservation_id', $reservation->reservation_id)->first();
        
        if ($existingFoodReservation) {
            return redirect()->route('reservation.page')
                ->with('info', 'You have already placed a food order for this reservation.');
        }

        $restaurant = Restaurant::find($reservation->restaurant_id);

        if (!$restaurant) {
            return redirect()->route('reservation.page')
                ->with('error', 'Restaurant not found');
        }

        $menus = Menu::where('restaurant_id', $restaurant->restaurant_id)->get();
        
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
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    public function store(Request $request)
    {
        Log::info('=== FOOD RESERVATION STORE START ===');
        Log::info('Request Data:', $request->all());

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
                throw new \Exception('Reservation not found');
            }

            // Delete existing food reservation if any
            $existingFoodReservation = FoodReservation::where('reservation_id', $request->reservation_id)->first();
            if ($existingFoodReservation) {
                $existingFoodReservation->delete();
            }

            // Calculate totals and build item details
            $itemDetails = [];
            $totalFoodPrice = 0;

            foreach ($request->items as $item) {
                $menu = Menu::findOrFail($item['menu_id']);
                
                $quantity = (int) $item['quantity'];
                $price = (float) $menu->price;
                $subtotal = $quantity * $price;

                $totalFoodPrice += $subtotal;

                // Add menu item to Midtrans item_details
                $itemDetails[] = [
                    'id' => $menu->menu_id,
                    'price' => (int) round($price),
                    'quantity' => $quantity,
                    'name' => $menu->menu_name,
                ];
            }

            // Calculate tax and service
            $tax = $totalFoodPrice * 0.10;
            $service = $totalFoodPrice * 0.05;
            $grandTotal = $totalFoodPrice + $tax + $service;

            // Round to integer for Midtrans
            $taxInt = (int) round($tax);
            $serviceInt = (int) round($service);
            $grandTotalInt = (int) round($grandTotal);

            // Add tax and service as separate items
            $itemDetails[] = [
                'id' => 'TAX-' . time(),
                'price' => $taxInt,
                'quantity' => 1,
                'name' => 'Tax (10%)',
            ];

            $itemDetails[] = [
                'id' => 'SERVICE-' . time(),
                'price' => $serviceInt,
                'quantity' => 1,
                'name' => 'Service Charge (5%)',
            ];

            // Calculate gross amount from item_details to ensure it matches
            $calculatedGrossAmount = 0;
            foreach ($itemDetails as $item) {
                $calculatedGrossAmount += $item['price'] * $item['quantity'];
            }

            Log::info('Calculated amounts:', [
                'total_food_price' => $totalFoodPrice,
                'tax' => $tax,
                'service' => $service,
                'grand_total' => $grandTotal,
                'calculated_gross_amount' => $calculatedGrossAmount,
                'item_details' => $itemDetails
            ]);

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

            Log::info('Food reservation created:', ['id' => $foodReservationId]);

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

            // Update reservation bill
            $reservation->update([
                'bill' => $reservation->bill + $grandTotal
            ]);

            // Setup Midtrans
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production', false);
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            Log::info('Midtrans Config:', [
                'server_key' => substr(config('midtrans.server_key'), 0, 10) . '...',
                'is_production' => config('midtrans.is_production'),
            ]);

            $user = Auth::user();

            // Midtrans params - use calculated gross amount to ensure match
            $params = [
                'transaction_details' => [
                    'order_id' => $foodReservationId,
                    'gross_amount' => $calculatedGrossAmount,
                ],
                'customer_details' => [
                    'first_name' => $user->name ?? 'Customer',
                    'email' => $user->email ?? 'customer@example.com',
                    'phone' => $user->phone ?? '081234567890',
                ],
                'item_details' => $itemDetails,
            ];

            Log::info('Midtrans Request Params:', $params);

            // Verify that gross_amount matches sum of items
            $itemSum = array_sum(array_map(function($item) {
                return $item['price'] * $item['quantity'];
            }, $itemDetails));

            if ($params['transaction_details']['gross_amount'] !== $itemSum) {
                throw new \Exception("Gross amount mismatch: {$params['transaction_details']['gross_amount']} vs {$itemSum}");
            }

            // Get Snap Token
            $snapToken = \Midtrans\Snap::getSnapToken($params);

            Log::info('Snap Token Generated:', ['token' => $snapToken]);

            // Save payment record
            Payment::create([
                'payment_id' => 'PAY-' . strtoupper(Str::random(10)),
                'food_reservation_id' => $foodReservation->food_reservation_id,
                'amount' => $grandTotal,
                'payment_method' => 'midtrans',
                'payment_status' => 'pending',
                'snap_token' => $snapToken,
            ]);

            DB::commit();

            Log::info('=== FOOD RESERVATION STORE SUCCESS ===');

            // Return with snap token in session
            // return redirect()->back()->with('snapToken', $snapToken);
            return response()->json([
            'message' => 'Order created successfully',
            'snapToken' => $snapToken, // <---- INI YANG FRONTEND PAKAI
            'reservationId' => $foodReservation->food_reservation_id,
        ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('=== FOOD RESERVATION ERROR ===');
            Log::error('Error Message: ' . $e->getMessage());
            Log::error('Stack Trace: ' . $e->getTraceAsString());
            
            // return redirect()->back()->withErrors([
            //     'error' => 'Failed to process order: ' . $e->getMessage()
            // ]);
            return response()->json([
            'error' => $e->getMessage(),
        ], 500);
        }
    }

    public function midtransCallback(Request $request)
    {
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production', false);

        try {
            $notification = new \Midtrans\Notification();

            $orderId = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status ?? 'accept';

            Log::info('Midtrans Notification:', [
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
            Log::error('Midtrans callback error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }
}