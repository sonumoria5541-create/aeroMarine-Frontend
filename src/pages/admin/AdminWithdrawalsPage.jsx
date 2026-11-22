import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  ArrowUpRight,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  QrCode,
  Building2,
  AlertTriangle,
} from 'lucide-react';

export const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const [payoutReference, setPayoutReference] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/admin/withdrawals' : `/admin/withdrawals?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setWithdrawals(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [statusFilter]);

  const handleAction = async (action) => {
    if (!selectedWithdrawal) return;
    if (action === 'mark_paid' && !payoutReference.trim()) {
      alert('Please enter bank payout reference (UTR / IMPS Transaction Number) before marking as paid.');
      return;
    }
    if (action === 'reject' && !adminNote.trim()) {
      alert('Please specify an operational reason for rejecting this withdrawal.');
      return;
    }

    try {
      setSubmitting(true);
      setActionMessage('');
      const res = await api.post(`/admin/withdrawals/${selectedWithdrawal._id}/action`, {
        action,
        payoutReference: payoutReference.trim(),
        adminNote: adminNote.trim(),
      });

      if (res.data?.success) {
        setActionMessage(res.data.message);
        setTimeout(() => {
          setSelectedWithdrawal(null);
          setPayoutReference('');
          setAdminNote('');
          fetchWithdrawals();
        }, 1000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending Review' },
    { id: 'processing', label: 'Processing' },
    { id: 'paid', label: 'Paid Out' },
    { id: 'rejected', label: 'Rejected / Released' },
    { id: 'all', label: 'All Withdrawals' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Withdrawal Payout Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review reserved balances, confirm bank dispatch, or release reservations
          </p>
        </div>

        <button
          onClick={fetchWithdrawals}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Withdrawals List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading withdrawals...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">No withdrawal requests under this filter.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {withdrawals.map((wth) => (
              <div
                key={wth._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ocean-900">{wth.requestId}</span>
                    <StatusBadge status={wth.status} />
                  </div>
                  <p className="font-semibold text-ocean-900">
                    {wth.user?.name} &bull; <span className="font-mono text-slate-500">{wth.user?.phone}</span>
                  </p>
                  <p className="text-slate-500">
                    Channel: <span className="font-semibold uppercase">{wth.payoutMethod}</span> &bull; Destination:{' '}
                    <span className="font-mono">
                      {wth.payoutDestinationSnapshot?.upiIdMasked ||
                        wth.payoutDestinationSnapshot?.accountNumberMasked ||
                        'Masked'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">{formatDate(wth.createdAt)}</p>
                  {wth.payoutReference && (
                    <p className="text-[11px] font-mono text-emerald-800 bg-emerald-50 p-1 rounded inline-block">
                      UTR: {wth.payoutReference}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:justify-end">
                  <div className="text-right">
                    <span className="text-lg font-black font-display text-ocean-900 block">
                      {formatINR(wth.netAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Net Payout</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedWithdrawal(wth);
                      setPayoutReference(wth.payoutReference || '');
                      setAdminNote(wth.adminNote || '');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Payout</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Modal
        isOpen={!!selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
        title="Review & Process Withdrawal Payout"
        subtitle={`Request ID: ${selectedWithdrawal?.requestId}`}
      >
        {selectedWithdrawal && (
          <div className="space-y-5 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Member:</span>
                <span className="font-bold text-ocean-900">{selectedWithdrawal.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Requested:</span>
                <span className="font-bold text-ocean-900">{formatINR(selectedWithdrawal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Fee:</span>
                <span className="font-semibold text-slate-700">{formatINR(selectedWithdrawal.fee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Net Amount to Dispatch:</span>
                <span className="font-black text-sm text-teal-brand font-display">
                  {formatINR(selectedWithdrawal.netAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-mono font-bold text-ocean-900">
                  {selectedWithdrawal.payoutDestinationSnapshot?.upiIdMasked ||
                    selectedWithdrawal.payoutDestinationSnapshot?.accountNumberMasked ||
                    'Masked'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <StatusBadge status={selectedWithdrawal.status} />
              </div>
            </div>

            {selectedWithdrawal.status !== 'paid' && selectedWithdrawal.status !== 'rejected' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-ocean-900 block">
                    Bank Payout UTR Reference (Required to Mark as Paid)
                  </label>
                  <input
                    type="text"
                    value={payoutReference}
                    onChange={(e) => setPayoutReference(e.target.value)}
                    placeholder="e.g. 20261122889944"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ocean-900 block">Desk Note / Rejection Reason</label>
                  <textarea
                    rows={2}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Notes visible to member..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
                  />
                </div>

                {actionMessage && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold">
                    {actionMessage}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction('mark_paid')}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Dispatched & Mark Paid</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction('approve')}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Mark Processing
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction('reject')}
                    className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject & Release Funds</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
