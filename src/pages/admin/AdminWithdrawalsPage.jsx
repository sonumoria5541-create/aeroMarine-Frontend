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
  Search,
  User,
  Phone,
  Wallet,
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const [payoutReference, setPayoutReference] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [copiedField, setCopiedField] = useState('');

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
        setActionMessage(res.data.message || 'Withdrawal status updated!');
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

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const tabs = [
    { id: 'pending', label: 'Pending Review' },
    { id: 'approved', label: 'Paid Out & Dispatched' },
    { id: 'rejected', label: 'Declined / Refunded' },
    { id: 'all', label: 'All Requests' },
  ];

  const filteredWithdrawals = withdrawals.filter((wth) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      wth.requestId?.toLowerCase().includes(term) ||
      wth.payoutReference?.toLowerCase().includes(term) ||
      wth.user?.name?.toLowerCase().includes(term) ||
      wth.user?.phone?.includes(term) ||
      wth.user?.email?.toLowerCase().includes(term) ||
      wth.user?.inviteCode?.toLowerCase().includes(term) ||
      wth.bankDetails?.realName?.toLowerCase().includes(term) ||
      wth.bankDetails?.accountNumber?.includes(term) ||
      wth.bankDetails?.ifsc?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 truncate">
            Withdrawal Payout Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Audit member withdrawal requests, verify recipient bank coordinates, and dispatch funds
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
              placeholder="Search member, phone, account, IFSC..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
            />
          </div>
          <button
            onClick={fetchWithdrawals}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-ocean-900 transition-colors flex-shrink-0"
            title="Refresh withdrawals"
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

      {/* Withdrawals List / Record Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-16 text-center">Loading withdrawals...</p>
        ) : filteredWithdrawals.length === 0 ? (
          <p className="text-xs text-slate-500 py-16 text-center">No withdrawal requests match this criteria.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredWithdrawals.map((wth) => (
              <div
                key={wth._id}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                {/* Left Column: Member Details + Bank Account + Request info */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono font-bold text-ocean-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {wth.requestId}
                    </span>
                    <StatusBadge status={wth.status} />
                    <span className="text-[10px] text-slate-400 font-medium ml-auto sm:ml-0">
                      {formatDate(wth.createdAt)}
                    </span>
                  </div>

                  {/* Member Profile Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <div className="flex items-center gap-1 text-sm font-bold text-ocean-900">
                      <User className="w-3.5 h-3.5 text-teal-brand" />
                      <span>{wth.user?.name || wth.bankDetails?.realName || 'Member'}</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {wth.user?.phone || 'N/A'}
                    </span>
                    {wth.user?.inviteCode && wth.user?.inviteCode !== 'N/A' && (
                      <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        Ref: {wth.user?.inviteCode}
                      </span>
                    )}
                    <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      VIP {wth.user?.vipLevel ?? 0}
                    </span>
                  </div>

                  {/* Destination Bank Account Coordinates */}
                  <div className="bg-slate-50/90 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-ocean-800 flex-shrink-0" />
                      <span className="text-slate-500">Beneficiary:</span>
                      <span className="font-bold text-ocean-900">{wth.bankDetails?.realName || 'Member'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400">A/C: </span>
                        <span className="font-bold text-slate-900">{wth.bankDetails?.accountNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">IFSC: </span>
                        <span className="font-bold text-teal-brand">{wth.bankDetails?.ifsc || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {wth.payoutReference && (
                    <p className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block break-all border border-emerald-200">
                      Bank Dispatch UTR: {wth.payoutReference}
                    </p>
                  )}

                  {wth.adminNote && (
                    <p className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200/50 p-1.5 rounded-lg">
                      <span className="font-bold text-amber-900">Desk Note:</span> {wth.adminNote}
                    </p>
                  )}
                </div>

                {/* Right Column: Amount & Action Button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-base sm:text-lg font-black font-display text-ocean-900 block">
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
                    className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm flex-shrink-0 cursor-pointer"
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
        maxWidth="max-w-xl"
      >
        {selectedWithdrawal && (
          <div className="space-y-4 sm:space-y-5 text-xs">
            {/* 1. Recipient Member Dossier */}
            <div className="bg-ocean-900 text-white p-4 rounded-2xl border border-ocean-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-ocean-800">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-brand" />
                  <span className="font-bold text-xs uppercase tracking-wider text-teal-brand">
                    Recipient Member Profile
                  </span>
                </div>
                <span className="text-[10px] bg-ocean-800 px-2 py-0.5 rounded font-mono text-cyan-300">
                  ID: {selectedWithdrawal.user?._id?.toString().slice(-8).toUpperCase() || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Member Name</span>
                  <span className="font-bold text-sm text-white">
                    {selectedWithdrawal.user?.name || selectedWithdrawal.bankDetails?.realName || 'Member'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Phone Number</span>
                  <span className="font-mono font-bold text-white">
                    {selectedWithdrawal.user?.phone || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Referral Invite Code</span>
                  <span className="font-mono text-teal-brand font-bold">
                    {selectedWithdrawal.user?.inviteCode || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">VIP Tier & Status</span>
                  <span className="font-semibold text-white">
                    VIP {selectedWithdrawal.user?.vipLevel ?? 0} &bull;{' '}
                    <span className="uppercase text-emerald-400">{selectedWithdrawal.user?.status || 'active'}</span>
                  </span>
                </div>
              </div>

              {/* Wallet Balances Snapshot */}
              <div className="pt-2 border-t border-ocean-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-ocean-800/80 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Spendable Wallet Balance</span>
                  <span className="font-bold text-white">
                    {formatINR(selectedWithdrawal.user?.wallet?.availableBalance ?? 0)}
                  </span>
                </div>
                <div className="bg-ocean-800/80 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Total Withdrawn to Date</span>
                  <span className="font-bold text-teal-brand">
                    {formatINR(selectedWithdrawal.user?.wallet?.totalWithdrawn ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Destination Bank Coordinates */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-ocean-900" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Beneficiary Bank Coordinates
                  </span>
                </div>
                <StatusBadge status={selectedWithdrawal.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 block text-[11px]">Beneficiary Real Name</span>
                  <span className="font-bold text-ocean-900 text-sm">
                    {selectedWithdrawal.bankDetails?.realName}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">IFSC Code</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedWithdrawal.bankDetails?.ifsc, 'ifsc')}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                      title="Copy IFSC"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="font-mono font-bold text-teal-brand text-sm">
                    {selectedWithdrawal.bankDetails?.ifsc}
                  </span>
                </div>

                <div className="sm:col-span-2 bg-white p-2.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Bank Account Number</span>
                    <span className="font-mono font-black text-ocean-900 text-base tracking-wider">
                      {selectedWithdrawal.bankDetails?.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedWithdrawal.bankDetails?.accountNumber, 'acc')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'acc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Financial Settlement Breakdown */}
            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/60 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-600">Gross Amount Requested:</span>
                <span className="font-bold text-ocean-900">{formatINR(selectedWithdrawal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Handling Fee:</span>
                <span className="font-semibold text-slate-700">{formatINR(selectedWithdrawal.fee)}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-emerald-200">
                <span className="font-bold text-emerald-950">Net Amount to Dispatch:</span>
                <span className="font-black text-base text-emerald-700 font-display">
                  {formatINR(selectedWithdrawal.netAmount)}
                </span>
              </div>
            </div>

            {/* 4. Desk Input & Action Execution */}
            {selectedWithdrawal.status !== 'approved' && selectedWithdrawal.status !== 'rejected' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1">
                  <label className="font-bold text-ocean-900 block text-xs">
                    Bank Payout UTR Reference (Required to Mark as Paid)
                  </label>
                  <input
                    type="text"
                    value={payoutReference}
                    onChange={(e) => setPayoutReference(e.target.value)}
                    placeholder="e.g. IMPS20261122889944"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ocean-900 block text-xs">Desk Note / Rejection Reason</label>
                  <textarea
                    rows={2}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Notes visible to member..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
                  />
                </div>

                {actionMessage && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold text-xs">
                    {actionMessage}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction('approve')}
                    className="w-full py-2.5 rounded-xl bg-teal-brand hover:bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Dispatching...' : 'Confirm Dispatched & Mark Paid'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleAction('reject')}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject & Refund to Member</span>
                  </button>
                </div>
              </div>
            )}

            {selectedWithdrawal.status === 'approved' && (
              <div className="text-center py-2 text-xs text-slate-500 font-medium">
                Payout has been marked as <span className="font-bold uppercase text-emerald-700">PAID OUT</span>.
                {selectedWithdrawal.payoutReference && (
                  <span className="block mt-1 font-mono font-bold text-ocean-900">
                    Ref: {selectedWithdrawal.payoutReference}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
