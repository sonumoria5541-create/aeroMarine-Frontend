import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoBanner } from '../common/DemoBanner';
import { formatINR } from '../../lib/utils';
import {
  Anchor,
  LayoutDashboard,
  Box,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  TrendingUp,
  Users,
  User,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, wallet, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Containers', href: '/dashboard/containers', icon: Box },
    { name: 'Wallet & Ledger', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Deposit Funds', href: '/dashboard/deposit', icon: ArrowDownLeft },
    { name: 'Withdraw Payout', href: '/dashboard/withdraw', icon: ArrowUpRight },
    { name: 'Transactions', href: '/dashboard/transactions', icon: History },
    { name: 'Fleet Earnings', href: '/dashboard/earnings', icon: TrendingUp },
    { name: 'Referral Desk', href: '/dashboard/referrals', icon: Users },
    { name: 'Account Profile', href: '/dashboard/profile', icon: User },
  ];

  const bottomNavItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Fleet', href: '/dashboard/containers', icon: Box },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownLeft },
    { name: 'Account', href: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
      <DemoBanner />

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-ocean-900 border-b border-ocean-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-ocean-800"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-brand flex items-center justify-center text-white">
                <Anchor className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-white font-display tracking-tight">
                AERO<span className="text-teal-brand">MARINE</span>
              </span>
            </Link>
          </div>

          {/* Quick Balance Pill & User Info */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/wallet"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocean-800 border border-ocean-700 hover:border-teal-brand/50 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-teal-brand" />
              <span className="text-xs text-slate-400">Available:</span>
              <span className="text-sm font-bold text-white">
                {formatINR(wallet?.availableBalance || 0)}
              </span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-container-orange/20 text-container-orange border border-container-orange/30 hover:bg-container-orange/30 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-ocean-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-brand to-ocean-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Balance Overview Widget */}
            <div className="bg-ocean-900 rounded-2xl p-5 text-white border border-ocean-800 shadow-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-brand">
                Ledger Available
              </span>
              <p className="text-2xl font-black font-display tracking-tight mt-1 text-white">
                {formatINR(wallet?.availableBalance || 0)}
              </p>
              <div className="mt-3 pt-3 border-t border-ocean-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Reserved:</span>
                <span className="font-semibold text-slate-300">
                  {formatINR(wallet?.reservedBalance || 0)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Pending Dep:</span>
                <span className="font-semibold text-amber-400">
                  {formatINR(wallet?.pendingDeposits || 0)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-ocean-800">
                <Link
                  to="/dashboard/deposit"
                  className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-lg bg-teal-brand hover:bg-teal-hover text-white transition-colors"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </Link>
                <Link
                  to="/dashboard/withdraw"
                  className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-bold rounded-lg bg-ocean-800 hover:bg-ocean-700 text-slate-200 border border-ocean-700 transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Withdraw</span>
                </Link>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="bg-white rounded-2xl p-3 border border-slate-200 shadow-subtle space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-ocean-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-ocean-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-teal-brand' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-brand" />}
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-ocean-950/70 backdrop-blur-sm"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Anchor className="w-5 h-5 text-teal-brand" />
                    <span className="font-bold text-ocean-900 font-display">AeroMarine</span>
                  </div>
                  <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-ocean-900 p-4 rounded-xl text-white">
                  <span className="text-[10px] text-teal-brand uppercase font-bold">Available Balance</span>
                  <p className="text-xl font-bold font-display mt-0.5">{formatINR(wallet?.availableBalance || 0)}</p>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive ? 'bg-ocean-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-ocean-950 border-t border-ocean-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-teal-brand font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
