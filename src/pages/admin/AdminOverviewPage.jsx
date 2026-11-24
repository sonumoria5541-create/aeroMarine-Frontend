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
  Globe,
  Image,
  Inbox,
  Palette,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cmsStats, setCmsStats] = useState({
    pagesCount: 0,
    inquiriesCount: 0,
    mediaCount: 0,
    seoScore: 94,
    loading: true,
  });

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

  const fetchCmsStats = async () => {
    try {
      const [pagesRes, inqRes, mediaRes, seoRes] = await Promise.allSettled([
        api.get('/admin/pages'),
        api.get('/admin/inquiries?limit=1'),
        api.get('/admin/media?limit=1'),
        api.get('/admin/seo/audit'),
      ]);

      const pagesCount =
        pagesRes.status === 'fulfilled' && pagesRes.value.data?.success
          ? pagesRes.value.data.data?.length || 0
          : 6;

      const inquiriesCount =
        inqRes.status === 'fulfilled' && inqRes.value.data?.success
          ? inqRes.value.data.total || inqRes.value.data.data?.length || 0
          : 0;

      const mediaCount =
        mediaRes.status === 'fulfilled' && mediaRes.value.data?.success
          ? mediaRes.value.data.total || mediaRes.value.data.data?.length || 0
          : 0;

      const seoScore =
        seoRes.status === 'fulfilled' && seoRes.value.data?.success
          ? seoRes.value.data.data?.overallScore || 92
          : 92;

      setCmsStats({
        pagesCount,
        inquiriesCount,
        mediaCount,
        seoScore,
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching CMS overview metrics:', err);
      setCmsStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchCmsStats();
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
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      {/* Admin Headline & Fast Action Triggers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
            Maritime Operations Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational KPIs, Financial Request Queues & Security Audit Feeds
          </p>
        </div>

        {/* Action Triggers Grid for Mobile, Flex for Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          <Link
            to="/admin/deposits"
            className="px-3 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 text-center truncate"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Deposits ({pendingDepositsCount})</span>
          </Link>

          <Link
            to="/admin/withdrawals"
            className="px-3 py-2 rounded-xl bg-container-orange hover:bg-container-orange/90 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 text-center truncate"
          >
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Payouts ({pendingWithdrawalsCount})</span>
          </Link>

          <Link
            to="/admin/plans"
            className="px-3 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 text-center truncate col-span-2 sm:col-span-1"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>New Container Plan</span>
          </Link>

          <button
            onClick={fetchOverview}
            className="hidden sm:flex p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm items-center justify-center"
            title="Refresh statistics"
            aria-label="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Primary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
          subtitle={`${data?.positions?.total || 0} Total Container Leases`}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Inflow Verified
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-emerald-700 break-words">
            {formatINR(data?.financial?.totalRecharged || data?.deposits?.totalAmount || 0)}
          </p>
          <p className="text-[11px] text-slate-400">
            {data?.deposits?.approvedCount || 0} Approved Bank/UPI Deposits
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Confirmed Payouts
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-rose-700 break-words">
            {formatINR(data?.financial?.totalWithdrawn || data?.withdrawals?.totalAmount || 0)}
          </p>
          <p className="text-[11px] text-slate-400">
            {data?.withdrawals?.approvedCount || 0} Processed Member Withdrawals
          </p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Net Operations Treasury
            </span>
            <div className="p-2 rounded-xl bg-ocean-50 text-ocean-900">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-ocean-900 break-words">
            {formatINR(data?.financial?.netTreasury || 0)}
          </p>
          <p className="text-[11px] text-slate-400">
            Inflow less Dispatched Payouts (Reconciled)
          </p>
        </div>
      </div>

      {/* Operational Queues & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Deposit Flow Summary */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <ArrowDownLeft className="w-4 h-4 text-teal-brand flex-shrink-0" />
              <h3 className="font-bold text-ocean-900 text-xs sm:text-sm truncate">Deposit Queue Breakdown</h3>
            </div>
            <Link to="/admin/deposits" className="text-xs font-bold text-teal-brand hover:underline flex-shrink-0">
              Inspect Desk &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="p-2 sm:p-3 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-100 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-700 block truncate">
                Pending
              </span>
              <span className="text-base sm:text-lg font-black text-amber-800 break-words">
                {data?.deposits?.pendingCount || 0}
              </span>
            </div>
            <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 block truncate">
                Credited
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-800 break-words">
                {data?.deposits?.approvedCount || 0}
              </span>
            </div>
            <div className="p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block truncate">
                Rejected
              </span>
              <span className="text-base sm:text-lg font-black text-slate-700 break-words">
                {data?.deposits?.rejectedCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Withdrawal Flow Summary */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <ArrowUpRight className="w-4 h-4 text-container-orange flex-shrink-0" />
              <h3 className="font-bold text-ocean-900 text-xs sm:text-sm truncate">Withdrawal Queue Breakdown</h3>
            </div>
            <Link to="/admin/withdrawals" className="text-xs font-bold text-container-orange hover:underline flex-shrink-0">
              Inspect Desk &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="p-2 sm:p-3 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-100 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-700 block truncate">
                Pending
              </span>
              <span className="text-base sm:text-lg font-black text-amber-800 break-words">
                {data?.withdrawals?.pendingCount || 0}
              </span>
            </div>
            <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-700 block truncate">
                Dispatched
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-800 break-words">
                {data?.withdrawals?.approvedCount || 0}
              </span>
            </div>
            <div className="p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block truncate">
                Declined
              </span>
              <span className="text-base sm:text-lg font-black text-slate-700 break-words">
                {data?.withdrawals?.rejectedCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Website CMS & Digital Presence Hub */}
      <div className="bg-gradient-to-br from-ocean-900 via-ocean-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-brand" />
              <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
                Website CMS & Content Management
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Self-manage public pages, section blocks, media library, customer inquiries, and SEO engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/pages/new"
              className="px-3.5 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Page</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* CMS Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/admin/pages"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between text-teal-brand mb-2">
              <Globe className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-teal-brand transition-colors">
                Pages &rarr;
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-display text-white">
              {cmsStats.loading ? '...' : cmsStats.pagesCount}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Published & System Pages</p>
          </Link>

          <Link
            to="/admin/inquiries"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <Inbox className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-400 transition-colors">
                Inbox &rarr;
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-display text-white">
              {cmsStats.loading ? '...' : cmsStats.inquiriesCount}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Customer Submissions</p>
          </Link>

          <Link
            to="/admin/media"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between text-sky-400 mb-2">
              <Image className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-sky-400 transition-colors">
                Media &rarr;
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-display text-white">
              {cmsStats.loading ? '...' : cmsStats.mediaCount}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Assets in Media Library</p>
          </Link>

          <Link
            to="/admin/seo"
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-400 transition-colors">
                Audit &rarr;
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-display text-emerald-400">
              {cmsStats.loading ? '...' : `${cmsStats.seoScore}%`}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">SEO Health Rating</p>
          </Link>
        </div>

        {/* Fast Module Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          <Link
            to="/admin/pages"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all flex flex-col items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-teal-brand" />
            <span className="text-[11px] font-semibold text-slate-200">Page Builder</span>
          </Link>
          <Link
            to="/admin/appearance"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all flex flex-col items-center gap-1.5"
          >
            <Palette className="w-4 h-4 text-container-orange" />
            <span className="text-[11px] font-semibold text-slate-200">Appearance</span>
          </Link>
          <Link
            to="/admin/navigation"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all flex flex-col items-center gap-1.5"
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span className="text-[11px] font-semibold text-slate-200">Nav Menus</span>
          </Link>
          <Link
            to="/admin/media"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all flex flex-col items-center gap-1.5"
          >
            <Image className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-semibold text-slate-200">Media Library</span>
          </Link>
          <Link
            to="/admin/seo"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all flex flex-col items-center gap-1.5"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-200">SEO & Sitemap</span>
          </Link>
          <Link
            to="/admin/staff"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-center transition-all flex flex-col items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-semibold text-slate-200">Staff & Roles</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Audit Feed */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-subtle space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-teal-brand flex-shrink-0" />
            <h3 className="font-bold text-ocean-900 text-xs sm:text-base truncate">Real-Time Operational Audit Feed</h3>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-bold text-teal-brand hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <span>Full Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!data?.recentActivity || data.recentActivity.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent audit logs recorded.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.recentActivity.map((log) => (
              <div key={log._id} className="py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-ocean-900 break-words">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 break-all">
                      {log.targetType}: {log.targetId}
                    </span>
                  </div>
                  {log.reason && <p className="text-slate-600 break-words">{log.reason}</p>}
                </div>
                <div className="sm:text-right text-[10px] sm:text-[11px] text-slate-400 flex-shrink-0">
                  <p>Actor: <span className="font-mono text-slate-600">{log.actorPhone}</span> ({log.actorRole})</p>
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
