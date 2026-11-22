import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatCard } from '../../components/common/StatCard';
import {
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  Box,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Building2,
  RefreshCw,
  Plus,
} from 'lucide-react';

export const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-teal-brand border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Loading operations center overview...</p>
      </div>
    );
  }

  const pendingDepositsCount = data?.deposits?.pendingCount || 0;
  const pendingWithdrawalsCount = data?.withdrawals?.pendingCount || 0;

  return (
    <div className="space-y-8">
      {/* Admin Headline & Fast Action Triggers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Maritime Operations Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational KPIs, Financial Request Queues & Security Audit Feeds
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/deposits"
            className="px-3.5 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Verify Deposits ({pendingDepositsCount})</span>
          </Link>

          <Link
            to="/admin/withdrawals"
            className="px-3.5 py-2 rounded-xl bg-container-orange hover:bg-container-orange/90 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Process Payouts ({pendingWithdrawalsCount})</span>
          </Link>

          <Link
            to="/admin/plans"
            className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Container Plan</span>
          </Link>

          <button
            onClick={fetchOverview}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Primary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Pending Deposits"
          value={pendingDepositsCount}
          subtitle="Transfers awaiting bank verification"
          icon={ArrowDownLeft}
          color="teal"
          action={
            <Link to="/admin/deposits" className="text-xs font-bold text-teal-brand hover:underline flex items-center gap-1">
              <span>Open Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <StatCard
          title="Pending Withdrawals"
          value={pendingWithdrawalsCount}
          subtitle="Payouts awaiting review & dispatch"
          icon={ArrowUpRight}
          color="orange"
          action={
            <Link to="/admin/withdrawals" className="text-xs font-bold text-container-orange hover:underline flex items-center gap-1">
              <span>Open Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <StatCard
          title="Total Members"
          value={data?.users?.total || 0}
          subtitle={`${data?.users?.active || 0} Active • ${data?.users?.suspended || 0} Suspended`}
          icon={Users}
          color="blue"
          action={
            <Link to="/admin/users" className="text-xs font-bold text-sky-700 hover:underline flex items-center gap-1">
              <span>Manage Accounts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <StatCard
          title="Active Fleet Units"
          value={data?.positions?.activeCount || 0}
          subtitle={`${data?.positions?.total || 0} Total Container Allocations`}
          icon={Box}
          color="navy"
          action={
            <Link to="/admin/orders" className="text-xs font-bold text-ocean-900 hover:underline flex items-center gap-1">
              <span>View Fleet Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
      </div>

      {/* Secondary Financial & Treasury Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Collected Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-emerald-700">
            {formatINR(data?.financial?.totalRecharged || data?.deposits?.totalAmount || 0)}
          </p>
          <p className="text-[11px] text-slate-400">
            {data?.deposits?.approvedCount || 0} Approved Bank/UPI Deposits
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Payouts</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-rose-700">
            {formatINR(data?.financial?.totalWithdrawn || data?.withdrawals?.totalAmount || 0)}
          </p>
          <p className="text-[11px] text-slate-400">
            {data?.withdrawals?.approvedCount || 0} Processed Member Withdrawals
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Operations Treasury</span>
            <div className="p-2 rounded-xl bg-ocean-50 text-ocean-900">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black font-display text-ocean-900">
            {formatINR(data?.financial?.netTreasury || 0)}
          </p>
          <p className="text-[11px] text-slate-400">
            Inflow less Dispatched Payouts (Reconciled)
          </p>
        </div>
      </div>

      {/* Operational Queues & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Flow Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-teal-brand" />
              <h3 className="font-bold text-ocean-900 text-sm">Deposit Processing Ledger</h3>
            </div>
            <Link to="/admin/deposits" className="text-xs font-bold text-teal-brand hover:underline">
              Inspect Desk
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending</span>
              <span className="text-lg font-black text-amber-800">{data?.deposits?.pendingCount || 0}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Credited</span>
              <span className="text-lg font-black text-emerald-800">{data?.deposits?.approvedCount || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Rejected</span>
              <span className="text-lg font-black text-slate-700">{data?.deposits?.rejectedCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Withdrawal Flow Summary */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-container-orange" />
              <h3 className="font-bold text-ocean-900 text-sm">Withdrawal Payout Ledger</h3>
            </div>
            <Link to="/admin/withdrawals" className="text-xs font-bold text-container-orange hover:underline">
              Inspect Desk
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending</span>
              <span className="text-lg font-black text-amber-800">{data?.withdrawals?.pendingCount || 0}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Dispatched</span>
              <span className="text-lg font-black text-emerald-800">{data?.withdrawals?.approvedCount || 0}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Released/Declined</span>
              <span className="text-lg font-black text-slate-700">{data?.withdrawals?.rejectedCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-brand" />
            <h3 className="font-bold text-ocean-900 text-base">Real-Time Operational Audit Feed</h3>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-bold text-teal-brand hover:underline flex items-center gap-1"
          >
            <span>View Full Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!data?.recentActivity || data.recentActivity.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent audit logs.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.recentActivity.map((log) => (
              <div key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ocean-900">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {log.targetType}: {log.targetId}
                    </span>
                  </div>
                  {log.reason && <p className="text-slate-600">{log.reason}</p>}
                </div>
                <div className="sm:text-right text-[11px] text-slate-400">
                  <p>Actor: {log.actorPhone} ({log.actorRole})</p>
                  <p>{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
