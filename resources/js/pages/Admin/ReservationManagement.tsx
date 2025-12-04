import AppLayout from '@/layouts/app-layout'; // Pastikan path ini sesuai dengan struktur folder Anda
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Eye, Search, Store, Trash2, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Restaurant {
    restaurant_id: string;
    restaurant_name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Reservation {
    reservation_id: string;
    reservation_time: string;
    restaurant: Restaurant | null;
    status: 'pending' | 'confirmed' | 'cancelled';
    bill: number;
    user: User;
}

interface PageProps {
    auth: {
        user: User;
    };
    reservations: Reservation[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Admin Reservation',
        href: '/admin/reservation',
    },
];

export default function AdminReservationIndex({ auth, reservations }: PageProps) {

    const [searchTerm, setSearchTerm] = useState('');

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Confirmed
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                );
            default:
                return <span className="text-gray-500">{status}</span>;
        }
    };

    const filteredReservations = reservations.filter((res) => {
        const term = searchTerm.toLowerCase();
        return (
            res.user?.name?.toLowerCase().includes(term) || 
            res.user?.email?.toLowerCase().includes(term) || 
            res.restaurant?.restaurant_name?.toLowerCase().includes(term) || 
            res.reservation_id.toLowerCase().includes(term) 
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin - Manajemen Reservasi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900">

                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Daftar Reservasi Masuk</h3>
                                    <p className="text-sm text-gray-500">Kelola semua pesanan tempat dari pelanggan.</p>
                                </div>

                                <div className="relative w-full sm:w-72">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-6 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari nama, resto, atau email..."
                                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm h-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>

                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restoran</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu & Tanggal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bill</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredReservations.length > 0 ? (
                                            filteredReservations.map((res) => (
                                                <tr key={res.reservation_id} className="hover:bg-gray-50 transition-colors">

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold uppercase">
                                                                {res.user?.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {res.user?.name || 'User Tidak Dikenal'}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {res.user?.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Store className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm font-medium">
                                                                {res.restaurant?.restaurant_name || 'Restoran Dihapus'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(res.reservation_time).toLocaleDateString('id-ID', {
                                                                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(res.reservation_time).toLocaleTimeString('id-ID', {
                                                                hour: '2-digit', minute: '2-digit'
                                                            })} WITA
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatRupiah(res.bill)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(res.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-3">
                                                            <button className="text-blue-600 hover:text-blue-800 transition-colors" title="Lihat Detail">
                                                                <Eye className="w-5 h-5" />
                                                            </button>
                                                            <button className="text-red-500 hover:text-red-700 transition-colors" title="Hapus Reservasi">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <Search className="w-12 h-12 mb-2 text-gray-300" />
                                                        <p className="text-base font-medium">
                                                            {searchTerm ? `Tidak ditemukan hasil untuk "${searchTerm}"` : 'Belum ada data reservasi.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 text-xs text-gray-400 text-center">
                                Menampilkan {filteredReservations.length} data.
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}