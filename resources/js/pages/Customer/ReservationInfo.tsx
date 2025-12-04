import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, MapPin, Utensils, XCircle } from 'lucide-react';

interface Reservation {
  reservation_id: string;
  reservation_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bill: number;
}

interface PageProps {
  reservations: Reservation[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Riwayat Reservasi', href: '/my-reservations' },
];

export default function UserReservationIndex({ reservations }: PageProps) {

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
      full: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Dikonfirmasi</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Dibatalkan</span>
          </div>
        );
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Riwayat Reservasi Saya" />

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 sm:px-0 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Riwayat Reservasi</h2>
              <p className="text-sm text-gray-500 mt-1">Daftar pesanan meja makan Anda di Amici Food Court.</p>
            </div>
            <a href="/reservation" className='px-[16px] py-[6px] group h-[38px] overflow-hidden border border-black rounded-[24px] duration-[0.5s] w-fit hover:bg-black'>
              <div className="inner-link w-fit h-fit group-hover:-translate-y-[50%] duration-[0.5s] ease-out text-black">
                <p className='m-0 font-medium text-[16px]'>Make Reservation</p>
                <p className='m-0 font-medium text-[16px] text-white'>Make Reservation</p>
              </div>
            </a>
          </div>

          <div className="space-y-4 px-4 sm:px-0">
            {reservations.length > 0 ? (
              reservations.map((res) => {
                const dateObj = formatDate(res.reservation_time);
                return (
                  <div
                    key={res.reservation_id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg w-16 h-16 shrink-0 border border-blue-100">
                          <span className="text-xs font-bold uppercase">{dateObj.day.split(' ')[1]}</span>
                          <span className="text-2xl font-bold">{dateObj.day.split(' ')[0]}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                            <span className="font-mono">#{res.reservation_id.substring(0, 8)}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{dateObj.full}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {dateObj.time}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              Amici Food Court
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 pl-20 sm:pl-0">
                        {getStatusBadge(res.status)}

                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Total Estimasi</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatRupiah(res.bill)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Belum ada reservasi</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mt-2 mb-6">
                  Anda belum pernah melakukan reservasi meja. Silakan pilih restoran dan pesan tempat sekarang.
                </p>
                <Link
                  href="/restaurants"
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cari Restoran
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}