import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { FileText, ShieldCheck, RefreshCw, Search } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/audit-logs?page=${page}&limit=25`);
      if (res.data?.success) {
        setLogs(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Security & Operational Audit Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable trace of administrative reviews, financial approvals, user suspensions, and setting changes
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading audit records...</p>
        ) : logs.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">No audit records logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div
                key={log._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ocean-900">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {log.targetType}: {log.targetId}
                    </span>
                  </div>
                  {log.reason && <p className="text-slate-600 font-medium">{log.reason}</p>}
                  <p className="text-[11px] text-slate-400">
                    Actor: <span className="font-semibold text-ocean-900">{log.actorPhone}</span> (Role: {log.actorRole})
                  </p>
                </div>

                <div className="sm:text-right text-[11px] text-slate-400">
                  <p>{formatDate(log.createdAt)}</p>
                  {log.ipAddress && <p className="font-mono text-[10px]">IP: {log.ipAddress}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(pagination.pages > 1 || pagination.totalPages > 1) && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Page {pagination.page || page} of {pagination.pages || pagination.totalPages} ({pagination.total || logs.length} audit events)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= (pagination.pages || pagination.totalPages)}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
