import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { api } from '../lib/api';

type Period = 'daily' | 'weekly' | 'monthly' | 'custom';

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('daily');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const isCustom = period === 'custom';

  const commonParams = useMemo(() => {
    if (isCustom) {
      return {
        from: fromDate || undefined,
        to: toDate || undefined,
      };
    }
    return { period };
  }, [isCustom, period, fromDate, toDate]);

  const { data: sales } = useQuery({
    queryKey: ['reports-sales', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/sales', { params: commonParams });
      return res.data as any[];
    },
  });

  const { data: pnl } = useQuery({
    queryKey: ['reports-pnl', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/pnl', { params: commonParams });
      return res.data;
    },
  });

  const { data: categorySales } = useQuery({
    queryKey: ['reports-category', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/category-sales', {
        params: commonParams,
      });
      return res.data;
    },
  });

  const { data: employeeSales } = useQuery({
    queryKey: ['reports-employee', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/employee-sales', {
        params: commonParams,
      });
      return res.data as { user: string; total: number }[];
    },
  });

  const { data: supplierSales } = useQuery({
    queryKey: ['reports-supplier', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/supplier-sales', {
        params: commonParams,
      });
      return res.data as { supplier: string; total: number }[];
    },
  });

  const { data: stockVal } = useQuery({
    queryKey: ['reports-stock-val'],
    queryFn: async () => {
      const res = await api.get('/reports/stock-valuation');
      return res.data;
    },
  });

  const { data: cashFlow } = useQuery({
    queryKey: ['reports-cash-flow', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/cash-flow', {
        params: commonParams,
      });
      return res.data as {
        byMethod: Record<string, number>;
        billsOut: number;
        netCash: number;
      };
    },
  });

  const { data: taxReport } = useQuery({
    queryKey: ['reports-tax', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/tax', {
        params: { ...commonParams },
      });
      return res.data as {
        total: number;
        taxRate: number;
        tax: number;
        net: number;
      };
    },
  });

  const { data: shifts } = useQuery({
    queryKey: ['reports-shifts', commonParams],
    queryFn: async () => {
      const res = await api.get('/reports/cashier-shifts', {
        params: commonParams,
      });
      return res.data as any[];
    },
  });

  const totalSalesAmount =
    sales?.reduce((sum, s) => sum + Number(s.total ?? 0), 0) ?? 0;
  const totalBills = sales?.length ?? 0;

  function exportToCsv(filename: string, rows: Record<string, any>[]) {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const v = row[h];
            if (v == null) return '';
            const val = String(v).replace(/"/g, '""');
            return `"${val}"`;
          })
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4 sm:space-y-6 h-full overflow-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl">
          📈
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-600">
            Sales, profit, tax, and cash flow analytics
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-800">
              Date Range
            </h2>
            <div className="flex flex-wrap gap-2">
              {(['daily', 'weekly', 'monthly', 'custom'] as Period[]).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                      period === p
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p === 'daily'
                      ? 'Daily'
                      : p === 'weekly'
                      ? 'Weekly'
                      : p === 'monthly'
                      ? 'Monthly'
                      : 'Custom'}
                  </button>
                ),
              )}
            </div>
          </div>

          {isCustom && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-2 border-slate-300 rounded-lg px-3 py-2 text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-2 border-slate-300 rounded-lg px-3 py-2 text-sm w-full"
                />
              </div>
            </div>
          )}

        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (!sales) return;
              const rows = sales.map((s) => ({
                id: s.id,
                date: s.createdAt,
                total: s.total,
                discount: s.discount,
              }));
              exportToCsv('sales-report.csv', rows);
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900"
          >
            ⬇ Export Sales (CSV/Excel)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm font-semibold hover:bg-slate-200"
          >
            🖨 Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">🧾</div>
            <h2 className="text-xl font-bold text-slate-800">
              Sales Summary
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Total Sales Amount
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                Rs.{totalSalesAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-base font-semibold text-slate-700">
                Number of Bills
              </span>
              <span className="text-xl font-bold text-slate-800">
                {totalBills}
              </span>
            </div>
          </div>
        </div>

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Sales */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">📊</div>
            <h2 className="text-xl font-bold text-slate-800">
              Category-wise Sales
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="col-span-2 text-center text-slate-400 py-8">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-base">No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee Sales & Commission */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">👔</div>
            <h2 className="text-xl font-bold text-slate-800">
              Employee Sales &amp; Commission
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="py-2 px-3">Employee</th>
                  <th className="py-2 px-3">Sales (Rs.)</th>
                  <th className="py-2 px-3">Commission (2%)</th>
                </tr>
              </thead>
              <tbody>
                {employeeSales && employeeSales.length > 0 ? (
                  employeeSales.map((e) => (
                    <tr key={e.user} className="border-t border-slate-100">
                      <td className="py-2 px-3">{e.user}</td>
                      <td className="py-2 px-3">
                        Rs.{Number(e.total).toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        Rs.{(Number(e.total) * 0.02).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-3 px-3 text-center text-slate-400"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Supplier / Purchase Report (by supplier sales) */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">🏭</div>
            <h2 className="text-xl font-bold text-slate-800">
              Supplier Sales Report
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="py-2 px-3">Supplier</th>
                  <th className="py-2 px-3">Sales (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {supplierSales && supplierSales.length > 0 ? (
                  supplierSales.map((s) => (
                    <tr key={s.supplier} className="border-t border-slate-100">
                      <td className="py-2 px-3">{s.supplier}</td>
                      <td className="py-2 px-3">
                        Rs.{Number(s.total).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-3 px-3 text-center text-slate-400"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cash Flow & Tax */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💵</div>
            <h2 className="text-xl font-bold text-slate-800">
              Cash Flow &amp; Tax
            </h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Cash Flow by Payment Method
            </h3>
            <div className="space-y-1">
              {cashFlow && Object.keys(cashFlow.byMethod).length > 0 ? (
                Object.entries(cashFlow.byMethod).map(([method, amount]) => (
                  <div
                    key={method}
                    className="flex justify-between text-xs sm:text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {method}
                    </span>
                    <span className="font-semibold text-slate-900">
                      Rs.{Number(amount).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No payment data.</p>
              )}
            </div>
            <div className="flex justify-between text-xs sm:text-sm mt-2">
              <span className="font-medium text-slate-700">
                Bills Paid (Utilities, etc.)
              </span>
              <span className="font-semibold text-red-600">
                Rs.{Number(cashFlow?.billsOut ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium text-slate-700">Net Cash</span>
              <span
                className={`font-bold ${
                  (cashFlow?.netCash ?? 0) >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                Rs.{Number(cashFlow?.netCash ?? 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Tax / VAT / GST Summary
            </h3>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium text-slate-700">
                Taxable Sales Total
              </span>
              <span className="font-semibold text-slate-900">
                Rs.{Number(taxReport?.total ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium text-slate-700">
                Tax ({taxReport?.taxRate ?? 0}%)
              </span>
              <span className="font-semibold text-red-600">
                Rs.{Number(taxReport?.tax ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium text-slate-700">
                Net After Tax
              </span>
              <span className="font-bold text-emerald-600">
                Rs.{Number(taxReport?.net ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock valuation + Cashier shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

        {/* Cashier Shifts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">⏱</div>
            <h2 className="text-xl font-bold text-slate-800">
              Cashier Shift Reports
            </h2>
          </div>
          <div className="overflow-x-auto max-h-64 sm:max-h-80">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="py-2 px-3">Cashier</th>
                  <th className="py-2 px-3">Store</th>
                  <th className="py-2 px-3">Opened</th>
                  <th className="py-2 px-3 hidden md:table-cell">Closed</th>
                  <th className="py-2 px-3 hidden md:table-cell">
                    Opening Float
                  </th>
                  <th className="py-2 px-3 hidden md:table-cell">
                    Closing Cash
                  </th>
                </tr>
              </thead>
              <tbody>
                {shifts && shifts.length > 0 ? (
                  shifts.map((shift) => (
                    <tr
                      key={shift.id}
                      className="border-t border-slate-100 align-top"
                    >
                      <td className="py-2 px-3">
                        {shift.user?.fullName ?? '—'}
                      </td>
                      <td className="py-2 px-3">
                        {shift.store?.name ?? '—'}
                      </td>
                      <td className="py-2 px-3">
                        {new Date(shift.openedAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 hidden md:table-cell">
                        {shift.closedAt
                          ? new Date(shift.closedAt).toLocaleString()
                          : 'Open'}
                      </td>
                      <td className="py-2 px-3 hidden md:table-cell">
                        Rs.{Number(shift.openingFloat ?? 0).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 hidden md:table-cell">
                        Rs.{Number(shift.closingCash ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-3 px-3 text-center text-slate-400"
                    >
                      No shift data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
