import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShoppingCart, Box, RefreshCw, Search } from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      ord.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.user?.phone?.includes(searchTerm) ||
      ord.planSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
            Fleet Container Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Member fleet allocations, participation agreements, and operational timelines
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, phone, or plan..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-brand shadow-sm"
            />
          </div>

          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm text-slate-600 flex-shrink-0"
            title="Refresh"
            aria-label="Refresh orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs with Horizontal Swipe */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: `All Orders (${orders.length})` },
          { id: 'running', label: `Active (${orders.filter((o) => o.status === 'running').length})` },
          { id: 'completed', label: `Completed (${orders.filter((o) => o.status === 'completed').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 text-xs ${
              statusFilter === tab.id
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-16 text-center">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-16 text-center">No container orders under this filter.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((ord) => (
              <div
                key={ord._id}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-ocean-900 text-sm truncate">{ord.planSnapshot?.name}</span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <p className="font-semibold text-ocean-900">
                    Member: {ord.user?.name} &bull; <span className="font-mono text-slate-500">{ord.user?.phone}</span>
                  </p>
                  <p className="text-slate-500">
                    Duration: {ord.planSnapshot?.durationDays} Days &bull; Daily Rate: ~{ord.planSnapshot?.dailyRatePercent}%
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Acquired: {formatDate(ord.createdAt)} &bull; End Date: {formatDate(ord.endDate)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 sm:text-right">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Ledger Debited
                  </span>
                  <span className="text-base sm:text-lg font-black font-display text-ocean-900 block">
                    {formatINR(ord.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
