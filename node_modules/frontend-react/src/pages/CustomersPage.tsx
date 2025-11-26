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

export default function CustomersPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get<Customer[]>('/customers');
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createCustomer.mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl">
          👥
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-600">Customer list and credit balances</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Add Customer
        </h2>
        <div className="grid grid-cols-3 gap-4">
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

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Customer List
        </h2>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Phone</th>
              <th className="py-2 px-3">Credit (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="py-2 px-3">{c.name}</td>
                <td className="py-2 px-3">{c.email || '—'}</td>
                <td className="py-2 px-3">{c.phone || '—'}</td>
                <td className="py-2 px-3">
                  Rs.{Number(c.credit ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}