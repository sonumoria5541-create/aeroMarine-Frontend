import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Ship, ShieldCheck, Award } from 'lucide-react';

export const MessagesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-10">
      {/* Top Header */}
      <div className="bg-[#0B2545] px-4 py-3.5 text-white flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        <h1 className="text-sm font-black tracking-wide">Notification Center</h1>
        <div className="w-12"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Welcome Notice Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[#0077B6] flex items-center justify-center">
              <Ship size={22} />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-900">Official AeroMarine Welcome</h2>
              <div className="text-[10px] text-slate-400">Notices & platform updates</div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Dear Member, Welcome to <strong>AeroMarine Shipping & Exports</strong> — we're glad to have you. Here is a quick guide to help you get started and earn steady daily returns with complete confidence.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900">1. Getting started with fleet leasing</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Browse our container fleet plans on the Home page. Each container has a fixed lease price, daily yield, and set duration. Tap <strong>Buy now</strong> and your freight profit starts generating automatically.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">2. Grow your team, grow income</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Invite friends and logistics partners with your referral link and earn across three tiers: <strong>L1 10%</strong>, <strong>L2 3%</strong>, and <strong>L3 1%</strong> — credited directly to your available balance.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">3. Automated daily payouts</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                No manual claiming required. While your container lease is running, earnings are credited to your wallet balance every 24 hours. Track every payout under <strong>Income</strong> and <strong>Balance Details</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900">4. Fast banking withdrawals</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bind your bank account once in Profile, then request withdrawals anytime between 06:00 and 19:00 daily.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-[#0077B6] text-[11px] font-semibold flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0" />
              <span>Support is available 24×7. Never share your password or OTP.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
