import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function ReportsPage() {
  const { data: pnl } = useQuery({
    queryKey: ['reports-pnl'],
    queryFn: async () => {
      const res = await api.get('/reports/pnl');
      return res.data;
    },
  });

  const { data: categorySales } = useQuery({
    queryKey: ['reports-category'],
    queryFn: async () => {
      const res = await api.get('/reports/category-sales');
      return res.data;
    },
  });

  const { data: stockVal } = useQuery({
    queryKey: ['reports-stock-val'],
    queryFn: async () => {
      const res = await api.get('/reports/stock-valuation');
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl">
          📈
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-600">Financial and inventory insights</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Profit & Loss */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">💰</div>
            <h2 className="text-xl font-bold text-slate-800">
              Profit &amp; Loss
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Revenue
              </span>
              <span className="text-xl font-bold text-blue-600">
                Rs.{pnl?.revenue?.toFixed?.(2) ?? '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Cost
              </span>
              <span className="text-xl font-bold text-red-600">
                Rs.{pnl?.cost?.toFixed?.(2) ?? '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Profit
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                Rs.{pnl?.profit?.toFixed?.(2) ?? '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Stock Valuation */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">📦</div>
            <h2 className="text-xl font-bold text-slate-800">
              Stock Valuation
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Total Cost Value
              </span>
              <span className="text-xl font-bold text-purple-600">
                Rs.{stockVal?.totalCost?.toFixed?.(2) ?? '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Total Retail Value
              </span>
              <span className="text-xl font-bold text-emerald-600">
                Rs.{stockVal?.totalRetail?.toFixed?.(2) ?? '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Potential Profit
              </span>
              <span className="text-2xl font-bold text-blue-600">
                Rs.{(
                  (stockVal?.totalRetail ?? 0) - (stockVal?.totalCost ?? 0)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Sales */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl">📊</div>
          <h2 className="text-xl font-bold text-slate-800">
            Category-wise Sales
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categorySales && categorySales.length > 0 ? (
            categorySales.map((cat: any) => (
              <div
                key={cat.category}
                className="border-2 border-slate-200 rounded-xl p-4 hover:border-emerald-500 transition-colors"
              >
                <div className="text-sm font-semibold text-slate-600 mb-1">
                  {cat.category}
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  Rs.{Number(cat.total).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-slate-400 py-8">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-base">No sales data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
