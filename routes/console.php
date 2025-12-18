<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

use App\Http\Controllers\TableReservationController;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    app(\App\Http\Controllers\TableReservationController::class)->sendReminders();
})->everyMinute();

Schedule::command('reservation:send-reminder')
    ->everyMinute();