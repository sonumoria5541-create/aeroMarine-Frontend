import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const PRIZES = [200, 250, 300, 350, 400, 250, 300, 200];
const SEGMENT_COLORS = [
  '#0B2545',
  '#0077B6',
  '#00B4D8',
  '#0B2545',
  '#F59E0B',
  '#0077B6',
  '#00B4D8',
  '#134074',
];

export const WheelPage = () => {
  const { user, refreshUser } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(user?.spinsLeft ?? 1);
  const [wonPrize, setWonPrize] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSpin = async () => {
    if (spinning) return;
    if (spinsLeft <= 0) {
      setErrorMsg('No spins left! Lease a container plan to unlock daily spins.');
      return;
    }

    setErrorMsg('');
    setWonPrize(null);
    setSpinning(true);

    try {
      const res = await api.post('/task/spin');
      if (res.data?.status === 'success') {
        const { targetIndex, prize, spinsLeft: remaining } = res.data;

        // Calculate rotation degrees: 360 * 5 full spins + target segment offset
        const segmentAngle = 360 / PRIZES.length;
        // Invert to align pointer at top (270 deg or 0 deg depending on layout)
        const targetAngle = 360 * 6 + (PRIZES.length - 1 - targetIndex) * segmentAngle + segmentAngle / 2;

        setRotation((prev) => prev + targetAngle);

        setTimeout(() => {
          setSpinning(false);
          setWonPrize(prize);
          setSpinsLeft(remaining);
          refreshUser();
        }, 3500);
      } else {
        setSpinning(false);
        setErrorMsg(res.data?.message || 'Error processing spin');
      }
    } catch (err) {
      setSpinning(false);
      setErrorMsg(err.response?.data?.message || 'No spins remaining or error spinning wheel.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-8">
      {/* Top Maritime Curved Banner */}
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] text-white px-5 pt-6 pb-16 rounded-b-[36px] text-center shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold mb-2 border border-cyan-400/30">
          <Sparkles size={14} className="animate-spin text-cyan-300" style={{ animationDuration: '4s' }} />
          <span>Daily Freight Bounty</span>
        </div>
        <h1 className="text-xl font-black tracking-tight">Lucky Maritime Spin</h1>
        <p className="text-xs text-blue-100/80 mt-1 max-w-xs mx-auto">
          Spin once daily and win up to ₹400 instant cash directly into your wallet.
        </p>
      </div>

      {/* Wheel Card */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-[32px] p-6 shadow-[0_16px_36px_-12px_rgba(11,37,69,0.15)] border border-slate-100 flex flex-col items-center">
          
          {/* Wheel Pointer */}
          <div className="relative mb-2">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 z-20 drop-shadow-md"></div>
          </div>

          {/* Interactive Spin Wheel Circle */}
          <div className="relative w-64 h-64 rounded-full p-2 bg-gradient-to-tr from-[#0B2545] via-[#0077B6] to-[#00B4D8] shadow-2xl ring-4 ring-cyan-100 flex items-center justify-center">
            
            {/* Rotating Wheel Body */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[3500ms] cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {PRIZES.map((prize, idx) => {
                const angle = (360 / PRIZES.length) * idx;
                return (
                  <div
                    key={idx}
                    className="absolute w-full h-full left-0 top-0 flex justify-center items-start pt-3"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '50% 50%',
                    }}
                  >
                    <div
                      className="text-xs font-black px-2 py-0.5 rounded-full shadow-sm text-white"
                      style={{
                        backgroundColor: SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
                      }}
                    >
                      ₹{prize}
                    </div>
                  </div>
                );
              })}

              {/* Decorative inner circular divider lines */}
              <div className="absolute inset-4 rounded-full border border-white/20 pointer-events-none"></div>
              <div className="absolute inset-12 rounded-full border border-white/20 pointer-events-none"></div>
            </div>

            {/* Center SPIN GO Button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white font-black text-xs uppercase tracking-tighter shadow-xl border-4 border-white flex flex-col items-center justify-center active:scale-95 transition-transform disabled:opacity-80"
            >
              <span>SPIN</span>
              <span className="text-[9px] -mt-0.5 text-amber-100">GO</span>
            </button>
          </div>

          {/* Spins Status */}
          <div className="mt-5 text-center">
            <div className="text-2xl font-black text-[#0077B6]">{spinsLeft}</div>
            <div className="text-xs text-slate-500 font-medium">Spins left today</div>
          </div>

          {/* Error / Status message */}
          {errorMsg && (
            <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Win Reward Modal / Toast */}
          {wonPrize && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center w-full animate-in zoom-in-95">
              <div className="text-sm font-black text-emerald-700">Congratulations!</div>
              <div className="text-xs mt-0.5">You won ₹{wonPrize} cash reward added to your wallet!</div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSpin}
            disabled={spinning || spinsLeft <= 0}
            className={`w-full mt-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all ${
              spinsLeft > 0
                ? 'bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white shadow-blue-900/30 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {spinning ? 'Spinning...' : spinsLeft > 0 ? 'Spin Now' : 'No spins left'}
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-2.5">
            Buy any container plan to unlock daily free spin
          </p>
        </div>
      </div>

      {/* Rules / How It Works Card */}
      <div className="px-4 mt-5 space-y-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Award size={18} className="text-[#0077B6]" />
            <span>How it works</span>
          </h2>
          <p className="text-xs text-slate-500">
            Spin daily and win up to ₹400 instant cash reward:
          </p>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <span className="font-bold text-slate-800">Buy a plan: </span>
                <span className="text-slate-600">Any active investment plan unlocks the daily spin.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <span className="font-bold text-slate-800">Press SPIN once a day: </span>
                <span className="text-slate-600">Get 1 free spin every single day while leasing.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <span className="font-bold text-slate-800">Cash lands in your wallet: </span>
                <span className="text-slate-600">Winnings are added instantly and visible under Profile & Income.</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore plans</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
