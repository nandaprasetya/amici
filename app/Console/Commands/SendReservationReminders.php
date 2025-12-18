<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\TableReservation;
use App\Mail\ReservationReminderMail;
use Illuminate\Support\Facades\Mail;

class SendReservationReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservation:send-reminder';
    protected $description = 'Send reservation reminder emails H-1';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $targetTime = $now->copy()->addDay();

        $reservations = TableReservation::with([
    'user',
    'details.table.restaurant'
])
->where('is_reminder', false)
->whereIn('status', ['pending', 'confirmed'])
->whereDate('reservation_time', $targetTime->toDateString())
->get();

        $sent = 0;

        foreach ($reservations as $reservation) {
            if ($reservation->user) {
                Mail::to($reservation->user->email)
                    ->send(new ReservationReminderMail($reservation));

                $reservation->update([
                    'is_reminder' => true
                ]);

                $sent++;
            }
        }

        $this->info("Reminder sent: {$sent}");
    }
}
