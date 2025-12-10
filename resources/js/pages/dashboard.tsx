import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Utensils,
    Users,
    DollarSign,
    CalendarClock,
    Clock,
    MapPin,
    CalendarCheck,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

interface Restaurant {
    restaurant_name: string;
}

interface Reservation {
    reservation_id: string;
    reservation_time: string;
    status: string;
    restaurant?: Restaurant;
}

interface ChartData {
    date: string;
    count: number;
}

interface DashboardData {
    // admin
    total_restaurants?: number;
    total_reservations?: number;
    total_revenue?: number;
    pending_count?: number;
    chart_data?: ChartData[];

    // user
    my_total_reservations?: number;
    upcoming_reservations?: Reservation[];
}

interface PageProps {
    auth: {
        user: {
            name: string;
        };
    };
    role: string; 
    dashboardData: DashboardData;
}

export default function Dashboard() {
    const { auth, role, dashboardData = {} } = usePage<PageProps>().props;

    const isAdmin = role === 'Admin' || role === 'SuperAdmin';

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }),
            time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Halo, {auth.user.name}! 👋
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {isAdmin
                                    ? 'Berikut adalah ringkasan performa Food Court hari ini.'
                                    : 'Selamat datang kembali! Sudah siap memesan makanan enak?'}
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {isAdmin ? 'Administrator' : 'Customer'}
                            </span>
                        </div>
                    </div>


                    {isAdmin && (
                        <div className="space-y-6">
                            {/* Statistik Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Restoran"
                                    value={dashboardData.total_restaurants}
                                    icon={<Utensils className="w-6 h-6 text-orange-600" />}
                                    bgColor="bg-orange-100"
                                    link="/admin/restaurants"
                                />
                                <StatCard
                                    title="Total Reservasi"
                                    value={dashboardData.total_reservations}
                                    icon={<Users className="w-6 h-6 text-blue-600" />}
                                    bgColor="bg-blue-100"
                                    link="/admin/reservation"
                                />
                                <StatCard
                                    title="Total Pemasukan"
                                    value={formatRupiah(dashboardData.total_revenue || 0)}
                                    icon={<DollarSign className="w-6 h-6 text-green-600" />}
                                    bgColor="bg-green-100"
                                    isMoney
                                />
                                <StatCard
                                    title="Butuh Konfirmasi"
                                    value={dashboardData.pending_count}
                                    icon={<CalendarClock className="w-6 h-6 text-yellow-600" />}
                                    bgColor="bg-yellow-100"
                                    link="/admin/reservation"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-gray-500" />
                                        Tren Reservasi (7 Hari Terakhir)
                                    </h3>
                                </div>
                                <div className="flex items-end justify-between h-48 gap-2">
                                    {dashboardData.chart_data?.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center w-full group">
                                            <div className="relative w-full flex justify-end flex-col items-center h-full">
                                                <div
                                                    className="w-full bg-orange-200 rounded-t-md group-hover:bg-orange-300 transition-all duration-300 relative"
                                                    style={{ height: `${(item.count * 10) + 5}%`, maxHeight: '100%' }}
                                                >
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.count} Resv
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2 font-medium">{item.date}</p>
                                        </div>
                                    ))}
                                    {(!dashboardData.chart_data || dashboardData.chart_data.length === 0) && (
                                        <div className="w-full text-center text-gray-400 text-sm py-10">Belum ada data grafik.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                    {!isAdmin && (
                        <div className="space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="font-semibold text-lg opacity-90">Total Riwayat Makan</h3>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <span className="text-5xl font-bold">{dashboardData.my_total_reservations || 0}</span>
                                            <span className="text-sm opacity-75">Kali</span>
                                        </div>
                                        <Link href="/my-reservations" className="mt-6 inline-flex items-center gap-1 text-sm font-medium hover:underline bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition">
                                            Lihat Riwayat <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                    <Utensils className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10 rotate-12" />
                                </div>

                                <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center items-start">
                                    <h3 className="font-bold text-gray-800 text-xl">Lapar sekarang? 🍔</h3>
                                    <p className="text-gray-500 text-sm mt-2 mb-6 max-w-lg">
                                        Temukan berbagai pilihan restoran terbaik di Amici Food Court. Pesan tempat dudukmu sekarang sebelum kehabisan!
                                    </p>
                                    <Link href="/restaurants" className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-gray-200">
                                        <Utensils className="w-4 h-4" /> Cari Restoran & Reservasi
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CalendarCheck className="w-5 h-5 text-orange-600" />
                                    Jadwal Makan Mendatang
                                </h3>

                                {dashboardData.upcoming_reservations && dashboardData.upcoming_reservations.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {dashboardData.upcoming_reservations.map((res) => {
                                            const { date, time } = formatDate(res.reservation_time);
                                            return (
                                                <div key={res.reservation_id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {res.status}
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-mono">#{res.reservation_id.substring(0, 6)}</span>
                                                    </div>

                                                    <h4 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-orange-600 transition-colors">
                                                        {res.restaurant?.restaurant_name || 'Restoran'}
                                                    </h4>

                                                    <div className="space-y-3 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 bg-gray-100 rounded-md"><Clock className="w-4 h-4 text-gray-500" /></div>
                                                            <span className="font-medium">{time} WITA</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-1.5 bg-gray-100 rounded-md"><MapPin className="w-4 h-4 text-gray-500" /></div>
                                                            <span className="truncate">{date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                                        <CalendarClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">Tidak ada jadwal makan dalam waktu dekat.</p>
                                        <p className="text-gray-400 text-sm mt-1">Yuk buat reservasi baru!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, bgColor, isMoney = false, link }: any) {
    const content = (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6 border border-gray-100 h-full hover:shadow-md transition-shadow group">
            <div className="flex items-center">
                <div className={`p-4 rounded-xl ${bgColor} shrink-0 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className={`text-2xl font-bold text-gray-900 mt-1 ${isMoney ? 'tracking-tight' : ''}`}>
                        {value !== undefined ? value : '-'}
                    </p>
                </div>
            </div>
        </div>
    );

    if (link) {
        return <Link href={link} className="block h-full">{content}</Link>;
    }
    return content;
}