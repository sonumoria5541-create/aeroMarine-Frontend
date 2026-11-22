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
  User,
  Phone,
  Wallet,
  Building2,
  Copy,
  Check,
  CreditCard,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const AdminDepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [copiedUtr, setCopiedUtr] = useState(false);

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
        setActionMessage(res.data.message || 'Deposit processed successfully!');
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

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const tabs = [
    { id: 'pending', label: 'Pending Verification' },
    { id: 'approved', label: 'Approved & Credited' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All Requests' },
  ];

  const filteredDeposits = deposits.filter((dep) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      dep.requestId?.toLowerCase().includes(term) ||
      dep.paymentReference?.toLowerCase().includes(term) ||
      dep.utr?.toLowerCase().includes(term) ||
      dep.user?.name?.toLowerCase().includes(term) ||
      dep.user?.phone?.includes(term) ||
      dep.user?.email?.toLowerCase().includes(term) ||
      dep.user?.inviteCode?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Page Title & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 truncate">
            Deposit Verification Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Review member deposit receipts, audit UTRs, and approve wallet balance credits
          </p>
        </div>

        {/* Live Search & Refresh Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search UTR, phone, name..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
            />
          </div>
          <button
            onClick={fetchDeposits}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-ocean-900 transition-colors flex-shrink-0"
            title="Refresh deposits"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Touch-Friendly Horizontal Swipeable Filter Tabs */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              statusFilter === tab.id
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deposit Requests List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-16 text-center">Loading deposits...</p>
        ) : filteredDeposits.length === 0 ? (
          <p className="text-xs text-slate-500 py-16 text-center">No deposit requests match this criteria.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDeposits.map((dep) => (
              <div
                key={dep._id}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                {/* Left Column: Full Member Details + Transaction Data */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono font-bold text-ocean-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {dep.requestId}
                    </span>
                    <StatusBadge status={dep.status} />
                    <span className="text-[10px] text-slate-400 font-medium ml-auto sm:ml-0">
                      {formatDate(dep.createdAt)}
                    </span>
                  </div>

                  {/* Member Profile Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <div className="flex items-center gap-1 text-sm font-bold text-ocean-900">
                      <User className="w-3.5 h-3.5 text-teal-brand" />
                      <span>{dep.user?.name || 'Member'}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {dep.user?.phone || 'N/A'}
                    </span>
                    {dep.user?.inviteCode && dep.user?.inviteCode !== 'N/A' && (
                      <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        Ref: {dep.user?.inviteCode}
                      </span>
                    )}
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      VIP {dep.user?.vipLevel ?? 0}
                    </span>
                  </div>

                  {/* Member Current Balance Standing */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-ocean-700" />
                      <span className="text-slate-500">Wallet:</span>
                      <span className="font-bold text-ocean-900">
                        {formatINR(dep.user?.wallet?.availableBalance ?? 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">Recharge Bal:</span>
                      <span className="font-bold text-teal-brand">
                        {formatINR(dep.user?.wallet?.rechargeBalance ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <p className="text-slate-600 break-all text-[11px]">
                    Method: <span className="font-semibold uppercase text-slate-800">{dep.paymentMethod}</span> &bull; UTR:{' '}
                    <span className="font-mono font-bold text-teal-brand bg-teal-50/60 px-1.5 py-0.5 rounded">
                      {dep.paymentReference || dep.utr}
                    </span>
                  </p>

                  {dep.adminNote && (
                    <p className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200/50 p-1.5 rounded-lg">
                      <span className="font-bold text-amber-900">Desk Note:</span> {dep.adminNote}
                    </p>
                  )}
                </div>

                {/* Right Column: Amount & Action Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-base sm:text-lg font-black font-display text-ocean-900 block">
                      {formatINR(dep.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Deposit Amount</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDeposit(dep);
                      setActionNote(dep.adminNote || '');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm flex-shrink-0 cursor-pointer"
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

      {/* Review & Process Dialog Modal */}
      <Modal
        isOpen={!!selectedDeposit}
        onClose={() => setSelectedDeposit(null)}
        title="Inspect & Process Deposit Request"
        subtitle={`Request ID: ${selectedDeposit?.requestId}`}
        maxWidth="max-w-xl"
      >
        {selectedDeposit && (
          <div className="space-y-4 sm:space-y-5 text-xs">
            {/* 1. Member Profile Dossier */}
            <div className="bg-ocean-900 text-white p-4 rounded-2xl border border-ocean-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-ocean-800">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-brand" />
                  <span className="font-bold text-xs uppercase tracking-wider text-teal-brand">
                    Sender Member Profile
                  </span>
                </div>
                <span className="text-[10px] bg-ocean-800 px-2 py-0.5 rounded font-mono text-cyan-300">
                  ID: {selectedDeposit.user?._id?.toString().slice(-8).toUpperCase() || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Member Name</span>
                  <span className="font-bold text-sm text-white">{selectedDeposit.user?.name || 'Member'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Number</span>
                  <span className="font-mono font-bold text-white">{selectedDeposit.user?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Referral Invite Code</span>
                  <span className="font-mono text-teal-brand font-bold">
                    {selectedDeposit.user?.inviteCode || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">VIP Tier & Status</span>
                  <span className="font-semibold text-white">
                    VIP {selectedDeposit.user?.vipLevel ?? 0} &bull;{' '}
                    <span className="uppercase text-emerald-400">{selectedDeposit.user?.status || 'active'}</span>
                  </span>
                </div>
              </div>

              {/* Wallet Balances Snapshot */}
              <div className="pt-2 border-t border-ocean-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-ocean-800/80 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Current Available</span>
                  <span className="font-bold text-white">
                    {formatINR(selectedDeposit.user?.wallet?.availableBalance ?? 0)}
                  </span>
                </div>
                <div className="bg-ocean-800/80 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Current Recharge Bal</span>
                  <span className="font-bold text-teal-brand">
                    {formatINR(selectedDeposit.user?.wallet?.rechargeBalance ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Transaction Payment Coordinates */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Payment Transaction Data
                </span>
                <StatusBadge status={selectedDeposit.status} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Deposit Amount:</span>
                <span className="font-black text-base text-ocean-900 font-display">
                  {formatINR(selectedDeposit.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 flex-shrink-0">UTR / Reference:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-teal-brand text-xs sm:text-sm break-all text-right">
                    {selectedDeposit.paymentReference || selectedDeposit.utr}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedDeposit.paymentReference || selectedDeposit.utr)}
                    className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                    title="Copy UTR"
                  >
                    {copiedUtr ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-bold uppercase text-slate-700">{selectedDeposit.paymentMethod}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Submission Date:</span>
                <span className="font-medium text-slate-700">{formatDate(selectedDeposit.createdAt)}</span>
              </div>
            </div>

            {/* 3. Operations Note Input */}
            <div className="space-y-1">
              <label className="font-bold text-ocean-900 block text-xs">Operations Note / Rejection Reason</label>
              <textarea
                rows={2}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="e.g. Verified HDFC Bank statement credit at 14:32"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            {actionMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold text-xs">
                {actionMessage}
              </div>
            )}

            {/* 4. Action Buttons */}
            {selectedDeposit.status !== 'approved' && selectedDeposit.status !== 'rejected' ? (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={actionSubmitting}
                  onClick={() => handleAction('approve')}
                  className="w-full py-2.5 rounded-xl bg-teal-brand hover:bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{actionSubmitting ? 'Processing...' : 'Approve & Credit Balance'}</span>
                </button>

                <button
                  type="button"
                  disabled={actionSubmitting}
                  onClick={() => handleAction('reject')}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Deposit</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-500 font-medium">
                This request has already been finalized as{' '}
                <span className="font-bold uppercase text-ocean-900">{selectedDeposit.status}</span>.
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
