import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

type SaleItem = {
  id: number;
  productId: number;
  quantity: number;
};

type Sale = {
  id: number;
  items: SaleItem[];
};

export default function RefundsPage() {
  const [saleId, setSaleId] = useState('');
  const [sale, setSale] = useState<Sale | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  async function fetchSale(e: FormEvent) {
    e.preventDefault();
    if (!saleId) return;
    setLoading(true);
    try {
      const res = await api.get<Sale>(`/sales/${saleId}`);
      setSale(res.data);
      const initial: Record<number, number> = {};
      res.data.items.forEach((i) => {
        initial[i.productId] = i.quantity;
      });
      setQuantities(initial);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Sale not found');
      setSale(null);
      setQuantities({});
    } finally {
      setLoading(false);
    }
  }

  function changeQty(productId: number, value: string) {
    const num = Number(value) || 0;
    setQuantities((prev) => ({ ...prev, [productId]: num }));
  }

  async function submitRefund() {
    if (!sale) return;
    const items = sale.items
      .map((i) => ({
        productId: i.productId,
        quantity: quantities[i.productId] || 0,
      }))
      .filter((i) => i.quantity > 0);

    if (items.length === 0) {
      alert('Set at least one quantity to refund');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/sales/${sale.id}/refund`, { items });
      alert('Refund processed');
      setSale(null);
      setQuantities({});
      setSaleId('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Refund failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-2xl">
          🧾
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Refunds</h1>
          <p className="text-slate-600">
            Search sale, select items, and process refunds
          </p>
        </div>
      </div>

      <form
        onSubmit={fetchSale}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <label className="block text-sm font-semibold mb-1">
          Invoice / Sale ID
        </label>
        <div className="flex gap-3">
          <input
            value={saleId}
            onChange={(e) => setSaleId(e.target.value)}
            className="flex-1 border-2 border-slate-300 rounded-lg px-3 py-2"
            placeholder="Enter sale ID"
          />
          <button
            type="submit"
            disabled={loading || !saleId}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Find Sale'}
          </button>
        </div>
      </form>

      {sale && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Items in Sale #{sale.id}
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="py-2 px-3">Product ID</th>
                <th className="py-2 px-3">Sold Qty</th>
                <th className="py-2 px-3">Refund Qty</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((i) => (
                <tr key={i.id} className="border-t border-slate-100">
                  <td className="py-2 px-3">#{i.productId}</td>
                  <td className="py-2 px-3">{i.quantity}</td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={0}
                      max={i.quantity}
                      value={quantities[i.productId] ?? 0}
                      onChange={(e) => changeQty(i.productId, e.target.value)}
                      className="w-24 border-2 border-slate-300 rounded-lg px-2 py-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={submitRefund}
            disabled={loading}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {loading ? 'Processing…' : 'Process Refund'}
          </button>
        </div>
      )}
    </div>
  );
}