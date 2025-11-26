import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { api } from '../lib/api';

type Sale = {
  id: number;
  createdAt: string;
  total: string | number;
};

function useDashboardData() {
  const lowStock = useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: async () => {
      const res = await api.get('/dashboard/low-stock');
      return res.data as any[];
    },
  });

  const pnl = useQuery({
    queryKey: ['reports', 'pnl'],
    queryFn: async () => {
      const res = await api.get('/reports/pnl');
      return res.data as { revenue: number; cost: number; profit: number };
    },
  });

  const salesDaily = useQuery({
    queryKey: ['reports', 'sales', 'daily'],
    queryFn: async () => {
      const res = await api.get('/reports/sales?period=daily');
      return res.data as Sale[];
    },
  });

  return { lowStock, pnl, salesDaily };
}

export default function AdminDashboardPage() {
  const { lowStock, pnl, salesDaily } = useDashboardData();

  const dailyChartData =
    salesDaily.data?.map((s) => ({
      time: new Date(s.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      total: Number(s.total),
    })) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
          📊
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Overview of your bookshop performance</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium opacity-90">Today Revenue</div>
            <div className="text-3xl">💰</div>
          </div>
          <div className="text-4xl font-bold">
            Rs.{pnl.data ? pnl.data.revenue.toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium opacity-90">Today Profit</div>
            <div className="text-3xl">📈</div>
          </div>
          <div className="text-4xl font-bold">
            Rs.{pnl.data ? pnl.data.profit.toFixed(2) : '0.00'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium opacity-90">Low Stock Items</div>
            <div className="text-3xl">⚠️</div>
          </div>
          <div className="text-4xl font-bold">
            {lowStock.data ? lowStock.data.length : '0'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              📊 Today's Sales Trend
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                />
                <YAxis style={{ fontSize: '12px', fontWeight: 500 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            ⚠️ Low Stock Alert
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {lowStock.data && lowStock.data.length > 0 ? (
              lowStock.data.slice(0, 10).map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center border-b border-slate-100 pb-2"
                >
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {p.name}
                  </span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                    {p.stock?.[0]?.quantity ?? 0} left
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm">All stock levels are good</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
