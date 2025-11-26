import { useState } from 'react';
import { api } from '../lib/api';

type Provider = 'electricity' | 'water' | 'mobile';

export default function BillPaymentsPage() {
  const [provider, setProvider] = useState<Provider>('electricity');
  const [reference, setReference] = useState('');
  const [fetched, setFetched] = useState<{
    amount: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState<any | null>(null);

  async function handleFetch() {
    if (!reference) {
      alert('Please enter bill reference');
      return;
    }
    setLoading(true);
    setPaid(null);
    try {
      const res = await api.post('/bill-payments/fetch', {
        provider,
        reference,
      });
      setFetched({
        amount: Number(res.data.amount),
        status: res.data.status,
      });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to fetch bill');
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!fetched) return;
    setLoading(true);
    try {
      const res = await api.post(
        '/bill-payments/pay',
        {
          provider,
          reference,
          amount: fetched.amount,
        },
        {
          headers: {
            'idempotency-key': `${Date.now()}-${provider}-${reference}`,
          },
        },
      );
      setPaid(res.data);
      setFetched(null);
      setReference('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
            💳
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Bill Payments</h1>
        </div>
        <p className="text-slate-600 text-base">
          Pay electricity, water, and mobile bills quickly and securely
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-bold mb-3 text-slate-700">
              Service Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-4 text-base font-medium focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="electricity">⚡ Electricity</option>
              <option value="water">💧 Water</option>
              <option value="mobile">📱 Mobile</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-bold mb-3 text-slate-700">
              Bill / Account Number
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-4 text-base focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter reference number"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleFetch}
          disabled={loading || !reference}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {loading ? '⏳ Fetching...' : '🔍 Fetch Bill Details'}
        </button>

        {fetched && (
          <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-700">
                Bill Amount:
              </span>
              <span className="text-3xl font-bold text-blue-600">
                Rs.{fetched.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-700">
                Status:
              </span>
              <span className="text-lg font-bold text-orange-600">
                {fetched.status}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? '⏳ Processing...' : '✓ Pay Bill Now'}
            </button>
          </div>
        )}

        {paid && (
          <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-3xl">✅</div>
              <div className="text-xl font-bold text-emerald-700">
                Payment Successful!
              </div>
            </div>
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Provider:</span>
                <span className="font-bold">{paid.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Reference:</span>
                <span className="font-bold">{paid.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Amount:</span>
                <span className="font-bold text-emerald-600">
                  Rs.{Number(paid.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Status:</span>
                <span className="font-bold text-emerald-600">{paid.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-600">Date:</span>
                <span className="font-bold">
                  {new Date(paid.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
