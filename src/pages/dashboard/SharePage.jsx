import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Share2, MessageCircle, Send, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SharePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const inviteCode = user?.inviteCode || '179041';
  const inviteUrl = `${window.location.origin}/register?invite=${inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join AeroMarine Shipping & Exports',
        text: 'Lease ocean freight containers and earn daily automated income!',
        url: inviteUrl,
      });
    } else {
      handleCopy();
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join AeroMarine Shipping & Exports! Lease container fleets and earn automated daily payouts: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `Join AeroMarine Shipping & Exports! Lease container fleets and earn automated daily payouts: ${inviteUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-8">
      {/* Top Navigation Bar */}
      <div className="bg-[#0B2545] px-4 py-3.5 text-white flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        <h1 className="text-sm font-black tracking-wide">Invite & Earn</h1>
        <button
          onClick={handleNativeShare}
          className="p-1.5 text-cyan-300 hover:text-cyan-200"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Hero Illustration / Banner */}
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] px-6 pt-4 pb-12 text-white text-center rounded-b-[36px]">
        <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-300 mb-1">
          AeroMarine Partner Program
        </div>
        <h2 className="text-xl font-black">Build Your Global Maritime Network</h2>
        <p className="text-xs text-blue-100/80 mt-1 max-w-xs mx-auto">
          Share your referral link and earn daily commissions up to 10% on every fleet contract leased.
        </p>
      </div>

      {/* Referral Link Box */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Your Unique Referral Link
            </label>
            <div className="mt-1.5 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 pl-3">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-transparent border-0 outline-none text-xs font-semibold text-slate-700 truncate"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all flex items-center gap-1 shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 mb-2">Share via:</div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <button
                onClick={shareWhatsApp}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 flex flex-col items-center justify-center transition-colors"
              >
                <MessageCircle size={22} className="text-emerald-600 mb-1" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </button>
              <button
                onClick={shareTelegram}
                className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 flex flex-col items-center justify-center transition-colors"
              >
                <Send size={22} className="text-sky-600 mb-1" />
                <span className="text-[10px] font-bold">Telegram</span>
              </button>
              <button
                onClick={handleNativeShare}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 flex flex-col items-center justify-center transition-colors"
              >
                <Share2 size={22} className="text-blue-600 mb-1" />
                <span className="text-[10px] font-bold">Share</span>
              </button>
              <button
                onClick={handleCopy}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 flex flex-col items-center justify-center transition-colors"
              >
                <Globe size={22} className="text-slate-600 mb-1" />
                <span className="text-[10px] font-bold">More</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Levels Breakdown */}
      <div className="px-4 mt-5 space-y-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Commission Levels</h3>
            <span className="text-[11px] font-bold text-[#0077B6] bg-cyan-50 px-2.5 py-0.5 rounded-full">
              3 Levels Deep
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100/70">
              <div className="text-[10px] font-bold text-slate-400">LV 1</div>
              <div className="text-lg font-black text-[#0077B6] mt-0.5">10%</div>
              <div className="text-[9px] text-slate-500 mt-1">Direct joins</div>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100/70">
              <div className="text-[10px] font-bold text-slate-400">LV 2</div>
              <div className="text-lg font-black text-cyan-700 mt-0.5">3%</div>
              <div className="text-[9px] text-slate-500 mt-1">Invited by L1</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400">LV 3</div>
              <div className="text-lg font-black text-slate-700 mt-0.5">1%</div>
              <div className="text-[9px] text-slate-500 mt-1">Invited by L2</div>
            </div>
          </div>
        </div>

        {/* How It Works Guide */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900">How it works</h3>

          <div className="space-y-3 pt-1">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <div className="font-bold text-slate-800">Share your link</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Send your referral link on WhatsApp, Telegram, or anywhere you like.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <div className="font-bold text-slate-800">They register and lease a plan</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Your friend signs up through your link and activates an ocean container lease.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <div className="font-bold text-slate-800">You earn commission</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Your share is credited automatically to your wallet balance across all 3 levels.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
