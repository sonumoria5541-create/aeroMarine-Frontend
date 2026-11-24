import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle2, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export const WithdrawPage = () => {
  const navigate = useNavigate();
  const { wallet, bankAccount, refreshUser } = useAuth();

  const available = wallet?.availableBalance ?? 0;
  const [amount, setAmount] = useState('');
  const [minWithdrawal, setMinWithdrawal] = useState(200);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const res = await api.get('/settings/limits');
        if (res.data?.success && res.data.data?.minWithdrawal != null) {
          setMinWithdrawal(Number(res.data.data.minWithdrawal));
        }
      } catch (err) {
        // Fall back gracefully to 200
      }
    };
    fetchLimits();
  }, []);

  const numAmount = Number(amount) || 0;
  const fee = Math.round(numAmount * 0.10);
  const receiveAmount = Math.max(0, numAmount - fee);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handlePercentage = (pct) => {
    if (available <= 0) {
      setAmount('0');
      return;
    }
    const calculated = Math.floor(available * (pct / 100));
    setAmount(calculated.toString());
  };

  const handleContinue = () => {
    if (!bankAccount?.isBound || !bankAccount?.accountNumber) {
      showToast('Please add a bank account in Profile -> Bank Card first', 'error');
      return;
    }

    if (numAmount < minWithdrawal) {
      showToast(`Minimum withdrawal amount is ₹${minWithdrawal}`, 'error');
      return;
    }

    if (numAmount > available) {
      showToast(`Insufficient balance. Maximum withdrawable is ₹${available}`, 'error');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmWithdraw = async () => {
    setSubmitting(true);
    try {
      const res = await api.post('/wallet/withdraw', { amount: numAmount });
      if (res.data?.status === 'success') {
        showToast(res.data.message || 'Withdrawal submitted successfully!', 'success');
        setShowConfirmModal(false);
        setAmount('');
        await refreshUser();
        setTimeout(() => navigate('/profit?tab=withdraw'), 1500);
      } else {
        showToast(res.data?.message || 'Error processing withdrawal', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting withdrawal request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const maskAccount = (num) => {
    if (!num || num.length < 5) return num;
    return `${num.slice(0, 3)}****${num.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-10">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top ${
            toastType === 'success' ? 'bg-[#0077B6]' : 'bg-rose-600'
          }`}
        >
          {toastType === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] px-4 pt-4 pb-8 text-white rounded-b-[36px] shadow-lg shadow-blue-950/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-semibold">Back</span>
          </button>
          <span className="text-sm font-black tracking-wide">Withdraw</span>
          <Link
            to="/profit?tab=withdraw"
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200"
          >
            Records
          </Link>
        </div>

        {/* Available Withdrawable Balance */}
        <div className="text-center my-2">
          <div className="text-xs text-blue-200">Withdrawable Balance</div>
          <div className="text-3xl font-black text-cyan-300 mt-0.5">
            ₹{available.toFixed(2)}
          </div>
        </div>

        {/* Switcher */}
        <div className="flex bg-white/10 p-1 rounded-2xl max-w-[260px] mx-auto mt-4 border border-white/10">
          <Link
            to="/recharge"
            className="flex-1 py-1.5 rounded-xl text-xs font-bold text-blue-200 hover:text-white text-center transition-colors"
          >
            Recharge
          </Link>
          <button
            type="button"
            className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-white text-[#0B2545] shadow-sm"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Bank Account Card */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-800">Bank Account</span>
            <Link
              to="/bank"
              className="text-xs font-bold text-[#0077B6] hover:underline"
            >
              {bankAccount?.isBound ? 'Change' : 'Add'}
            </Link>
          </div>

          {bankAccount?.isBound && bankAccount?.accountNumber ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">{bankAccount.realName}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {maskAccount(bankAccount.accountNumber)} • {bankAccount.ifsc}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                Bound
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-center">
              <p className="text-xs text-amber-800 font-medium">
                You haven't added a bank account yet. Add one to receive your withdrawals.
              </p>
              <Link
                to="/bank"
                className="inline-block mt-2 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-sm"
              >
                Add bank account
              </Link>
            </div>
          )}
        </div>

        {/* Enter Amount Card */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">Enter amount</span>
            <span className="text-[11px] text-slate-400">Withdrawable ₹{available.toFixed(2)}</span>
          </div>

          {/* Amount input */}
          <div className="flex items-center h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <span className="text-lg font-black text-slate-800 mr-2">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent border-0 outline-none text-xl font-black text-slate-900 placeholder:text-slate-300"
            />
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Minimum withdrawal ₹{minWithdrawal}
          </div>

          {/* Percentage Presets */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentage(pct)}
                className="py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 active:scale-95 transition-all"
              >
                {pct === 100 ? 'Max' : `${pct}%`}
              </button>
            ))}
          </div>

          {/* Live Calculation Breakdown */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Withdraw amount:</span>
              <span className="font-bold text-slate-900">₹ {numAmount}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Service tax / Fee:</span>
              <span className="font-bold">− 10% (₹{fee})</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-900 font-extrabold">
              <span>You receive:</span>
              <span className="text-[#0077B6] font-black">₹ {receiveAmount}</span>
            </div>
          </div>

          {/* Continue Action Button */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-sm font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all"
          >
            Continue ₹ {numAmount}
          </button>
        </div>

        {/* Withdrawal Instructions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900">Withdrawal instructions</h3>

          <div className="space-y-2.5 pt-1 text-slate-600">
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <span>Minimum withdrawal amount is ₹{minWithdrawal}.</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <span>A 10.00% service tax is deducted from every transaction.</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <span>Withdrawal time: 06:00 - 19:00 daily.</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <span>Funds usually arrive within 30 minutes (max 24 hours).</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                5
              </span>
              <span>Ensure your bank details are correct to avoid failed payments.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Withdrawal Bottom Drawer Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900">Confirm withdrawal</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Check the details and confirm payout
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] text-slate-400">You receive</div>
                <div className="text-2xl font-black text-[#0077B6]">₹ {receiveAmount}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-xs font-bold text-[#0077B6] px-3 py-1 bg-cyan-50 rounded-lg"
              >
                Edit
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-5">
              <div className="flex justify-between">
                <span>Withdraw amount:</span>
                <span className="font-bold text-slate-800">₹ {numAmount}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Fee:</span>
                <span className="font-bold">− ₹ {fee}</span>
              </div>
              <div className="flex justify-between">
                <span>Payout destination:</span>
                <span className="font-bold text-slate-800">
                  {bankAccount?.realName} ({maskAccount(bankAccount?.accountNumber)})
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmWithdraw}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                `Withdraw ₹ ${numAmount}`
              )}
            </button>

            <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Requests are reviewed before payout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
