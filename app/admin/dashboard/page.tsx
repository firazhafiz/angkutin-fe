'use client';

import React, { useState } from 'react';
import {
  Package,
  TrendingUp,
  Recycle,
  Trash2,
  Users,
  Clock,
  Loader2,
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
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

// ──────────────────────────────────────────────────────────
// Admin Dashboard — Overview Analytics
// ──────────────────────────────────────────────────────────

const fmtRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return n.toString();
};

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
    <div className="rounded-xl border border-soft-gray bg-white px-4 py-3 shadow-lg">
      <p className="mb-1.5 text-xs font-semibold text-gray-500">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-bold text-dark">
            {entry.name.includes('Revenue') || entry.name.includes('Beban')
              ? fmtRupiah(entry.value)
              : `${entry.value} kg`}
          </span>
        </div>
      ))}
    </div>
  );
};

type ChartRange = '7d' | '30d';

export default function AdminDashboardPage() {
  const [chartRange, setChartRange] = useState<ChartRange>('7d');

  // ── Queries ──
  const { data: summaryRes, isLoading: summaryLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'summary'],
    queryFn: () => adminService.getAnalyticsSummary(),
  });

  const { data: couriersRes } = useQuery({
    queryKey: ['admin', 'couriers'],
    queryFn: () => adminService.getCouriers(),
  });

  const { data: chartsRes, isLoading: chartsLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'charts', chartRange],
    queryFn: () => adminService.getAnalyticsCharts(chartRange),
  });

  const analytics = summaryRes?.data;
  const rawCouriers = couriersRes?.data || [];
  
  // Flatten for accurate counting
  const courierList = rawCouriers.map((c: any) => ({
    ...c,
    name: c.name || c.user?.name || 'Kurir',
    isOnline: c.isOnline === true || c.user?.isOnline === true,
  }));

  const activeCouriersCount = courierList.filter(c => c.isOnline).length;
  
  const barChartData = chartsRes?.data?.barChart || [];
  const areaChartData = chartsRes?.data?.areaChart || [];

  const rangeLabel = chartRange === '7d' ? '7 Hari' : '30 Hari';

  return (
    <div className="space-y-4 md:space-y-6">
      {/* ───── Page Header ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-soft-gray">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-dark">Overview</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Ringkasan aktivitas Angkutin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={chartRange}
            onChange={(e) => setChartRange(e.target.value as ChartRange)}
            className="w-full sm:w-auto rounded-xl border border-soft-gray bg-very-light-gray px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all cursor-pointer hover:bg-white hover:border-gray-300"
          >
            <option value="7d">7 Hari Terakhir</option>
            <option value="30d">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* ───── Stats Grid ───── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <StatsCard
          label="Total Order"
          value={summaryLoading ? '...' : (analytics?.totalOrders ?? 0)}
          icon={Package}
          iconColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatsCard
          label="Revenue"
          value={summaryLoading ? '...' : fmtRupiah(analytics?.totalRevenue ?? 0)}
          icon={TrendingUp}
          iconColor="bg-gradient-to-br from-primary to-secondary"
        />
        <StatsCard
          label="Mutu (kg)"
          value={summaryLoading ? '...' : (analytics?.totalMutuKg ?? 0)}
          icon={Recycle}
          iconColor="bg-gradient-to-br from-secondary to-primary"
        />
        <StatsCard
          label="Residu (kg)"
          value={summaryLoading ? '...' : (analytics?.totalResiduKg ?? 0)}
          icon={Trash2}
          iconColor="bg-gradient-to-br from-amber-500 to-orange-500"
        />
        <StatsCard
          label="Kurir Aktif"
          value={summaryLoading ? '...' : activeCouriersCount}
          icon={Users}
          iconColor="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatsCard
          label="Pending WD"
          value={summaryLoading ? '...' : (analytics?.pendingWithdrawals ?? 0)}
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
            <span className="rounded-lg bg-primary-light px-2.5 py-1 text-[10px] font-semibold text-primary">
              {rangeLabel}
            </span>
          }
        >
          {chartsLoading ? (
            <div className="flex h-[280px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : barChartData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-xs text-gray-400 italic">Belum ada data chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barChartData} barGap={4}>
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
                  fill="#059669"
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
          )}
        </ChartCard>

        {/* Grafik Revenue vs Beban */}
        <ChartCard
          title="Revenue vs Beban"
          subtitle="Pendapatan dan pengeluaran harian"
          action={
            <span className="rounded-lg bg-primary-light px-2.5 py-1 text-[10px] font-semibold text-primary">
              {rangeLabel}
            </span>
          }
        >
          {chartsLoading ? (
            <div className="flex h-[280px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : areaChartData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center">
              <p className="text-xs text-gray-400 italic">Belum ada data chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={areaChartData}>
                <defs>
                  <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#016a70" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#016a70" stopOpacity={0} />
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
                  stroke="#016a70"
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
          )}
        </ChartCard>
      </div>
    </div>
  );
}
