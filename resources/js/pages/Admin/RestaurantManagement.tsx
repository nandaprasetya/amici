import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Store, Clock, Pencil, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

interface Restaurant {
    restaurant_id: string;
    restaurant_name: string;
    open_time: string;
    close_time: string;
    desc: string;
}

interface PageProps {
    restaurants: Restaurant[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Restoran',
        href: '#',
    },
];

export default function RestaurantManagement({ restaurants }: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = restaurants.filter((resto) => {
        const term = searchTerm.toLowerCase();
        return (
            resto.restaurant_name?.toLowerCase().includes(term) ||
            (resto.desc && resto.desc.toLowerCase().includes(term))
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Restoran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Daftar Restoran / Tenant</h2>
                            <p className="text-sm text-gray-500">Kelola semua outlet makanan di food court.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari restoran..."
                                    className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 sm:text-sm h-10 transition-colors"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Link
                                href="/admin/restaurants/create"
                                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 inline-flex items-center justify-center gap-2 shadow-sm transition-colors h-10 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Restoran
                            </Link>
                        </div>
                    </div>

                    {/* Tabel Data Restoran */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Restoran</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Operasional</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* 4. Menampilkan Data Hasil Filter */}
                                    {filteredRestaurants.length > 0 ? (
                                        filteredRestaurants.map((resto) => (
                                            <tr key={resto.restaurant_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border border-orange-200">
                                                            <Store className="w-5 h-5" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-bold text-gray-900">{resto.restaurant_name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md w-fit">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                        {resto.open_time} - {resto.close_time}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 truncate max-w-xs" title={resto.desc}>
                                                        {resto.desc || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search className="w-12 h-12 text-gray-300 mb-2" />
                                                    <p>
                                                        {searchTerm
                                                            ? `Tidak ditemukan restoran dengan kata kunci "${searchTerm}"`
                                                            : 'Belum ada data restoran.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}