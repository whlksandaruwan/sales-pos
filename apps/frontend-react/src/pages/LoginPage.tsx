import { FormEvent, useState } from 'react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@bookshop.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate('/pos');
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Login failed. Check credentials.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md space-y-4 sm:space-y-6 my-auto"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl mx-auto">
            📚
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500">Sign in to Bookshop POS</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border-2 border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold mb-2 text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-base font-semibold mb-2 text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-lg text-lg font-semibold disabled:opacity-60 transition-colors shadow-lg"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="bg-slate-50 rounded-lg p-4 space-y-3">
          <p className="text-sm text-slate-700 font-bold text-center mb-2">
            📋 Test Login Credentials
          </p>
          
          <div className="space-y-2 text-xs">
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700">👑 Admin</span>
                <span className="text-[10px] text-slate-500">(Full Access)</span>
              </div>
              <div className="text-slate-600">
                <div>📧 admin@bookshop.local</div>
                <div>🔑 admin123</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700">📊 Manager</span>
                <span className="text-[10px] text-slate-500">(Inventory + Reports)</span>
              </div>
              <div className="text-slate-600">
                <div>📧 manager@bookshop.local</div>
                <div>🔑 manager123</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-700">💰 Cashier</span>
                <span className="text-[10px] text-slate-500">(POS + Refunds)</span>
              </div>
              <div className="text-slate-600">
                <div>📧 cashier@bookshop.local</div>
                <div>🔑 cashier123</div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-2">
            Click on any credential to copy, or type manually
          </p>
        </div>
      </form>
    </div>
  );
}
