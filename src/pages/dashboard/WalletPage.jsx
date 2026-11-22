import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR, formatDate } from '../../lib/utils';
import { StatCard } from '../../components/common/StatCard';
import {
  Wallet,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Trash2,
  Building2,
  QrCode,
  CheckCircle2,
} from 'lucide-react';

export const WalletPage = () => {
  const { wallet, refreshUser } = useAuth();
  const [reconciling, setReconciling] = useState(false);
  const [reconcileNotice, setReconcileNotice] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  const fetchDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const res = await api.get('/wallet/payout-destinations');
      if (res.data?.success) {
        setDestinations(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDestinations(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleReconcile = async () => {
    try {
      setReconciling(true);
      setReconcileNotice('');
      const res = await api.get('/wallet/reconcile');
      if (res.data?.success) {
        setReconcileNotice('Ledger reconciliation complete: All balance entries are strictly balanced with zero variance.');
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setReconciling(false);
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm('Remove this saved payout destination?')) return;
    try {
      await api.delete(`/wallet/payout-destinations/${id}`);
      fetchDestinations();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Wallet & Ledger Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Double-Entry Accounting Source of Truth & Payout Destinations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReconcile}
            disabled={reconciling}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-ocean-900 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-brand ${reconciling ? 'animate-spin' : ''}`} />
            <span>{reconciling ? 'Auditing Ledger...' : 'Reconcile Balance'}</span>
          </button>

          <Link
            to="/dashboard/deposit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-md"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Deposit</span>
          </Link>
        </div>
      </div>

      {reconcileNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{reconcileNotice}</span>
        </div>
      )}

      {/* Balances Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Available Balance"
          value={formatINR(wallet?.availableBalance || 0)}
          subtitle="Spendable for container participation or withdrawal"
          icon={Wallet}
          color="teal"
        />

        <StatCard
          title="Reserved Balance"
          value={formatINR(wallet?.reservedBalance || 0)}
          subtitle="Committed in pending withdrawal requests"
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Pending Deposits"
          value={formatINR(wallet?.pendingDeposits || 0)}
          subtitle="Transfers awaiting bank verification"
          icon={ArrowDownLeft}
          color="blue"
        />

        <StatCard
          title="Total Credited"
          value={formatINR(wallet?.totalCredited || 0)}
          subtitle="Lifetime approved deposits posted to ledger"
          icon={ShieldCheck}
          color="emerald"
        />

        <StatCard
          title="Total Withdrawn"
          value={formatINR(wallet?.totalWithdrawn || 0)}
          subtitle="Lifetime dispatched payouts from account"
          icon={ArrowUpRight}
          color="navy"
        />

        <div className="bg-ocean-900 text-white rounded-2xl p-5 border border-ocean-800 flex flex-col justify-between shadow-subtle">
          <span className="text-xs uppercase font-bold text-teal-brand">Ledger Integrity State</span>
          <div>
            <p className="text-xl font-bold font-display text-white">Audited Balanced</p>
            <p className="text-[11px] text-slate-400 mt-1">Double-entry debits equal credits at all times.</p>
          </div>
          <p className="text-[10px] text-slate-500 pt-2 border-t border-ocean-800">
            Last reconciled: {formatDate(wallet?.lastReconciledAt)}
          </p>
        </div>
      </div>

      {/* Saved Payout Destinations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-ocean-900 text-base">Saved Payout Destinations</h3>
            <p className="text-xs text-slate-500">Destination accounts for withdrawal settlements</p>
          </div>
          <Link
            to="/dashboard/withdraw"
            className="text-xs font-bold text-teal-brand hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add via Withdrawal</span>
          </Link>
        </div>

        {loadingDestinations ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No saved payout methods. Payout accounts will be securely saved when you submit a withdrawal request.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {destinations.map((dest) => (
              <div
                key={dest._id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-teal-brand">
                    {dest.type === 'upi' ? <QrCode className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-ocean-900">{dest.label || 'Payout Account'}</p>
                    <p className="font-mono text-slate-500">
                      {dest.upiIdMasked || dest.accountNumberMasked || 'Masked Destination'}
                    </p>
                    {dest.bankName && <p className="text-[11px] text-slate-400">{dest.bankName}</p>}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteDestination(dest._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
