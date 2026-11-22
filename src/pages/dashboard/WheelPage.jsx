import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const SEGMENTS = [
  { index: 0, label: 'Better Luck', fullLabel: 'Better Luck Next Time', amount: 0, color: '#334155' },
  { index: 1, label: '₹10', fullLabel: '₹10 Cash Reward', amount: 10, color: '#0077B6' },
  { index: 2, label: '₹50', fullLabel: '₹50 Cash Reward', amount: 50, color: '#00B4D8' },
  { index: 3, label: '₹20', fullLabel: '₹20 Cash Reward', amount: 20, color: '#134074' },
  { index: 4, label: '₹100', fullLabel: '₹100 Cash Reward', amount: 100, color: '#0B2545' },
  { index: 5, label: '₹500', fullLabel: '₹500 Cash Reward', amount: 500, color: '#F59E0B' },
  { index: 6, label: '₹1000', fullLabel: '₹1,000 Grand Reward', amount: 1000, color: '#10B981' },
  { index: 7, label: 'Better Luck', fullLabel: 'Better Luck Next Time', amount: 0, color: '#475569' },
];

export const WheelPage = () => {
  const { user, refreshUser } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(user?.spinsLeft ?? 0);
  const [spinResult, setSpinResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSpin = async () => {
    if (spinning) return;
    if (spinsLeft <= 0) {
      setErrorMsg('No spins left! Lease a container plan to unlock daily spins.');
      return;
    }

    setErrorMsg('');
    setSpinResult(null);
    setSpinning(true);

    try {
      const res = await api.post('/task/spin');
      if (res.data?.status === 'success') {
        const { targetIndex, prize, spinsLeft: remaining, message } = res.data;

        // Calculate rotation degrees:
        // Each segment is 360 / 8 = 45 degrees
        // Pointer is at the top (0 degrees).
        // Align segment targetIndex under the top pointer
        const segmentAngle = 360 / SEGMENTS.length;
        const targetAngleOffset = ((SEGMENTS.length - targetIndex) % SEGMENTS.length) * segmentAngle;

        // Ensure at least 6 full clockwise rotations
        const currentMod = rotation % 360;
        const delta = 360 * 6 + ((360 - currentMod + targetAngleOffset) % 360);

        setRotation((prev) => prev + delta);

        setTimeout(() => {
          setSpinning(false);
          setSpinResult({
            prize,
            label: SEGMENTS[targetIndex]?.fullLabel || (prize > 0 ? `₹${prize}` : 'Better Luck Next Time'),
            isWin: prize > 0,
            message,
          });
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
          Spin daily and win up to ₹1,000 instant cash directly into your wallet.
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
              {SEGMENTS.map((segment, idx) => {
                const angle = (360 / SEGMENTS.length) * idx;
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
                      className={`font-black rounded-full shadow-sm text-white flex items-center justify-center ${
                        segment.amount === 0
                          ? 'text-[8.5px] px-2 py-0.5 tracking-tight'
                          : 'text-xs px-2.5 py-0.5'
                      }`}
                      style={{
                        backgroundColor: segment.color,
                      }}
                    >
                      {segment.label}
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
              className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white font-black text-xs uppercase tracking-tighter shadow-xl border-4 border-white flex flex-col items-center justify-center active:scale-95 transition-transform disabled:opacity-80 cursor-pointer"
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

          {/* Win or Better Luck Notification */}
          {spinResult && (
            <div
              className={`mt-4 p-4 rounded-2xl text-center w-full animate-in zoom-in-95 border ${
                spinResult.isWin
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div
                className={`text-sm font-black flex items-center justify-center gap-1.5 ${
                  spinResult.isWin ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {spinResult.isWin ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Congratulations!</span>
                  </>
                ) : (
                  <span>Better Luck Next Time!</span>
                )}
              </div>
              <div className="text-xs mt-0.5 font-medium">
                {spinResult.isWin
                  ? `You won ₹${spinResult.prize} cash reward added to your wallet balance!`
                  : 'No reward this turn. Lease an active container plan on the Home page to unlock more free daily spins!'}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSpin}
            disabled={spinning || spinsLeft <= 0}
            className={`w-full mt-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all ${
              spinsLeft > 0
                ? 'bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white shadow-blue-900/30 active:scale-95 cursor-pointer'
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
            Spin daily and win up to ₹1,000 instant cash reward:
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
