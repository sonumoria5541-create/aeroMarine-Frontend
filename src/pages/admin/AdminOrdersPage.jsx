import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ShoppingCart, Box, RefreshCw } from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Fleet Container Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Member fleet allocations, participation agreements, and operational timelines
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">No container orders recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ocean-900 text-sm">{ord.planSnapshot?.name}</span>
                    <StatusBadge status={ord.status} />
                  </div>
                  <p className="font-semibold text-ocean-900">
                    Member: {ord.user?.name} &bull; <span className="font-mono text-slate-500">{ord.user?.phone}</span>
                  </p>
                  <p className="text-slate-500">
                    Duration: {ord.planSnapshot?.durationDays} Days &bull; Daily Estimate: ~{ord.planSnapshot?.dailyRatePercent}%
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Acquired: {formatDate(ord.createdAt)} &bull; End Date: {formatDate(ord.endDate)}
                  </p>
                </div>

                <div className="sm:text-right space-y-0.5">
                  <span className="text-base font-black font-display text-ocean-900 block">
                    {formatINR(ord.amount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Ledger Txn Debited
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
