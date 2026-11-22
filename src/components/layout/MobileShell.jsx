import React, { useState } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { Home, TrendingUp, Sparkles, Users, User, Headset, Send, X, ExternalLink } from 'lucide-react';

export const MobileShell = () => {
  const location = useLocation();
  const path = location.pathname;
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Hide bottom nav on login, register, and admin routes
  const hideNav =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/pages/login') ||
    path.startsWith('/pages/register') ||
    path.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#071324] text-slate-800 flex justify-center selection:bg-cyan-500 selection:text-white">
      {/* Centered Mobile Phone Frame */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#F4F8FC] relative shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col overflow-x-hidden">
        
        {/* Main Content Area */}
        <main className={`flex-1 ${!hideNav ? 'pb-24' : ''}`}>
          <Outlet context={{ openSupport: () => setShowSupportModal(true) }} />
        </main>

        {/* Fixed Bottom Navigation Bar (5 tabs) */}
        {!hideNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between relative">
              {/* 1. Home */}
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center py-1 transition-all ${
                    isActive ? 'text-[#0077B6] font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-50 text-[#0077B6]' : ''}`}>
                      <Home size={21} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
                  </>
                )}
              </NavLink>

              {/* 2. Income / Orders */}
              <NavLink
                to="/income"
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center py-1 transition-all ${
                    isActive ? 'text-[#0077B6] font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-50 text-[#0077B6]' : ''}`}>
                      <TrendingUp size={21} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Income</span>
                  </>
                )}
              </NavLink>

              {/* 3. Lucky Wheel / Spin (Raised Center Pill) */}
              <NavLink
                to="/task"
                className="flex-1 flex flex-col items-center -mt-5 group"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-13 h-13 rounded-full flex items-center justify-center p-3 text-white transition-transform active:scale-95 shadow-lg ${
                        isActive
                          ? 'bg-gradient-to-tr from-[#0B2545] to-[#00B4D8] ring-4 ring-cyan-100 shadow-cyan-500/30'
                          : 'bg-gradient-to-tr from-[#0B2545] to-[#0077B6] shadow-blue-900/30 hover:scale-105'
                      }`}
                    >
                      <Sparkles size={24} className="animate-pulse" />
                    </div>
                    <span className={`text-[11px] mt-1 font-semibold ${isActive ? 'text-[#0077B6]' : 'text-slate-500'}`}>
                      Spin
                    </span>
                  </>
                )}
              </NavLink>

              {/* 4. Team */}
              <NavLink
                to="/team"
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center py-1 transition-all ${
                    isActive ? 'text-[#0077B6] font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-50 text-[#0077B6]' : ''}`}>
                      <Users size={21} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Team</span>
                  </>
                )}
              </NavLink>

              {/* 5. Profile */}
              <NavLink
                to="/my"
                className={({ isActive }) =>
                  `flex-1 flex flex-col items-center py-1 transition-all ${
                    isActive ? 'text-[#0077B6] font-semibold scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-cyan-50 text-[#0077B6]' : ''}`}>
                      <User size={21} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
                  </>
                )}
              </NavLink>
            </div>
          </nav>
        )}

        {/* Global Customer Service / Telegram Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
              <button
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-[#0077B6]">
                  <Headset size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Customer Service</h3>
                  <p className="text-xs text-slate-500">24×7 AeroMarine Maritime Support</p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="https://t.me/AeroMarine_Support"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                      <Send size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Telegram Customer Care</div>
                      <div className="text-xs text-slate-500">Fast assistance for deposits & withdrawals</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">Open</span>
                </a>

                <a
                  href="https://t.me/AeroMarine_Official_Channel"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
                      <ExternalLink size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Official Maritime Channel</div>
                      <div className="text-xs text-slate-500">Live shipping yield proofs & daily announcements</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-600 px-3 py-1 bg-cyan-50 rounded-lg">Join</span>
                </a>
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
