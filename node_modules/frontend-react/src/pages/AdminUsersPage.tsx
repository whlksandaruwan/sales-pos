import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

type User = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Manager' | 'Cashier'>('Cashier');

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get<User[]>('/users');
      return res.data;
    },
  });

  const createUser = useMutation({
    mutationFn: async () => {
      await api.post('/users', { email, fullName, password, role });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setEmail('');
      setFullName('');
      setPassword('');
      setRole('Cashier');
      alert('User created');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to create user');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createUser.mutate();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-2xl">
          👤
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-600">Create and manage system users</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Create New User
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as 'Admin' | 'Manager' | 'Cashier')
              }
              className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={createUser.isPending}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg text-sm font-semibold"
        >
          {createUser.isPending ? 'Creating…' : 'Create User'}
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">All Users</h2>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="py-2 px-3">{u.fullName}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}