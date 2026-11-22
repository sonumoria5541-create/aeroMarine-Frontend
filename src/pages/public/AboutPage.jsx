import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Ship, ShieldCheck, Clock, Users, ArrowRight, Award, Globe } from 'lucide-react';
import { AeroMarineLogo } from '../../components/common/AeroMarineLogo';

export const AboutPage = () => {
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
        <h1 className="text-sm font-black tracking-wide">About AeroMarine</h1>
        <div className="w-12"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Brand Banner Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-3">
          <div className="flex justify-center mb-1">
            <AeroMarineLogo size={80} variant="icon" />
          </div>

          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            AEROMARINE SHIPPING & EXPORTS
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The power of international maritime logistics — now a modern earnings platform built for steady daily income, high-tier team rewards, and complete financial security.
          </p>

          <p className="text-[11px] text-slate-500 leading-relaxed text-left pt-2 border-t border-slate-100">
            AeroMarine is a premier shipping fleet operator and cargo leasing enterprise. We lease intermodal dry containers, specialized refrigerated units, and coastal bulk vessels across major trade corridors in the Indian Ocean, Arabian Sea, and Asia-Pacific.
          </p>
        </div>

        {/* At a glance (4 metrics) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Why members choose us
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/70">
              <div className="text-xl font-black text-[#0077B6]">10%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Level-1 Commission</div>
              <div className="text-[10px] text-slate-500">Instant direct payouts</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100/70">
              <div className="text-xl font-black text-cyan-700">24h</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Auto Daily Payout</div>
              <div className="text-[10px] text-slate-500">Hands-free credit</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/70">
              <div className="text-xl font-black text-emerald-700">100%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Secure & Insured</div>
              <div className="text-[10px] text-slate-500">Full cargo backing</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100/70">
              <div className="text-xl font-black text-amber-600">24×7</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Member Support</div>
              <div className="text-[10px] text-slate-500">Dedicated assistance</div>
            </div>
          </div>
        </div>

        {/* 4 Steps How It Works */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900">How it works</h3>

          <div className="space-y-3 pt-1 text-slate-600">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <div className="font-bold text-slate-900">Recharge your wallet</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Add funds securely through our instant UPI / QR payment gateway.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <div className="font-bold text-slate-900">Choose a container lease plan</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Every fleet plan has a fixed price, set daily yield, and predefined duration.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <div className="font-bold text-slate-900">Earn daily income</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Your profits are credited automatically every 24 hours directly to your balance.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <div className="font-bold text-slate-900">Withdraw your earnings</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Bind your bank account once, then withdraw during daily banking hours (06:00 - 19:00).
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/20 active:scale-95 transition-all"
            >
              <span>Explore plans</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="p-3 text-center text-[10px] text-slate-400">
          Investment involves shipping trade risk. Returns are generated from cargo freight operations.
        </div>
      </div>
    </div>
  );
};
