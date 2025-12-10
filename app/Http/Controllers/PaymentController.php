<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Set Midtrans configuration
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function createTransaction(Request $request)
    {
        Log::info('Payment request received', $request->all());

        try {
            $transactionDetails = $request->input('transaction_details');
            $itemDetails = $request->input('item_details');
            $customerDetails = $request->input('customer_details');

            $params = [
                'transaction_details' => [
                    'order_id' => $transactionDetails['order_id'],
                    'gross_amount' => (int) $transactionDetails['gross_amount'],
                ],
                'item_details' => $itemDetails,
                'customer_details' => $customerDetails,
            ];

            Log::info('Sending to Midtrans', $params);

            $snapToken = Snap::getSnapToken($params);

            Log::info('Token generated successfully', ['token' => $snapToken]);

            return response()->json([
                'token' => $snapToken,
                'success' => true
            ], 200);

        } catch (\Exception $e) {
            Log::error('Payment error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $serverKey = config('midtrans.server_key');
            $hashed = hash(
                "sha512", 
                $request->order_id . 
                $request->status_code . 
                $request->gross_amount . 
                $serverKey
            );

            if ($hashed == $request->signature_key) {
                $status = $request->transaction_status;
                
                if ($status == 'capture' || $status == 'settlement') {
                    Log::info('Payment successful', $request->all());
                    // Update database here
                    return response()->json(['message' => 'Payment successful']);
                } 
                else if ($status == 'pending') {
                    Log::info('Payment pending', $request->all());
                    return response()->json(['message' => 'Payment pending']);
                } 
                else if ($status == 'deny' || $status == 'expire' || $status == 'cancel') {
                    Log::info('Payment failed', $request->all());
                    return response()->json(['message' => 'Payment failed']);
                }
            }

            return response()->json(['message' => 'Invalid signature'], 403);
            
        } catch (\Exception $e) {
            Log::error('Callback error: ' . $e->getMessage());
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}