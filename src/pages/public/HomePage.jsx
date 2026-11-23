import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Ship,
  Anchor,
  Wallet,
  ArrowUpRight,
  Share2,
  Headset,
  Volume2,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { AeroMarineLogo } from '../../components/common/AeroMarineLogo';
import { ShipVisualCard } from '../../components/common/ShipVisualCard';

export const HomePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();

  const [activeTab, setActiveTab] = useState('regular'); // 'regular' or 'welfare'
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [buying, setBuying] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // Check if announcement modal was shown in this session
  useEffect(() => {
    const seen = sessionStorage.getItem('aeromarine_notice_seen');
    if (!seen) {
      setShowNoticeModal(true);
      sessionStorage.setItem('aeromarine_notice_seen', 'true');
    }
  }, []);

  // Fetch plans (attaches user's purchased quota count when authenticated)
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/plans?category=${activeTab}`);
      if (res.data?.status === 'success') {
        setPlans(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans, user]);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleBuyClick = (plan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
  };

  const handleConfirmBuy = async () => {
    if (!selectedPlan) return;
    setBuying(true);
    try {
      const res = await api.post('/plans/buy', { planId: selectedPlan._id });
      if (res.data?.status === 'success') {
        showToast(res.data.message || 'Lease activated successfully!', 'success');
        const updatedCount = res.data?.purchasedCount ?? ((selectedPlan.purchasedCount || 0) + 1);
        setPlans((prev) =>
          prev.map((p) =>
            p._id === selectedPlan._id
              ? { ...p, purchasedCount: updatedCount }
              : p
          )
        );
        setSelectedPlan(null);
        await refreshUser();
        fetchPlans();
      } else {
        showToast(res.data?.message || 'Failed to lease plan', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Error processing lease', 'error');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-6">
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

      {/* Top App Header */}
      <div className="bg-[#0B2545] px-4 pt-3 pb-4 text-white flex items-center justify-between shadow-md">
        <AeroMarineLogo size={36} variant="horizontal" theme="dark" />

        <div className="flex items-center gap-2">
          {/* Customer support trigger */}
          <button
            onClick={() => outletContext?.openSupport()}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Customer Support"
          >
            <Headset size={18} />
          </button>
        </div>
      </div>

      {/* Banner Carousel Card */}
      <div className="px-4 pt-3">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0077B6] text-white p-5 shadow-lg shadow-blue-950/20">
          <div className="absolute -right-6 -bottom-8 opacity-15">
            <Ship size={140} />
          </div>
          <div className="relative z-10">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-cyan-300/30">
              Fleet Leasing Program
            </div>
            <h2 className="text-lg font-black leading-tight text-white drop-shadow">
              Global Cargo Container Yields
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-[260px]">
              Earn daily automated payouts from international ocean freight routes.
            </p>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-cyan-200 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-cyan-300" />
                100% Insured
              </span>
              <span>•</span>
              <span>Daily Payouts</span>
              <span>•</span>
              <span>0% Platform Fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Cards */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-2.5 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100">
          {/* 1. Recharge */}
          <Link to="/recharge" className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B2545] to-[#0077B6] text-white flex items-center justify-center shadow-md shadow-blue-900/20 group-active:scale-95 transition-transform">
              <Wallet size={22} className="text-cyan-200" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Recharge</span>
          </Link>

          {/* 2. Withdraw */}
          <Link to="/withdraw" className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center shadow-md shadow-cyan-900/20 group-active:scale-95 transition-transform">
              <ArrowUpRight size={22} className="text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Withdraw</span>
          </Link>

          {/* 3. Invite / Share */}
          <Link to="/share" className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-amber-900/20 group-active:scale-95 transition-transform">
              <Share2 size={22} className="text-amber-50" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Invite</span>
          </Link>

          {/* 4. Support */}
          <button
            onClick={() => outletContext?.openSupport()}
            className="flex flex-col items-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 group-active:scale-95 transition-transform">
              <Headset size={22} className="text-emerald-50" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 mt-1.5">Support</span>
          </button>
        </div>
      </div>

      {/* Announcement Marquee Ticker */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/70 border border-blue-100/80 rounded-xl text-slate-700 text-xs overflow-hidden">
          <Volume2 size={16} className="text-[#0077B6] shrink-0 animate-pulse" />
          <div className="whitespace-nowrap overflow-hidden text-ellipsis text-[11px] font-medium text-slate-600">
            Welcome to AeroMarine Shipping & Exports! Member 98***12 just received ₹4,354 daily yield! • Fast automated withdrawals active.
          </div>
        </div>
      </div>

      {/* Plan Category Segmented Tabs */}
      <div className="px-4 pt-4">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('regular')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'regular'
                ? 'bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white shadow-md shadow-blue-900/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal Fleet Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('welfare')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'welfare'
                ? 'bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white shadow-md shadow-blue-900/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            VIP Express Cargo
          </button>
        </div>
      </div>

      {/* Product Card List */}
      <div className="px-4 pt-3 space-y-3.5">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#0077B6]/20 border-t-[#0077B6] rounded-full animate-spin mb-2"></div>
            <span className="text-xs">Loading fleet containers...</span>
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center text-slate-400 text-xs border border-slate-100">
            No plans available in this category.
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-3xl p-3.5 shadow-[0_10px_25px_-8px_rgba(11,37,69,0.08)] border border-slate-100 hover:border-cyan-300 transition-all overflow-hidden"
            >
              {/* Interactive Ship Photography & Route Visual */}
              <ShipVisualCard
                planName={plan.name}
                category={plan.category || activeTab}
                height="h-40"
                className="mb-3"
              />

              {/* Card Title & Header Info */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0077B6] shrink-0">
                    <Anchor size={16} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {plan.subtitle || 'Daily Withdrawal • Insured Cargo'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    (plan.purchasedCount || 0) >= (plan.limitPerUser || 10)
                      ? 'text-rose-600 bg-rose-50 border-rose-200/60'
                      : (plan.purchasedCount || 0) > 0
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60'
                      : 'text-amber-600 bg-amber-50 border-amber-200/50'
                  }`}
                >
                  Limit {plan.purchasedCount || 0}/{plan.limitPerUser || 10}
                </span>
              </div>

              {/* 2x2 Stats Grid */}
              <div className="grid grid-cols-4 gap-2 py-3.5 text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Price</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">₹{plan.price}</div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-50/50 border border-cyan-100/60">
                  <div className="text-[10px] text-[#0077B6]">Daily</div>
                  <div className="text-xs font-black text-[#0077B6] mt-0.5">₹{plan.dailyIncome}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">Total</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">₹{plan.totalRevenue}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] text-slate-400">End Day</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{plan.durationDays} Days</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Remaining</span>
                    <span className="font-semibold text-slate-600">{plan.remainingPercent || 85}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] rounded-full"
                      style={{ width: `${plan.remainingPercent || 85}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyClick(plan)}
                  disabled={(plan.purchasedCount || 0) >= (plan.limitPerUser || 10)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
                    (plan.purchasedCount || 0) >= (plan.limitPerUser || 10)
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-[#0B2545] to-[#0077B6] hover:from-[#134074] hover:to-[#0096C7] text-white shadow-blue-900/20 active:scale-95 cursor-pointer'
                  }`}
                >
                  {(plan.purchasedCount || 0) >= (plan.limitPerUser || 10) ? 'Limit Reached' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Buy Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-5 shadow-2xl relative animate-in zoom-in-95">
            {/* Visual Ship Banner */}
            <ShipVisualCard
              planName={selectedPlan.name}
              category={selectedPlan.category || activeTab}
              height="h-28"
              className="mb-3.5"
            />

            <h3 className="text-base font-extrabold text-slate-900 text-center">
              Confirm Container Lease
            </h3>
            <p className="text-xs text-slate-500 text-center mt-0.5">
              {selectedPlan.name}
            </p>

            <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Lease Price:</span>
                <span className="font-black text-slate-900">₹{selectedPlan.price}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Daily Freight Yield:</span>
                <span className="font-bold text-[#0077B6]">₹{selectedPlan.dailyIncome} / day</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contract Duration:</span>
                <span className="font-bold text-slate-800">{selectedPlan.durationDays} Days</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Current Holdings:</span>
                <span className="font-bold text-slate-800">{selectedPlan.purchasedCount || 0} / {selectedPlan.limitPerUser || 10} units</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 font-semibold">
                <span>Total Expected Return:</span>
                <span className="font-black text-emerald-600">₹{selectedPlan.totalRevenue}</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                No
              </button>
              <button
                type="button"
                disabled={buying}
                onClick={handleConfirmBuy}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {buying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Yes, Buy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Announcement Modal on Entry */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-[400px] bg-white rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0077B6] flex items-center justify-center mx-auto mb-2">
                <Ship size={26} />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Welcome To AeroMarine
              </h3>
              <p className="text-[11px] text-slate-500">Official Maritime Shipping Notice</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600 mb-4">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Min deposit</span>
                <span className="font-bold text-slate-800">₹250.00</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Min withdraw</span>
                <span className="font-bold text-slate-800">₹120.00</span>
              </div>
              <div className="py-1">
                <div className="text-slate-500 mb-1">Invite commission:</div>
                <div className="flex justify-between font-bold text-[#0077B6] text-[11px]">
                  <span>Level 1: 10%</span>
                  <span>Level 2: 3%</span>
                  <span>Level 3: 1%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowNoticeModal(false);
                  outletContext?.openSupport();
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Support
              </button>
              <a
                href="https://t.me/AeroMarine_Official_Channel"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold text-center shadow-md shadow-blue-900/20"
              >
                Channel
              </a>
            </div>

            <button
              onClick={() => setShowNoticeModal(false)}
              className="w-full mt-3 py-2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
