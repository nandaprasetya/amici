import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Clock, Store, FileText, Save, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manajemen Restoran',
        href: '/admin/restaurants',
    },
    {
        title: 'Tambah Restoran',
        href: '#',
    },
];

export default function CreateRestaurant() {
    const { data, setData, post, processing, errors } = useForm({
        restaurant_name: '',
        open_time: '',
        close_time: '',
        desc: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/restaurants');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Restoran Baru" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Tambah Restoran Baru</h2>
                            <p className="text-sm text-gray-500">Masukkan detail informasi tenant baru.</p>
                        </div>
                        <Link
                            href="/admin/restaurants"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Restoran</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Store className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5"
                                            placeholder="Contoh: Dapur Nusantara"
                                            value={data.restaurant_name}
                                            onChange={(e) => setData('restaurant_name', e.target.value)}
                                        />
                                    </div>
                                    {errors.restaurant_name && <p className="text-red-500 text-xs mt-1">{errors.restaurant_name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Buka</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="time"
                                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5"
                                                value={data.open_time}
                                                onChange={(e) => setData('open_time', e.target.value)}
                                            />
                                        </div>
                                        {errors.open_time && <p className="text-red-500 text-xs mt-1">{errors.open_time}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jam Tutup</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="time"
                                                className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5"
                                                value={data.close_time}
                                                onChange={(e) => setData('close_time', e.target.value)}
                                            />
                                        </div>
                                        {errors.close_time && <p className="text-red-500 text-xs mt-1">{errors.close_time}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            rows={4}
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm py-2.5"
                                            placeholder="Deskripsi singkat mengenai restoran..."
                                            value={data.desc}
                                            onChange={(e) => setData('desc', e.target.value)}
                                        />
                                    </div>
                                    {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
                                </div>

                                <div className="pt-4 flex justify-end border-t border-gray-100 mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Restoran'}
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