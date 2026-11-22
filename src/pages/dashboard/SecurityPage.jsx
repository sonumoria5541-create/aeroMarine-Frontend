import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';

export const SecurityPage = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (res.data?.status === 'success') {
        showToast('Password updated successfully!', 'success');
        setShowModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.data?.message || 'Error updating password', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update password', 'error');
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

      {/* Top Header */}
      <div className="bg-[#0B2545] px-4 py-3.5 text-white flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        <h1 className="text-sm font-black tracking-wide">Security</h1>
        <div className="w-12"></div>
      </div>

      {/* Tabs */}
      <div className="p-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-white text-[#0B2545] shadow-sm font-black"
          >
            Login Password
          </button>
          <Link
            to="/about"
            className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 text-center transition-colors"
          >
            About Us
          </Link>
        </div>
      </div>

      {/* Password Status Card */}
      <div className="p-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0077B6] flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Login Password</h3>
                <p className="text-[11px] text-slate-400">Used to sign in to your account</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            This is the password you use to sign in with your phone number. Change it any time you feel it is no longer private.
          </p>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all"
          >
            Change Password
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-400">
            <div>• Minimum 6 characters</div>
            <div>• Your phone number stays the same for login</div>
            <div>• Never share this password with anyone</div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900 text-center mb-1">
              Change Login Password
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Used to sign in to your account
            </p>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Current password
                </label>
                <div className="flex items-center h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#0077B6]">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="flex-1 bg-transparent border-0 outline-none text-xs font-semibold text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="p-1 text-slate-400"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  New password
                </label>
                <div className="flex items-center h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#0077B6]">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="flex-1 bg-transparent border-0 outline-none text-xs font-semibold text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="p-1 text-slate-400"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Confirm new password
                </label>
                <div className="flex items-center h-12 px-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#0077B6]">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="flex-1 bg-transparent border-0 outline-none text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center mt-3"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
