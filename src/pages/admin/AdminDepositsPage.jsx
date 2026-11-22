import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const AdminDepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/admin/deposits' : `/admin/deposits?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setDeposits(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const handleAction = async (action) => {
    if (!selectedDeposit) return;
    if (action === 'reject' && !actionNote.trim()) {
      alert('Please provide a reason when rejecting a deposit.');
      return;
    }

    try {
      setActionSubmitting(true);
      setActionMessage('');
      const res = await api.post(`/admin/deposits/${selectedDeposit._id}/action`, {
        action,
        adminNote: actionNote,
      });

      if (res.data?.success) {
        setActionMessage(res.data.message);
        setTimeout(() => {
          setSelectedDeposit(null);
          setActionNote('');
          fetchDeposits();
        }, 1000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionSubmitting(false);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending Verification' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'approved', label: 'Approved & Credited' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All Requests' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Deposit Management Desk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify manual bank/UPI receipts before posting credits to user ledgers
          </p>
        </div>

        <button
          onClick={fetchDeposits}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs */}
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

      {/* Deposits Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading deposits...</p>
        ) : deposits.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">No deposit requests under this filter.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {deposits.map((dep) => (
              <div
                key={dep._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ocean-900">{dep.requestId}</span>
                    <StatusBadge status={dep.status} />
                  </div>
                  <p className="font-semibold text-ocean-900">
                    {dep.user?.name} &bull; <span className="font-mono text-slate-500">{dep.user?.phone}</span>
                  </p>
                  <p className="text-slate-500">
                    Method: <span className="font-semibold uppercase">{dep.paymentMethod}</span> &bull; UTR:{' '}
                    <span className="font-mono font-bold text-ocean-900">{dep.paymentReference}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">{formatDate(dep.createdAt)}</p>
                </div>

                <div className="flex items-center gap-4 sm:justify-end">
                  <div className="text-right">
                    <span className="text-lg font-black font-display text-ocean-900 block">
                      {formatINR(dep.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">INR Minor Units</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDeposit(dep);
                      setActionNote(dep.adminNote || '');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog Modal */}
      <Modal
        isOpen={!!selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        title="Inspect & Process Deposit Request"
        subtitle={`Request ID: ${selectedDeposit?.requestId}`}
      >
        {selectedDeposit && (
          <div className="space-y-5 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">User:</span>
                <span className="font-bold text-ocean-900">{selectedDeposit.user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono text-ocean-900">{selectedDeposit.user?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-black text-sm text-ocean-900 font-display">
                  {formatINR(selectedDeposit.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UTR / Reference:</span>
                <span className="font-mono font-bold text-teal-brand text-sm">{selectedDeposit.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-bold uppercase text-slate-700">{selectedDeposit.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <StatusBadge status={selectedDeposit.status} />
              </div>
            </div>

            {/* Proof screenshot if uploaded */}
            {selectedDeposit.proofFile?.path && (
              <div className="space-y-1.5">
                <span className="font-bold text-ocean-900 block">Uploaded Payment Advice Proof:</span>
                <a
                  href={selectedDeposit.proofFile.path}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] max-h-48 bg-slate-100 relative group"
                >
                  <img
                    src={selectedDeposit.proofFile.path}
                    alt="Payment Proof"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-ocean-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                    Click to Open Full Document
                  </div>
                </a>
              </div>
            )}

            {/* Admin Note Input */}
            <div className="space-y-1">
              <label className="font-bold text-ocean-900 block">Operations Note / Rejection Reason</label>
              <textarea
                rows={2}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="e.g. Verified Axis Bank bank statement credit at 14:32"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            {actionMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold">
                {actionMessage}
              </div>
            )}

            {/* Action Buttons */}
            {selectedDeposit.status !== 'approved' && selectedDeposit.status !== 'rejected' ? (
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={actionSubmitting}
                  onClick={() => handleAction('approve')}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Credit Balance</span>
                </button>

                <button
                  type="button"
                  disabled={actionSubmitting}
                  onClick={() => handleAction('under_review')}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Review
                </button>

                <button
                  type="button"
                  disabled={actionSubmitting}
                  onClick={() => handleAction('reject')}
                  className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400 italic">
                This transaction has already been finalized ({selectedDeposit.status}). Immutable ledger entries cannot be
                mutated.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
