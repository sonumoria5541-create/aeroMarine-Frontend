import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ArrowDownLeft,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  History,
  ShieldCheck,
  Building2,
  QrCode,
  Clock,
} from 'lucide-react';

export const DepositPage = () => {
  const { wallet, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' | 'history'

  const [amount, setAmount] = useState(5000);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentReference, setPaymentReference] = useState('');
  const [proofFile, setProofFile] = useState(null);

  const [copiedField, setCopiedField] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const [deposits, setDeposits] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Bank & UPI details
  const bankDetails = {
    bankName: 'HDFC Bank Ltd',
    accountHolder: 'AeroMarine Fleet Escrow India',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0001234',
    branch: 'Port Complex Nariman Point, Mumbai',
    upiId: 'aeromarine@icici',
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get('/deposits');
      if (res.data?.success) {
        setDeposits(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentReference.trim()) {
      setErrorNotice('Bank / UPI payment reference (UTR) is required.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorNotice('');
      setSuccessNotice('');

      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('paymentMethod', paymentMethod);
      formData.append('paymentReference', paymentReference.trim());
      formData.append('idempotencyKey', `dep_${Date.now()}_${Math.random()}`);
      if (proofFile) {
        formData.append('proofFile', proofFile);
      }

      const res = await api.post('/deposits', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setSuccessNotice(
          'Deposit request submitted successfully! Your request is currently PENDING operations verification. Available balance will update once approved.'
        );
        setPaymentReference('');
        setProofFile(null);
        await refreshUser();
      }
    } catch (err) {
      setErrorNotice(err.response?.data?.message || 'Failed to submit deposit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Deposit Wallet Funds</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manual Bank / UPI Transfer with Double-Entry Ledger Verification
          </p>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'deposit' ? 'bg-white text-ocean-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Submit Deposit
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history' ? 'bg-white text-ocean-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Deposit History
          </button>
        </div>
      </div>

      {activeTab === 'deposit' ? (
        <div className="space-y-8">
          {/* Bank Instructions Card */}
          <div className="bg-ocean-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-ocean-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-ocean-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-brand" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-teal-brand">
                  Official Transfer Coordinates
                </h3>
              </div>
              <span className="text-[11px] bg-ocean-800 px-2.5 py-0.5 rounded text-slate-300 font-mono">
                IMPS / NEFT / UPI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-ocean-800/80 p-3.5 rounded-xl border border-ocean-700/80 space-y-1">
                <span className="text-slate-400">Bank Name</span>
                <p className="font-bold text-white text-sm">{bankDetails.bankName}</p>
              </div>

              <div className="bg-ocean-800/80 p-3.5 rounded-xl border border-ocean-700/80 space-y-1">
                <span className="text-slate-400">Account Holder</span>
                <p className="font-bold text-white text-sm">{bankDetails.accountHolder}</p>
              </div>

              <div className="bg-ocean-800/80 p-3.5 rounded-xl border border-ocean-700/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Account Number</span>
                  <span className="font-mono font-bold text-white text-sm">{bankDetails.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankDetails.accountNumber, 'acc')}
                  className="p-2 rounded-lg bg-ocean-700 hover:bg-teal-brand text-white transition-colors"
                  title="Copy Account Number"
                >
                  {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-ocean-800/80 p-3.5 rounded-xl border border-ocean-700/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">IFSC Code</span>
                  <span className="font-mono font-bold text-white text-sm">{bankDetails.ifscCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankDetails.ifscCode, 'ifsc')}
                  className="p-2 rounded-lg bg-ocean-700 hover:bg-teal-brand text-white transition-colors"
                  title="Copy IFSC Code"
                >
                  {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="sm:col-span-2 bg-ocean-800/80 p-3.5 rounded-xl border border-ocean-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="w-6 h-6 text-teal-brand" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Instant UPI ID</span>
                    <span className="font-mono font-bold text-white text-sm">{bankDetails.upiId}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankDetails.upiId, 'upi')}
                  className="px-3 py-1.5 rounded-lg bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {copiedField === 'upi' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Deposit Submission Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ocean-900">Transfer Amount (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-base font-bold text-ocean-900 font-display focus:outline-none focus:border-teal-brand"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  {[2000, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      +{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ocean-900">Transfer Channel</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
                  >
                    <option value="upi">UPI Transfer (GooglePay, PhonePe, Paytm)</option>
                    <option value="bank_transfer">IMPS / NEFT Net Banking</option>
                    <option value="demo_transfer">Demo Sandbox Mock Transfer</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ocean-900">UTR / Bank Reference Number</label>
                  <input
                    type="text"
                    required
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="e.g. 202604889922 or UPI Ref"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-teal-brand"
                  />
                </div>
              </div>

              {/* File upload proof */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ocean-900">Payment Advice / Receipt Screenshot (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-teal-brand/60 transition-colors">
                  <input
                    type="file"
                    id="proofUpload"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => setProofFile(e.target.files[0] || null)}
                    className="hidden"
                  />
                  <label htmlFor="proofUpload" className="cursor-pointer space-y-1 block">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-xs font-semibold text-teal-brand block">
                      {proofFile ? proofFile.name : 'Upload bank payment advice (JPG, PNG, PDF up to 5MB)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Critical Rule Notice */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-950 font-bold mb-0.5">Strict Financial Verification:</strong>
                  Submitting this request alerts our operations desk via Resend. Available balance will{' '}
                  <strong>NOT</strong> increase immediately. Your wallet balance is credited only after bank settlement is
                  verified.
                </div>
              </div>

              {errorNotice && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                  {errorNotice}
                </p>
              )}

              {successNotice && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  {successNotice}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-teal-brand hover:bg-teal-hover disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>{submitting ? 'Transmitting Request...' : `Submit Deposit of ${formatINR(amount)}`}</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-ocean-900 text-base">Your Deposit Requests</h3>
            <button
              onClick={fetchHistory}
              className="text-xs font-semibold text-teal-brand hover:underline flex items-center gap-1"
            >
              <span>Refresh</span>
            </button>
          </div>

          {loadingHistory ? (
            <p className="text-xs text-slate-500 py-8 text-center">Loading deposit records...</p>
          ) : deposits.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No deposit requests submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {deposits.map((dep) => (
                <div
                  key={dep._id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-ocean-900">{dep.requestId}</span>
                      <StatusBadge status={dep.status} />
                    </div>
                    <p className="text-slate-500">
                      Method: <span className="font-semibold uppercase">{dep.paymentMethod}</span> &bull; Reference:{' '}
                      <span className="font-mono font-semibold">{dep.paymentReference}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">{formatDate(dep.createdAt)}</p>
                    {dep.adminNote && (
                      <p className="text-[11px] font-medium text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                        Note: {dep.adminNote}
                      </p>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="font-black text-lg text-ocean-900 font-display block">
                      {formatINR(dep.amount)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {dep.status === 'approved' ? 'Credited to Ledger' : 'Awaiting Settlement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
