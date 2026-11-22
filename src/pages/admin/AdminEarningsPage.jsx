import React, { useState } from 'react';
import api from '../../lib/api';
import { formatINR } from '../../lib/utils';
import { TrendingUp, Play, CheckCircle2, ShieldAlert, Calendar } from 'lucide-react';

export const AdminEarningsPage = () => {
  const [period, setPeriod] = useState(new Date().toISOString().split('T')[0]);
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [postingBatch, setPostingBatch] = useState(false);
  const [postNotice, setPostNotice] = useState('');

  const handlePreview = async () => {
    try {
      setLoadingPreview(true);
      setPostNotice('');
      const res = await api.post('/admin/earnings/preview', { period });
      if (res.data?.success) {
        setPreview(res.data.data);
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to preview batch.');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handlePostBatch = async () => {
    if (!window.confirm(`Post daily fleet charter earning batch for period ${period}?`)) return;
    try {
      setPostingBatch(true);
      setPostNotice('');
      const res = await api.post('/admin/earnings/post', { period });
      if (res.data?.success) {
        setPostNotice(res.data.message);
        setPreview(null);
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to post batch.');
    } finally {
      setPostingBatch(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black font-display text-ocean-900">Daily Fleet Earnings Engine</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute idempotent daily charter revenue accrual batches and credit member ledgers
        </p>
      </div>

      <div className="bg-ocean-50 border border-ocean-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-ocean-900">
        <TrendingUp className="w-5 h-5 text-teal-brand flex-shrink-0 mt-0.5" />
        <div>
          <strong className="block text-ocean-950 font-bold mb-0.5">Automated Idempotent Engine:</strong>
          Daily charter revenue batches are computed per active container lease. Posting is strictly idempotent—running multiple times for the same calendar date will safely skip already processed container allocations.
        </div>
      </div>

      {/* Date Selector & Preview Trigger Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <h3 className="font-bold text-ocean-900 text-base">Run Earnings Engine Batch</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="space-y-1 w-full sm:w-64">
            <label className="text-xs font-bold text-ocean-900">Accrual Period (YYYY-MM-DD)</label>
            <input
              type="date"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
            />
          </div>

          <button
            onClick={handlePreview}
            disabled={loadingPreview}
            className="w-full sm:w-auto mt-auto py-2.5 px-6 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-teal-brand" />
            <span>{loadingPreview ? 'Calculating...' : 'Preview Daily Batch'}</span>
          </button>
        </div>

        {postNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
            {postNotice}
          </div>
        )}
      </div>

      {/* Preview Table */}
      {preview && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-ocean-900 text-base">Batch Preview: {preview.period}</h3>
              <p className="text-xs text-slate-500">
                Total Positions: {preview.totalPositions} &bull; Estimated Payout: {formatINR(preview.totalNet)}
              </p>
            </div>

            <button
              onClick={handlePostBatch}
              disabled={postingBatch || preview.totalPositions === 0}
              className="py-3 px-6 rounded-xl bg-teal-brand hover:bg-teal-hover disabled:bg-slate-300 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{postingBatch ? 'Executing Ledger Posting...' : 'Post Daily Batch to Ledger'}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto text-xs">
            {preview.calculations?.map((c, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-ocean-900">
                    {c.user?.name} &bull; <span className="font-normal text-slate-500">{c.planName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Base: {formatINR(c.amount)} @ {c.ratePercent}% daily
                  </p>
                </div>
                <span className="font-bold text-emerald-600 text-sm">+{formatINR(c.netAmount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
