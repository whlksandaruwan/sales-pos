import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

type Customer = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  credit: string | number;
};

type CustomerSaleItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
};

type CustomerPayment = {
  id: number;
  method: string;
  amount: number;
};

type CustomerSale = {
  id: number;
  createdAt: string;
  total: number;
  discount: number;
  items: CustomerSaleItem[];
  payments: CustomerPayment[];
};

export default function CustomersPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const [settleAmount, setSettleAmount] = useState('');

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get<Customer[]>('/customers');
      return res.data;
    },
  });

  const selectedCustomer =
    customers?.find((c) => c.id === selectedCustomerId) ?? null;

  const { data: salesHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['customer-sales', selectedCustomerId],
    enabled: !!selectedCustomerId,
    queryFn: async () => {
      const res = await api.get<CustomerSale[]>(
        `/customers/${selectedCustomerId}/sales`,
      );
      return res.data;
    },
  });

  const createCustomer = useMutation({
    mutationFn: async () => {
      await api.post('/customers', { name, email, phone });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      setName('');
      setEmail('');
      setPhone('');
      alert('Customer created');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to create customer');
    },
  });

  const settleCredit = useMutation({
    mutationFn: async () => {
      if (!selectedCustomerId) return;
      const amountNum = Number(settleAmount) || 0;
      await api.post(`/customers/${selectedCustomerId}/settle-credit`, null, {
        params: { amount: amountNum },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customers'] });
      if (selectedCustomerId) {
        qc.invalidateQueries({
          queryKey: ['customer-sales', selectedCustomerId],
        });
      }
      setSettleAmount('');
      alert('Customer credit updated');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to update credit');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createCustomer.mutate();
  }

  return (
    <div className="space-y-4 sm:space-y-6 h-full overflow-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl">
          👥
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-600">
            Customer list, credit balances, and purchase history
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Add Customer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={createCustomer.isPending}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-semibold"
        >
          {createCustomer.isPending ? 'Saving…' : 'Save Customer'}
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Customer List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">Credit (Rs.)</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers?.map((c) => (
                <tr
                  key={c.id}
                  className={`border-t border-slate-100 ${
                    selectedCustomerId === c.id ? 'bg-emerald-50' : ''
                  }`}
                >
                  <td className="py-2 px-3">{c.name}</td>
                  <td className="py-2 px-3">{c.email || '—'}</td>
                  <td className="py-2 px-3">{c.phone || '—'}</td>
                  <td className="py-2 px-3">
                    Rs.{Number(c.credit ?? 0).toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCustomerId(
                          selectedCustomerId === c.id ? null : c.id,
                        )
                      }
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200"
                    >
                      {selectedCustomerId === c.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Customer Details
            </h2>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Name: </span>
                <span>{selectedCustomer.name}</span>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <span>{selectedCustomer.email || '—'}</span>
              </div>
              <div>
                <span className="font-semibold">Phone: </span>
                <span>{selectedCustomer.phone || '—'}</span>
              </div>
              <div>
                <span className="font-semibold">Current Credit: </span>
                <span className="font-bold text-emerald-600">
                  Rs.{Number(selectedCustomer.credit ?? 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Settle / Reduce Credit
              </h3>
              <p className="text-xs text-slate-500">
                Enter the amount the customer is paying now. This will{' '}
                <span className="font-semibold">reduce</span> their credit
                balance.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  min={0}
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="flex-1 border-2 border-slate-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Amount (Rs.)"
                />
                <button
                  type="button"
                  disabled={settleCredit.isPending || !settleAmount}
                  onClick={() => settleCredit.mutate()}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold disabled:opacity-60 whitespace-nowrap"
                >
                  {settleCredit.isPending ? 'Updating…' : 'Apply Payment'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:col-span-2 overflow-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Purchase History
            </h2>
            {historyLoading ? (
              <p className="text-sm text-slate-500">Loading history…</p>
            ) : !salesHistory || salesHistory.length === 0 ? (
              <p className="text-sm text-slate-500">
                No sales found for this customer.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="py-2 px-3">Invoice #</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Total (Rs.)</th>
                      <th className="py-2 px-3 hidden md:table-cell">Items</th>
                      <th className="py-2 px-3 hidden lg:table-cell">
                        Payments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesHistory.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="py-2 px-3">#{sale.id}</td>
                        <td className="py-2 px-3">
                          {new Date(sale.createdAt).toLocaleString()}
                        </td>
                        <td className="py-2 px-3 font-semibold text-emerald-600">
                          Rs.{Number(sale.total ?? 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 hidden md:table-cell">
                          <ul className="space-y-1">
                            {sale.items.map((it) => (
                              <li key={it.id}>
                                <span className="font-mono">
                                  #{it.productId}
                                </span>{' '}
                                × {Math.abs(it.quantity)} @ Rs.
                                {Number(it.price).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-2 px-3 hidden lg:table-cell">
                          <ul className="space-y-1">
                            {sale.payments.map((p) => (
                              <li key={p.id}>
                                {p.method}: Rs.
                                {Number(p.amount).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}