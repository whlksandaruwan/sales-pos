import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

type Ref = {
  id: number;
  name: string;
  email?: string | null;
  companyName: string;
  phone?: string | null;
  createdAt: string;
};

type RefDelivery = {
  id: number;
  refId: number;
  companyName: string;
  billNumber?: string | null;
  billDate?: string | null;
  billImageUrl?: string | null;
  notes?: string | null;
  createdAt: string;
};

export default function RefsPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRefId, setSelectedRefId] = useState<number | null>(null);

  const [deliveryCompanyName, setDeliveryCompanyName] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState('');
  const [billImageUrl, setBillImageUrl] = useState('');
  const [notes, setNotes] = useState('');

  const { data: refs } = useQuery({
    queryKey: ['refs'],
    queryFn: async () => {
      const res = await api.get<Ref[]>('/refs');
      return res.data;
    },
  });

  const { data: deliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: ['ref-deliveries', selectedRefId],
    enabled: !!selectedRefId,
    queryFn: async () => {
      const res = await api.get<RefDelivery[]>(`/refs/${selectedRefId}/deliveries`);
      return res.data;
    },
  });

  const createRef = useMutation({
    mutationFn: async () => {
      await api.post('/refs', {
        name,
        email: email || undefined,
        companyName,
        phone: phone || undefined,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['refs'] });
      setName('');
      setEmail('');
      setCompanyName('');
      setPhone('');
      alert('Ref registered');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to register ref');
    },
  });

  const addDelivery = useMutation({
    mutationFn: async () => {
      if (!selectedRefId) return;
      await api.post(`/refs/${selectedRefId}/deliveries`, {
        companyName: deliveryCompanyName || (refs?.find(r => r.id === selectedRefId)?.companyName ?? ''),
        billNumber: billNumber || undefined,
        billDate: billDate || undefined,
        billImageUrl: billImageUrl || undefined,
        notes: notes || undefined,
      });
    },
    onSuccess: () => {
      if (selectedRefId) {
        qc.invalidateQueries({ queryKey: ['ref-deliveries', selectedRefId] });
      }
      setDeliveryCompanyName('');
      setBillNumber('');
      setBillDate('');
      setBillImageUrl('');
      setNotes('');
      alert('Delivery saved');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to save delivery');
    },
  });

  function handleCreateRef(e: FormEvent) {
    e.preventDefault();
    createRef.mutate();
  }

  const selectedRef = refs?.find((r) => r.id === selectedRefId) || null;

  return (
    <div className="space-y-4 sm:space-y-6 h-full overflow-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-2xl">
          🚚
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Refs</h1>
          <p className="text-slate-600">
            Register delivery refs and record their product bills
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Register new ref */}
        <form
          onSubmit={handleCreateRef}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-800">
            Register New Ref
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Company Name
              </label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={createRef.isPending}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {createRef.isPending ? 'Registering…' : 'Register Ref'}
          </button>
        </form>

        {/* Ref list */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-3 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">
            Registered Refs
          </h2>
          <p className="text-xs text-slate-500 mb-2">
            Click a ref to add or view their delivery bills.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Company</th>
                  <th className="py-2 px-3 hidden md:table-cell">Email</th>
                  <th className="py-2 px-3 hidden md:table-cell">Phone</th>
                  <th className="py-2 px-3 text-right">Select</th>
                </tr>
              </thead>
              <tbody>
                {refs?.map((r) => (
                  <tr
                    key={r.id}
                    className={`border-t border-slate-100 ${
                      selectedRefId === r.id ? 'bg-sky-50' : ''
                    }`}
                  >
                    <td className="py-2 px-3">{r.name}</td>
                    <td className="py-2 px-3">{r.companyName}</td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      {r.email || '—'}
                    </td>
                    <td className="py-2 px-3 hidden md:table-cell">
                      {r.phone || '—'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRefId(selectedRefId === r.id ? null : r.id)
                        }
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
                      >
                        {selectedRefId === r.id ? 'Close' : 'Select'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delivery form + list for selected ref */}
      {selectedRef && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Deliveries for {selectedRef.name}
              </h2>
              <p className="text-xs text-slate-500">
                Company: {selectedRef.companyName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Add Delivery Bill
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    value={deliveryCompanyName}
                    onChange={(e) => setDeliveryCompanyName(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs"
                    placeholder={selectedRef.companyName}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Bill Number
                    </label>
                    <input
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Bill Date
                    </label>
                    <input
                      type="date"
                      value={billDate}
                      onChange={(e) => setBillDate(e.target.value)}
                      className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Bill Photo (URL or file reference)
                  </label>
                  <input
                    value={billImageUrl}
                    onChange={(e) => setBillImageUrl(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs"
                    placeholder="e.g. scanned image path or URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Notes (products, quantities, etc.)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2 text-xs"
                    rows={3}
                    placeholder="Short description of products delivered"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={addDelivery.isPending}
                onClick={() => addDelivery.mutate()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                {addDelivery.isPending ? 'Saving…' : 'Save Delivery'}
              </button>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Delivery History
              </h3>
              {deliveriesLoading ? (
                <p className="text-xs text-slate-500">Loading deliveries…</p>
              ) : !deliveries || deliveries.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No deliveries recorded for this ref yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50">
                      <tr className="text-left">
                        <th className="py-1.5 px-2">Date</th>
                        <th className="py-1.5 px-2">Company</th>
                        <th className="py-1.5 px-2">Bill #</th>
                        <th className="py-1.5 px-2 hidden md:table-cell">
                          Bill Photo
                        </th>
                        <th className="py-1.5 px-2 hidden md:table-cell">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries?.map((d) => (
                        <tr
                          key={d.id}
                          className="border-t border-slate-100 align-top"
                        >
                          <td className="py-1.5 px-2">
                            {d.billDate
                              ? new Date(d.billDate).toLocaleDateString()
                              : new Date(d.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-1.5 px-2">{d.companyName}</td>
                          <td className="py-1.5 px-2">{d.billNumber || '—'}</td>
                          <td className="py-1.5 px-2 hidden md:table-cell">
                            {d.billImageUrl ? (
                              <span className="text-sky-600 break-all">
                                {d.billImageUrl}
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="py-1.5 px-2 hidden md:table-cell max-w-xs">
                            <span className="break-words">
                              {d.notes || '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

