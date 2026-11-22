import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Wallet,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Box,
  TrendingUp,
  History,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        if (res.data?.success) {
          setSummary(res.data.data);
        }
      } catch (e) {
        console.error('Failed to load dashboard summary:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-10 h-10 border-4 border-teal-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading ledger account summary...</p>
      </div>
    );
  }

  const wallet = summary?.wallet || {};

  return (
    <div className="space-y-8">
      {/* Greeting & Quick Action Banner */}
      <div className="bg-gradient-to-r from-ocean-900 to-ocean-800 rounded-3xl p-6 sm:p-8 text-white border border-ocean-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Verified Maritime Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Track your container fleet positions and submit verified ledger transactions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            to="/dashboard/deposit"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-md"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit Funds</span>
          </Link>
          <Link
            to="/dashboard/withdraw"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-slate-200 border border-ocean-700 text-xs font-bold transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </Link>
          <Link
            to="/containers"
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-container-orange hover:bg-container-orange/90 text-white text-xs font-bold transition-all shadow-md"
          >
            <Box className="w-4 h-4" />
            <span>Explore Containers</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Available Balance"
          value={formatINR(wallet.availableBalance || 0)}
          subtitle="Spendable for containers & withdrawal"
          icon={Wallet}
          color="teal"
        />

        <StatCard
          title="Reserved Balance"
          value={formatINR(wallet.reservedBalance || 0)}
          subtitle="Pending withdrawal requests"
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Pending Deposits"
          value={formatINR(wallet.pendingDeposits || 0)}
          subtitle="Awaiting bank verification (not spendable)"
          icon={ArrowDownLeft}
          color="blue"
        />

        <StatCard
          title="Total Earnings"
          value={formatINR(summary?.earnings?.totalSimulated || 0)}
          subtitle="Active fleet returns"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Financial Status Clarification Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-5 h-5 text-teal-brand flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-ocean-900">Double-Entry Balance Rules:</strong> Pending deposits are unverified banking
          transfers and are <em>not spendable</em> until verified by the operations desk. Withdrawals atomically reserve
          funds upon submission to prevent accidental double-spending.
        </div>
      </div>

      {/* Active Container Fleet Positions & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Positions */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-teal-brand" />
              <h2 className="text-base font-bold text-ocean-900">Active Container Fleet</h2>
            </div>
            <Link
              to="/dashboard/containers"
              className="text-xs font-semibold text-teal-brand hover:underline flex items-center gap-1"
            >
              <span>View All ({summary?.positions?.activeCount || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {summary?.positions?.activeList?.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Box className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">You do not have any active container fleet positions yet.</p>
              <Link
                to="/containers"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-ocean-900 text-white text-xs font-bold hover:bg-ocean-800 transition-colors"
              >
                <span>Acquire Your First Container</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {summary?.positions?.activeList?.map((pos) => (
                <div
                  key={pos._id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      {pos.planSnapshot?.category || 'Container'}
                    </span>
                    <h4 className="font-bold text-ocean-900 text-sm">{pos.planSnapshot?.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Term: {pos.planSnapshot?.durationDays} Days &bull; Rate: ~{pos.planSnapshot?.dailyRatePercent}% / day
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs font-bold text-ocean-900 font-display block">
                      {formatINR(pos.amount)}
                    </span>
                    <StatusBadge status={pos.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions Feed */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-teal-brand" />
              <h2 className="text-base font-bold text-ocean-900">Recent Transactions</h2>
            </div>
            <Link
              to="/dashboard/transactions"
              className="text-xs font-semibold text-teal-brand hover:underline flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {summary?.recentTransactions?.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No ledger transactions posted yet.</p>
          ) : (
            <div className="space-y-3">
              {summary?.recentTransactions?.map((txn) => (
                <div
                  key={txn._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-ocean-900">{txn.description}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(txn.createdAt)}</p>
                  </div>
                  <span
                    className={`font-black font-display text-xs ${
                      txn.type === 'deposit' || txn.type === 'earning_credit'
                        ? 'text-emerald-600'
                        : 'text-ocean-900'
                    }`}
                  >
                    {txn.type === 'deposit' || txn.type === 'earning_credit' ? '+' : '-'}
                    {formatINR(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
