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
} from 'lucide-react';

export const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchOverview();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-500">Loading operations center overview...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Admin Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Maritime Operations Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational KPIs, Financial Request Queues & Audit Feeds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/deposits"
            className="px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Review Deposits ({data?.deposits?.pendingCount || 0})</span>
          </Link>
          <Link
            to="/admin/withdrawals"
            className="px-4 py-2 rounded-xl bg-container-orange hover:bg-container-orange/90 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Process Payouts ({data?.withdrawals?.pendingCount || 0})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Deposits"
          value={data?.deposits?.pendingCount || 0}
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
          value={data?.withdrawals?.pendingCount || 0}
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
          subtitle={`${data?.users?.active || 0} Active / ${data?.users?.suspended || 0} Suspended`}
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
          subtitle="Containers deployed in maritime routes"
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

        {data?.recentActivity?.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent audit logs.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {data?.recentActivity?.map((log) => (
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
