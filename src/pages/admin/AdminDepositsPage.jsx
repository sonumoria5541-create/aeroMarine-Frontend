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
  Image as ImageIcon,
  ExternalLink,
  Maximize2,
  X,
  Cloud,
} from 'lucide-react';

const formatProofImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

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

  // Lightbox modal for full-screen screenshot inspection
  const [lightboxImageUrl, setLightboxImageUrl] = useState(null);

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
      dep.channel?.toLowerCase().includes(term) ||
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
            Audit member deposit receipts, verify Cloudinary payment screenshots, review UTRs, and credit wallet balances
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
              placeholder="Search UTR, phone, name, channel..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
            />
          </div>
          <button
            onClick={fetchDeposits}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-ocean-900 transition-colors flex-shrink-0 cursor-pointer"
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
            className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
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
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-teal-brand mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading deposit requests...</p>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <p className="text-xs text-slate-500 py-16 text-center">No deposit requests match this criteria.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDeposits.map((dep) => {
              const fullProofUrl = formatProofImageUrl(dep.proofUrl);
              const isCloudinary = dep.proofUrl && (dep.proofUrl.includes('cloudinary') || dep.proofUrl.includes('res.cloudinary.com'));

              return (
                <div
                  key={dep._id}
                  className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors text-xs"
                >
                  {/* Left Column: Full Member Details + Transaction Data + Screenshot Thumbnail */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-mono font-bold text-ocean-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {dep.requestId}
                      </span>
                      <StatusBadge status={dep.status} />

                      {/* Payment Channel Badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0077B6] border border-blue-200 truncate">
                        {dep.channel || dep.paymentMethod || 'Channel 1'}
                      </span>

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

                    {/* Payment Details & Screenshot Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-slate-600">
                        UTR:{' '}
                        <span className="font-mono font-bold text-teal-brand bg-teal-50/80 px-1.5 py-0.5 rounded border border-teal-200">
                          {dep.paymentReference || dep.utr}
                        </span>
                      </span>

                      {/* Screenshot Badge with Quick View */}
                      {fullProofUrl ? (
                        <button
                          type="button"
                          onClick={() => setLightboxImageUrl(fullProofUrl)}
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3 h-3 text-emerald-600" />
                          <span>View Proof Screenshot</span>
                          {isCloudinary && <Cloud className="w-3 h-3 text-sky-500 ml-0.5" title="Cloudinary Storage" />}
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          No Screenshot
                        </span>
                      )}
                    </div>

                    {dep.adminNote && (
                      <p className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200/50 p-1.5 rounded-lg">
                        <span className="font-bold text-amber-900">Desk Note:</span> {dep.adminNote}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Amount, Thumbnail Preview & Inspect Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                    {/* Small Screenshot Thumbnail on Desktop */}
                    {fullProofUrl && (
                      <div
                        onClick={() => setLightboxImageUrl(fullProofUrl)}
                        className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer hover:ring-2 hover:ring-teal-brand transition-all relative group shrink-0 hidden sm:block"
                        title="Click to enlarge screenshot"
                      >
                        <img
                          src={fullProofUrl}
                          alt="Proof"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    )}

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
              );
            })}
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
                <span className="text-slate-500 flex-shrink-0">Payment Channel:</span>
                <span className="font-bold text-xs text-[#0077B6] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  {selectedChannelOrMethod(selectedDeposit)}
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
                    className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
                    title="Copy UTR"
                  >
                    {copiedUtr ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Submission Date:</span>
                <span className="font-medium text-slate-700">{formatDate(selectedDeposit.createdAt)}</span>
              </div>
            </div>

            {/* 3. PAYMENT RECEIPT SCREENSHOT INSPECTION DOSSIER */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#0077B6]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Payment Proof Receipt
                  </span>
                </div>
                {selectedDeposit.proofUrl && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                    <CheckCircle2 size={12} />
                    <span>Receipt Uploaded</span>
                  </span>
                )}
              </div>

              {selectedDeposit.proofUrl ? (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-white max-h-72 flex items-center justify-center group">
                    <img
                      src={formatProofImageUrl(selectedDeposit.proofUrl)}
                      alt="Deposit Proof"
                      className="w-full h-auto max-h-72 object-contain cursor-zoom-in"
                      onClick={() => setLightboxImageUrl(formatProofImageUrl(selectedDeposit.proofUrl))}
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxImageUrl(formatProofImageUrl(selectedDeposit.proofUrl))}
                      className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Maximize2 size={12} />
                      <span>Enlarge / Zoom</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="truncate">
                      {selectedDeposit.proofPublicId ? `ID: ${selectedDeposit.proofPublicId}` : 'Screenshot Receipt'}
                    </span>
                    <a
                      href={formatProofImageUrl(selectedDeposit.proofUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0077B6] hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Open in New Tab</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-amber-600" />
                  <span>No payment screenshot proof was uploaded for this legacy request.</span>
                </div>
              )}
            </div>

            {/* 4. Operations Note Input */}
            <div className="space-y-1">
              <label className="font-bold text-ocean-900 block text-xs">Operations Note / Rejection Reason</label>
              <textarea
                rows={2}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="e.g. Verified HDFC Bank credit statement matching UTR at 14:32"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            {actionMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-semibold text-xs">
                {actionMessage}
              </div>
            )}

            {/* 5. Action Buttons */}
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

      {/* FULL-SCREEN LIGHTBOX MODAL FOR HIGH-RES RECEIPT AUDITING */}
      {lightboxImageUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col items-center relative">
            {/* Top Close bar */}
            <div className="w-full flex items-center justify-between text-white pb-3 px-2">
              <span className="text-xs font-bold tracking-wide">
                Payment Proof Receipt Inspection (High Resolution)
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Open Original Image"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Open Original</span>
                </a>
                <button
                  onClick={() => setLightboxImageUrl(null)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Lightbox Image Container */}
            <div
              className="w-full overflow-auto max-h-[80vh] flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImageUrl}
                alt="Enlarged Receipt"
                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for Channel display
function selectedChannelOrMethod(dep) {
  if (dep?.channel && dep.channel.trim()) return dep.channel;
  if (dep?.paymentMethod && dep.paymentMethod.trim()) return dep.paymentMethod;
  return 'Channel 1 (VIP Fast UPI)';
}
