@component('mail::message')
# Reservation Reminder 🍽️

Hello {{ $reservation->user->name }},

This is a friendly reminder for your upcoming reservation.

@component('mail::panel')
📅 **Date**: {{ $reservation->reservation_time->format('d M Y') }}  
⏰ **Time**: {{ $reservation->reservation_time->format('H:i') }}  
@endcomponent

@component('mail::button', ['url' => url('/reservations/'.$reservation->id)])
View Reservation
@endcomponent

If you have any questions, feel free to contact us.

Thanks,  
{{ config('app.name') }}
@endcomponent
