import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export const BankCardPage = () => {
  const navigate = useNavigate();
  const { bankAccount, refreshUser } = useAuth();

  const [realName, setRealName] = useState(bankAccount?.realName || '');
  const [ifsc, setIfsc] = useState(bankAccount?.ifsc || '');
  const [accountNumber, setAccountNumber] = useState(bankAccount?.accountNumber || '');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!realName.trim() || !ifsc.trim() || !accountNumber.trim()) {
      showToast('Please fill in all bank details', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/bank', {
        realName: realName.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
      });

      if (res.data?.status === 'success') {
        showToast('Bank details saved successfully!', 'success');
        await refreshUser();
        setTimeout(() => navigate(-1), 1500);
      } else {
        showToast(res.data?.message || 'Failed to save bank details', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating bank details', 'error');
    } finally {
      setLoading(false);
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
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] px-4 pt-4 pb-12 text-white rounded-b-[36px] shadow-lg shadow-blue-950/20">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-semibold">Back</span>
          </button>
          <span className="text-sm font-black tracking-wide">Bank Account</span>
          <div className="w-12"></div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-2 border border-cyan-400/30">
            <CreditCard size={24} />
          </div>
          <h2 className="text-base font-black text-white">Update your details</h2>
          <p className="text-xs text-blue-200 mt-0.5">Bank account for withdrawals</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <form onSubmit={handleSave} className="space-y-4">
            {/* Real Name */}
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                Real Name
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="Enter your real name"
                className="w-full h-13 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0077B6] focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm font-semibold text-slate-900 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                placeholder="e.g. HDFC0001234"
                className="w-full h-13 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0077B6] focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm font-mono font-bold text-slate-900 transition-all placeholder:text-slate-400 uppercase"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter account number"
                className="w-full h-13 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#0077B6] focus:ring-2 focus:ring-cyan-500/20 outline-none text-sm font-mono font-bold text-slate-900 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            {/* Advisory Notice */}
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              You can update your withdrawal account anytime — as many times as you like. Just make sure the details are correct before saving.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Details'
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Your details are encrypted & secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
