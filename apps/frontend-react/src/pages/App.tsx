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
import CategoriesPage from './CategoriesPage';
import RefsPage from './RefsPage';
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

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {user && (
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-xl font-bold">
                📚
              </div>
              <span className="text-xl font-bold">Bookshop POS</span>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-2 flex-wrap">
                {/* POS: all roles */}
                <Link
                  to="/pos"
                  className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  🛒 POS
                </Link>

                {/* Dashboard / Products / Customers / Reports / Users: Admin & Manager */}
                {(isAdmin || isManager) && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      📊 Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      📦 Products
                    </Link>
                    <Link
                      to="/admin/categories"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      🏷️ Categories
                    </Link>
                    <Link
                      to="/customers"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      👥 Customers
                    </Link>
                    <Link
                      to="/refs"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      🚚 Refs
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      📈 Reports
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/users"
                        className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                      >
                        👤 Users
                      </Link>
                    )}
                  </>
                )}

                {/* Bill Payments & Refunds: Admin, Manager, Cashier */}
                {(isAdmin || isManager || isCashier) && (
                  <>
                    <Link
                      to="/bill-payments"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      💳 Bill Payments
                    </Link>
                    <Link
                      to="/refunds"
                      className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    >
                      🧾 Refunds
                    </Link>
                  </>
                )}

                {/* Company info: all roles */}
                <Link
                  to="/company"
                  className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  🏢 Company
                </Link>
              </nav>
              <div className="flex items-center gap-3 border-l border-slate-600 pl-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold">{user.fullName}</div>
                  <div className="text-xs text-slate-300">{user.role}</div>
                </div>
                <button
                  type="button"
                  onClick={clearAuth}
                  className="bg-red-500 hover:bg-red-600 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1 overflow-auto p-4 sm:p-6">
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
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
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
            path="/refs"
            element={
              <ProtectedRoute>
                <RefsPage />
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