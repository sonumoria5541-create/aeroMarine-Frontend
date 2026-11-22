import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoBanner } from '../common/DemoBanner';
import {
  Anchor,
  ShieldCheck,
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Box,
  ShoppingCart,
  TrendingUp,
  Settings,
  FileText,
  ExternalLink,
  LogOut,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isSuperAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Deposit Requests', href: '/admin/deposits', icon: ArrowDownLeft },
    { name: 'Withdrawal Payouts', href: '/admin/withdrawals', icon: ArrowUpRight },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Container Fleet Plans', href: '/admin/containers', icon: Box },
    { name: 'Fleet Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Daily Earnings Engine', href: '/admin/earnings', icon: TrendingUp },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security Audit Logs', href: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <DemoBanner />

      {/* Admin Top Header */}
      <header className="bg-ocean-950 border-b border-ocean-800 text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-container-orange flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg text-white font-display tracking-tight">
                  AERO<span className="text-teal-brand">MARINE</span>
                </span>
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest bg-container-orange/20 text-container-orange px-2 py-0.5 rounded border border-container-orange/30">
                  {isSuperAdmin ? 'Super Admin Desk' : 'Operations Desk'}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-ocean-800 text-slate-300 hover:text-white border border-ocean-700 transition-colors"
            >
              <span>User View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-ocean-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="bg-white rounded-2xl p-3 border border-slate-200 shadow-subtle space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operations Control
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-ocean-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-ocean-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-container-orange' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Admin View Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
