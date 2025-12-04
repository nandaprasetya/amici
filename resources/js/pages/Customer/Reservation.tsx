import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Users } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Reservation() {
    const { data, setData, post, processing, errors } = useForm({
        reservation_time: '',
        pax: 2,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('reservation.store.public'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Buat Reservasi', href: '#' }]}>
            <Head title="Buat Reservasi Baru" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-8">

                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900">Reservasi Meja</h2>
                                <p className="text-gray-500 text-sm mt-1">Silakan lengkapi data di bawah ini untuk memesan tempat.</p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="reservation_time" className="block text-sm font-medium text-gray-700 mb-1">
                                        Waktu & Tanggal Kedatangan
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="reservation_time"
                                            type="datetime-local"
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3"
                                            value={data.reservation_time}
                                            onChange={(e) => setData('reservation_time', e.target.value)}
                                            required
                                        />
                                    </div>
                                    {errors.reservation_time && <p className="text-red-500 text-xs mt-1">{errors.reservation_time}</p>}
                                </div>
                                
                                <div>
                                    <label htmlFor="pax" className="block text-sm font-medium text-gray-700 mb-1">
                                        Jumlah Orang
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Users className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="pax"
                                            type="number"
                                            min="1"
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-3"
                                            value={data.pax}
                                            onChange={(e) => setData('pax', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">*Estimasi agar kami bisa menyiapkan meja yang pas.</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Memproses...' : 'Konfirmasi Reservasi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

function route(arg0: string): string {
    throw new Error('Function not implemented.');
}
