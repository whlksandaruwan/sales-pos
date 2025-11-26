import type { ReactNode } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import BillingPage from './BillingPage';
import AdminProductsPage from './AdminProductsPage';
import ReportsPage from './ReportsPage';
import AdminDashboardPage from './AdminDashboardPage';
import BillPaymentsPage from './BillPaymentsPage';
import LoginPage from './LoginPage';
import AdminUsersPage from './AdminUsersPage';
import CustomersPage from './CustomersPage';
import RefundsPage from './RefundsPage';
import CompanyPage from './CompanyPage';
import { useAuthStore } from '../store/authStore';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects to POS if already logged in)
function PublicRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to="/pos" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const role = user?.role;
  const isAdmin = role === 'Admin';
  const isManager = role === 'Manager';
  const isCashier = role === 'Cashier';

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {isLoggedIn && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col py-4 shadow-xl">
          <div className="px-4 pb-6 border-b border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-xl font-bold">
              📚
            </div>
            <div>
              <div className="text-lg font-bold leading-tight">Bookshop POS</div>
              <div className="text-[11px] text-slate-300">
                {user?.role} Panel
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
            {/* POS: all roles */}
            <Link
              to="/pos"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
            >
              <span>🛒</span> <span>POS</span>
            </Link>

            {/* Dashboard / Products / Customers / Reports / Users: Admin & Manager */}
            {(isAdmin || isManager) && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                >
                  <span>📊</span> <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                >
                  <span>📦</span> <span>Products</span>
                </Link>
                <Link
                  to="/customers"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                >
                  <span>👥</span> <span>Customers</span>
                </Link>
                <Link
                  to="/admin/reports"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                >
                  <span>📈</span> <span>Reports</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                  >
                    <span>👤</span> <span>Users</span>
                  </Link>
                )}
              </>
            )}

            {/* Bill Payments & Refunds: Admin, Manager, Cashier */}
            {(isAdmin || isManager || isCashier) && (
              <>
                <Link
                  to="/bill-payments"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                >
                  <span>💳</span> <span>Bill Payments</span>
                </Link>
                <Link
                  to="/refunds"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
                >
                  <span>🧾</span> <span>Refunds</span>
                </Link>
              </>
            )}

            {/* Company info: all roles */}
            <Link
              to="/company"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
            >
              <span>🏢</span> <span>Company</span>
            </Link>
          </nav>

          <div className="px-4 pt-3 border-t border-slate-700 flex items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold truncate max-w-[140px]">
                {user?.fullName}
              </div>
              <div className="text-slate-300">{user?.role}</div>
            </div>
            <button
              type="button"
              onClick={clearAuth}
              className="bg-red-500 hover:bg-red-600 rounded-lg px-3 py-1 text-[11px] font-semibold"
            >
              Logout
            </button>
          </div>
        </aside>
      )}

      <main
        className={`flex-1 p-6 ${isLoggedIn ? 'max-w-full' : 'flex items-center justify-center'}`}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bill-payments"
            element={
              <ProtectedRoute>
                <BillPaymentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/refunds"
            element={
              <ProtectedRoute>
                <RefundsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company"
            element={
              <ProtectedRoute>
                <CompanyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}