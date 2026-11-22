import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
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
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isSuperAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Deposit Requests', href: '/admin/deposits', icon: ArrowDownLeft },
    { name: 'Withdrawal Payouts', href: '/admin/withdrawals', icon: ArrowUpRight },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Container Fleet Plans', href: '/admin/plans', icon: Box },
    { name: 'Fleet Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Daily Earnings Engine', href: '/admin/earnings', icon: TrendingUp },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { name: 'Security Audit Logs', href: '/admin/audit-logs', icon: FileText },
  ];

  const bottomNavItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Deposits', href: '/admin/deposits', icon: ArrowDownLeft },
    { name: 'Payouts', href: '/admin/withdrawals', icon: ArrowUpRight },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const isCurrentActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Navigation Header */}
      <header className="bg-ocean-950 border-b border-ocean-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-ocean-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-container-orange" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-container-orange to-amber-600 flex items-center justify-center text-white shadow-md shadow-container-orange/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-white font-display tracking-tight">
                    AERO<span className="text-teal-brand">MARINE</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-brand/20 text-teal-300 px-2 py-0.5 rounded border border-teal-brand/30 hidden xs:inline-block">
                    CONTROL
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono -mt-0.5">
                  {user?.phone ? `OpDesk: ${user.phone}` : 'Operations Desk'}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest bg-container-orange/15 text-container-orange px-2.5 py-1 rounded-lg border border-container-orange/30">
              {isSuperAdmin ? '🛡️ Super Admin' : '⚓ Operations Desk'}
            </span>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-ocean-800/80 hover:bg-ocean-700 text-slate-200 hover:text-white border border-ocean-700 transition-colors"
              title="Go to customer site view"
            >
              <span>User App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-ocean-800/80 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-ocean-950 border-r border-ocean-800 h-full p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-ocean-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-container-orange" />
                  <span className="font-bold text-sm text-white">Navigation</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isCurrentActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-container-orange text-white shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-ocean-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-ocean-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>Account:</span>
                <span className="font-mono text-white font-bold">{user?.phone}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Workspace Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Desktop Admin Navigation Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <nav className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-subtle space-y-1">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-ocean-900/60 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-brand" />
                <span>Operations Desk</span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isCurrentActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-ocean-900 text-white shadow-md shadow-ocean-900/20 font-bold'
                        : 'text-slate-600 hover:text-ocean-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-container-orange' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick System Badge */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-xs space-y-1.5 shadow-subtle">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Production Mode</span>
              </div>
              <p className="text-[11px] text-slate-500">
                AeroMarine High-Security Ledger Engine active.
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Admin Content View Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Quick-Action Bar (< 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-ocean-950/95 backdrop-blur-md border-t border-ocean-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
                active ? 'text-container-orange font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
};
