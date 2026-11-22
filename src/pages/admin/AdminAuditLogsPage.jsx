import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { FileText, ShieldCheck, RefreshCw, Search } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredLogs = logs.filter((l) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.action?.toLowerCase().includes(term) ||
      l.targetType?.toLowerCase().includes(term) ||
      l.targetId?.toLowerCase().includes(term) ||
      l.actorPhone?.includes(term) ||
      l.reason?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Page Title & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
            Security & Operational Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable trace of administrative reviews, financial approvals, user suspensions, and setting changes
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search action, actor, or target..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-brand shadow-sm"
            />
          </div>

          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm text-slate-600 flex-shrink-0"
            title="Refresh audit stream"
            aria-label="Refresh audit stream"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-16 text-center">Loading audit records...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-16 text-center">No audit records match your query.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div
                key={log._id}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-ocean-900 break-words">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 break-all">
                      {log.targetType}: {log.targetId}
                    </span>
                  </div>
                  {log.reason && <p className="text-slate-600 font-medium break-words">{log.reason}</p>}
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Actor: <span className="font-semibold text-ocean-900">{log.actorPhone}</span> (Role: {log.actorRole})
                  </p>
                </div>

                <div className="sm:text-right text-[10px] sm:text-[11px] text-slate-400 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <p>{formatDate(log.createdAt)}</p>
                  {log.ipAddress && <p className="font-mono text-[10px]">IP: {log.ipAddress}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Responsive Pagination */}
        {(pagination.pages > 1 || pagination.totalPages > 1) && (
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 text-center sm:text-left">
              Page {pagination.page || page} of {pagination.pages || pagination.totalPages} ({pagination.total || logs.length} audit events)
            </span>
            <div className="flex gap-2 w-full sm:w-auto justify-center">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl border border-slate-200 bg-white disabled:opacity-40 font-semibold shadow-sm text-center"
              >
                Previous
              </button>
              <button
                disabled={page >= (pagination.pages || pagination.totalPages)}
                onClick={() => setPage((p) => p + 1)}
                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl border border-slate-200 bg-white disabled:opacity-40 font-semibold shadow-sm text-center"
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
