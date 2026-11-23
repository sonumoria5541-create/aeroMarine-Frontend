import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Settings,
  Wallet,
  ArrowUpRight,
  CreditCard,
  User,
  Shield,
  FileText,
  Bell,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Ship,
  X,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const AVATAR_OPTIONS = [
  'av1', 'av2', 'av3', 'av4', 'av5', 'av6',
  'av7', 'av8', 'av9', 'av10', 'av11', 'av12'
];

export const ProfilePage = () => {
  const { user, wallet, logout, refreshUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'av1');
  const [savingAvatar, setSavingAvatar] = useState(false);

  const maskPhone = (phone) => {
    if (!phone || phone.length < 7) return phone || '700***2845';
    return `${phone.slice(0, 3)}***${phone.slice(-4)}`;
  };

  const handleSaveAvatar = async () => {
    setSavingAvatar(true);
    try {
      await api.post('/auth/avatar', { avatar: selectedAvatar });
      await refreshUser();
      setShowAvatarModal(false);
    } catch (e) {
      console.error('Error saving avatar:', e);
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleConfirmLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-10">
      {/* Top Header */}
      <div className="bg-[#0B2545] px-4 pt-4 pb-2 text-white flex items-center justify-between">
        <h1 className="text-base font-black tracking-wide">Profile</h1>
        <Link
          to="/pass"
          className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </Link>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] px-5 pt-3 pb-12 text-white rounded-b-[36px] shadow-lg shadow-blue-950/20">
        <div className="flex items-center gap-3.5 mb-5">
          {/* Avatar with edit button */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] p-1 shadow-lg ring-2 ring-cyan-300/30 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#0B2545]">
                <Ship size={28} className="text-[#0077B6]" />
              </div>
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md hover:bg-amber-400 active:scale-95 transition-all"
              title="Change photo"
            >
              <Camera size={12} />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-white">
                {maskPhone(user?.phone)}
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                VIP{user?.vipLevel ?? 1}
              </span>
            </div>
            <div className="text-[11px] text-blue-200/80 mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-cyan-300" />
              <span>Verified Fleet Partner</span>
            </div>
          </div>
        </div>

        {/* 3 Balance Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-base font-black text-white">₹{wallet?.availableBalance ?? 0}</div>
            <div className="text-[10px] text-blue-200 mt-0.5">Available Balance</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-base font-black text-cyan-300">₹{wallet?.rechargeBalance ?? 0}</div>
            <div className="text-[10px] text-blue-200 mt-0.5">Recharge Balance</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-base font-black text-emerald-300">₹{wallet?.totalIncome ?? 0}</div>
            <div className="text-[10px] text-blue-200 mt-0.5">Total Income</div>
          </div>
        </div>
      </div>

      {/* 3 Quick Action Buttons */}
      <div className="px-4 -mt-6">
        <div className="bg-white p-3.5 rounded-2xl shadow-md border border-slate-100 grid grid-cols-3 gap-3 text-center">
          {/* Recharge */}
          <Link to="/recharge" className="flex flex-col items-center group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0B2545] to-[#0077B6] text-white flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
              <Wallet size={20} className="text-cyan-200" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Recharge</span>
          </Link>

          {/* Withdraw */}
          <Link to="/withdraw" className="flex flex-col items-center group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
              <ArrowUpRight size={20} className="text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Withdraw</span>
          </Link>

          {/* Bank Card */}
          <Link to="/bank" className="flex flex-col items-center group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
              <CreditCard size={20} className="text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Bank Card</span>
          </Link>
        </div>
      </div>

      {/* "More services" List */}
      <div className="px-4 mt-5 space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
          More Services
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
          {/* Personal Information */}
          <Link
            to="/pass"
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="text-xs font-bold text-slate-800">Personal Information / Security</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* Balance Details */}
          <Link
            to="/profit?tab=all"
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="text-xs font-bold text-slate-800">Balance Details</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* Withdrawal Details */}
          <Link
            to="/profit?tab=withdraw"
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight size={18} />
              </div>
              <span className="text-xs font-bold text-slate-800">Withdrawal Details</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* Notification Center */}
          <Link
            to="/messages"
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <span className="text-xs font-bold text-slate-800">Notification Center</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* About AeroMarine */}
          <Link
            to="/about"
            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
                <Ship size={18} />
              </div>
              <span className="text-xs font-bold text-slate-800">About AeroMarine</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </Link>

          {/* Admin Control Center Link (if admin) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-between p-3.5 bg-cyan-50/50 hover:bg-cyan-50 transition-colors text-[#0077B6]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0077B6] text-white flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="text-xs font-black">Admin Management Panel</span>
              </div>
              <ChevronRight size={16} />
            </Link>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-rose-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <span className="text-xs font-bold text-rose-600">Logout</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[360px] bg-white rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <LogOut size={24} />
            </div>

            <h3 className="text-base font-black text-slate-900">Log out of your account?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              You will need your phone number and password to sign back in.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-semibold mb-5">
              {maskPhone(user?.phone)} • Signed in
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/20 active:scale-95 transition-all"
              >
                Yes, log me out
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Stay signed in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Photo Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black text-slate-900 text-center mb-1">
              Choose your photo
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Pick an avatar, then tap Save
            </p>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {AVATAR_OPTIONS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${
                    selectedAvatar === av
                      ? 'border-[#0077B6] bg-cyan-50 shadow-md ring-2 ring-cyan-500/20 scale-105'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Ship size={24} className={selectedAvatar === av ? 'text-[#0077B6]' : 'text-slate-400'} />
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={savingAvatar}
              onClick={handleSaveAvatar}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-70"
            >
              {savingAvatar ? 'Saving...' : 'Save photo'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
