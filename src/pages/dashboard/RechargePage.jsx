import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle2, X, QrCode, Copy, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const PRESET_AMOUNTS = [720, 285, 520, 1000, 2000, 4785];

export const RechargePage = () => {
  const navigate = useNavigate();
  const { wallet, refreshUser } = useAuth();

  const [amount, setAmount] = useState('720');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [utr, setUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const officialUpiId = 'aeromarine.cargo@okhdfcbank';

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(officialUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleContinue = () => {
    const num = Number(amount);
    if (!num || num < 250) {
      showToast('Minimum recharge amount is ₹250', 'error');
      return;
    }
    setShowChannelModal(true);
  };

  const handleConfirmChannel = () => {
    setShowChannelModal(false);
    setShowPaymentStep(true);
  };

  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    if (!utr || utr.trim().length < 6) {
      showToast('Please enter a valid 12-digit UTR reference number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/wallet/recharge', {
        amount: Number(amount),
        channel: 'Channel A Online (UPI/QR)',
        utr: utr.trim(),
      });

      if (res.data?.status === 'success') {
        showToast(res.data.message || 'Recharge submitted successfully!', 'success');
        setShowPaymentStep(false);
        setUtr('');
        await refreshUser();
        setTimeout(() => navigate('/profit?tab=recharge'), 1500);
      } else {
        showToast(res.data?.message || 'Error submitting recharge', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error processing recharge request', 'error');
    } finally {
      setSubmitting(false);
    }
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
          <span className="text-sm font-black tracking-wide">Recharge</span>
          <Link
            to="/profit?tab=recharge"
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200"
          >
            Records
          </Link>
        </div>

        {/* Current Balance Display */}
        <div className="text-center my-2">
          <div className="text-xs text-blue-200">Recharge Balance</div>
          <div className="text-3xl font-black text-white mt-0.5">
            ₹{wallet?.rechargeBalance ?? 0}
          </div>
        </div>

        {/* Recharge / Withdraw Toggle Switcher */}
        <div className="flex bg-white/10 p-1 rounded-2xl max-w-[260px] mx-auto mt-4 border border-white/10">
          <button
            type="button"
            className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-white text-[#0B2545] shadow-sm"
          >
            Recharge
          </button>
          <Link
            to="/withdraw"
            className="flex-1 py-1.5 rounded-xl text-xs font-bold text-blue-200 hover:text-white text-center transition-colors"
          >
            Withdraw
          </Link>
        </div>
      </div>

      {/* Enter Amount Card */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">Enter amount</span>
            <span className="text-[11px] text-slate-400">Tap a quick amount below</span>
          </div>

          {/* Amount Input with Clear button */}
          <div className="flex items-center h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <span className="text-lg font-black text-slate-800 mr-2">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent border-0 outline-none text-xl font-black text-slate-900 placeholder:text-slate-300"
            />
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="p-1 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Minimum recharge ₹250
          </div>

          {/* Quick Preset Amount Chips */}
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt.toString())}
                className={`py-3 rounded-2xl text-xs font-bold border transition-all active:scale-95 ${
                  amount === amt.toString()
                    ? 'border-[#0077B6] bg-cyan-50 text-[#0077B6] shadow-sm font-black'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ₹ {amt.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-sm font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all mt-2"
          >
            Continue ₹ {amount || 0}
          </button>
        </div>
      </div>

      {/* How It Works Instructions */}
      <div className="px-4 mt-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900">How it works</h3>

          <div className="space-y-2.5 pt-1 text-slate-600">
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <span>Minimum deposit amount is ₹250.</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <span>Pay and submit within the given time window.</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <span>Your balance is credited automatically once payment is confirmed.</span>
            </div>
            <div className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <span>For any payment issue, contact 24×7 customer support.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Selection Bottom Drawer Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom">
            <button
              onClick={() => setShowChannelModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900">Confirm recharge</h3>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Pick a channel and complete the payment
            </p>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-4">
              <div>
                <div className="text-[11px] text-slate-400">You are adding</div>
                <div className="text-2xl font-black text-slate-900">₹ {amount}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowChannelModal(false)}
                className="text-xs font-bold text-[#0077B6] px-3 py-1 bg-cyan-50 rounded-lg"
              >
                Edit
              </button>
            </div>

            {/* Channel Options */}
            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold text-slate-700">Payment channel</div>
              <div className="p-3.5 rounded-2xl border-2 border-[#0077B6] bg-cyan-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0077B6] text-white flex items-center justify-center">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Channel A Online</div>
                    <div className="text-[11px] text-slate-500">Fast UPI Intent & QR • 0% Fee</div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-[#0077B6] bg-white"></div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmChannel}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all"
            >
              Pay ₹ {amount}
            </button>

            <div className="mt-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Payments are processed on a secure gateway</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Step / UTR Submission Modal */}
      {showPaymentStep && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[400px] bg-white rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPaymentStep(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-4">
              <div className="text-xs uppercase font-extrabold tracking-wider text-cyan-600 mb-0.5">
                Scan & Pay UPI
              </div>
              <h3 className="text-base font-black text-slate-900">
                Deposit ₹{amount}
              </h3>
            </div>

            {/* QR Mockup */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center mb-4">
              <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center">
                <QrCode size={130} className="text-[#0B2545]" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Scan with GPay, PhonePe, Paytm, or BHIM
              </p>
            </div>

            {/* UPI ID Copy Field */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-slate-500">Official AeroMarine UPI ID:</label>
              <div className="mt-1 flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-mono font-bold text-slate-800">{officialUpiId}</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0077B6] text-xs font-bold flex items-center gap-1"
                >
                  {copiedUpi ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* UTR Input Form */}
            <form onSubmit={handleSubmitUtr} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700">
                  Enter 12-Digit UTR / Transaction ID:
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                  placeholder="e.g. 432109876543"
                  className="w-full mt-1 h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0077B6] text-sm font-mono font-bold text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Submit UTR Reference'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
