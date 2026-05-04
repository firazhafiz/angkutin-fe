'use client';

import React from 'react';
import {
  Package,
  TrendingUp,
  Recycle,
  Trash2,
  Users,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import StatsCard from '@/components/admin/StatsCard';
import ChartCard from '@/components/admin/ChartCard';
import DataTable, { type Column } from '@/components/admin/DataTable';
import {
  mockAnalytics,
  mockDailyChart,
  mockRevenueChart,
  mockDailyMetrics,
  type DailyOrderMetric,
} from '@/services/mock/admin.mock';

// ──────────────────────────────────────────────────────────
// Admin Dashboard — Overview Analytics
// Item 31 dari PRD
// ──────────────────────────────────────────────────────────

// Formatter Rupiah
const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

// Formatter angka ringkas
const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return n.toString();
};

// Custom tooltip
const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-gray-500">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-bold text-gray-900">
            {entry.name.includes('revenue') || entry.name.includes('Revenue') || entry.name.includes('Beban')
              ? fmtRupiah(entry.value)
              : `${entry.value} kg`}
          </span>
        </div>
      ))}
    </div>
  );
};

// Columns untuk tabel metrik harian
const dailyColumns: Column<DailyOrderMetric>[] = [
  {
    key: 'date',
    header: 'Tanggal',
    render: (item) => (
      <span className="font-medium text-gray-900">
        {new Date(item.date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'totalOrders',
    header: 'Total Order',
    align: 'center',
    render: (item) => (
      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-gray-100 px-2 text-xs font-bold text-gray-700">
        {item.totalOrders}
      </span>
    ),
  },
  {
    key: 'completed',
    header: 'Selesai',
    align: 'center',
    render: (item) => (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
        {item.completed}
      </span>
    ),
  },
  {
    key: 'awaitingPayment',
    header: 'Menunggu Bayar',
    align: 'center',
    render: (item) => (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
        {item.awaitingPayment}
      </span>
    ),
  },
  {
    key: 'cancelled',
    header: 'Batal',
    align: 'center',
    render: (item) => (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500">
        {item.cancelled}
      </span>
    ),
  },
  {
    key: 'avgWeightKg',
    header: 'Rata² Berat',
    align: 'right',
    render: (item) => <span>{item.avgWeightKg} kg</span>,
  },
  {
    key: 'revenue',
    header: 'Revenue',
    align: 'right',
    render: (item) => (
      <span className="font-semibold text-gray-900">{fmtRupiah(item.revenue)}</span>
    ),
  },
];

export default function AdminDashboardPage() {
  const analytics = mockAnalytics;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ───── Page Header ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Overview</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Ringkasan aktivitas Angkutin — data per 7 hari terakhir
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="w-full sm:w-auto rounded-xl border border-gray-200 bg-gray-50 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 shadow-sm transition-all cursor-pointer hover:bg-white hover:border-gray-300">
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>Bulan Ini</option>
          </select>
        </div>
      </div>

      {/* ───── Stats Grid ───── */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          label="Total Order"
          value={analytics.totalOrders}
          icon={Package}
          trend={{ value: 12.5, direction: 'up' }}
          iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          label="Revenue"
          value={fmtRupiah(analytics.totalRevenue)}
          icon={TrendingUp}
          trend={{ value: 8.3, direction: 'up' }}
          iconColor="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatsCard
          label="Mutu (kg)"
          value={analytics.totalMutuKg}
          icon={Recycle}
          trend={{ value: 5.1, direction: 'up' }}
          iconColor="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatsCard
          label="Residu (kg)"
          value={analytics.totalResiduKg}
          icon={Trash2}
          trend={{ value: 3.2, direction: 'down' }}
          iconColor="bg-gradient-to-br from-amber-500 to-orange-500"
        />
        <StatsCard
          label="Kurir Aktif"
          value={analytics.activeCouriers}
          icon={Users}
          iconColor="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatsCard
          label="Pending WD"
          value={analytics.pendingWithdrawals}
          subtitle="Menunggu approval"
          icon={Clock}
          iconColor="bg-gradient-to-br from-rose-500 to-pink-600"
        />
      </div>

      {/* ───── Charts Row ───── */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* Grafik Mutu vs Residu */}
        <ChartCard
          title="Mutu vs Residu"
          subtitle="Perbandingan berat (kg) per hari"
          action={
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
              Mingguan
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockDailyChart} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Bar
                dataKey="mutu"
                name="Mutu"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="residu"
                name="Residu"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Grafik Revenue vs Beban */}
        <ChartCard
          title="Revenue vs Beban"
          subtitle="Pendapatan dan pengeluaran harian"
          action={
            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
              Mingguan
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockRevenueChart}>
              <defs>
                <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientBeban" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={fmtShort}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradientRevenue)"
              />
              <Area
                type="monotone"
                dataKey="beban"
                name="Beban"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#gradientBeban)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ───── Tabel Metrik Order Harian ───── */}
      <ChartCard
        title="Metrik Order Harian"
        subtitle="Detail performa order per hari"
        action={
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
            Export CSV
          </button>
        }
      >
        <DataTable
          columns={dailyColumns}
          data={mockDailyMetrics}
          keyExtractor={(item) => item.id}
        />
      </ChartCard>
    </div>
  );
}

/**
 * 👉 Practice Zone — Things to Do (Dashboard):
 * 
 * 1. Filter Tanggal Interaktif:
 *    - Buat state `const [filter, setFilter] = useState('7hari')`
 *    - Hubungkan dengan `<select>` via `value` dan `onChange`.
 *    - Gunakan state ini untuk men-trigger fetch ulang (re-fetch) data dari `services` atau merender data mock yang berbeda.
 * 
 * 2. Skeleton Loading:
 *    - Buat kondisi `const [isLoading, setIsLoading] = useState(true)` dan tiru fetch data menggunakan `useEffect` + `setTimeout`.
 *    - Saat `isLoading` bernilai `true`, render komponen Skeleton (kotak abu-abu beranimasi `animate-pulse`) sebagai ganti `<StatsCard>` dan `<ChartCard>`.
 * 
 * 3. Navigasi Baris Tabel:
 *    - Gunakan fitur klik baris (row click) jika tersedia di `<DataTable>`.
 *    - Saat baris di-klik, arahkan user ke detail order/aktivitas pada tanggal tersebut menggunakan `router.push('/admin/orders?date=...')`.
 */
