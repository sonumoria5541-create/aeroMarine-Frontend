import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ship, Clock, TrendingUp, CheckCircle, ArrowRight, Zap, RefreshCw, Anchor } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ShipVisualCard } from '../../components/common/ShipVisualCard';
import { AeroMarineLogo } from '../../components/common/AeroMarineLogo';

export const IncomePage = () => {
  const { refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalInvested: 0,
    dailyIncome: 0,
    activePlans: 0,
    incomeTimer: '09:42:39',
  });
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my');
      if (res.data?.status === 'success') {
        setOrders(res.data.data.orders);
        setStats(res.data.data.stats);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClaim = async () => {
    setClaiming(true);
    setClaimMessage('');
    try {
      const res = await api.post('/orders/claim');
      setClaimMessage(res.data?.message || 'Daily yield collected!');
      await fetchOrders();
      await refreshUser();
    } catch (err) {
      setClaimMessage(err.response?.data?.message || 'Daily yield already claimed or not ready yet.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-28">
      {/* Curved Navy Header with Responsive Spacing */}
      <div className="relative bg-gradient-to-b from-[#0B2545] to-[#134074] px-4 sm:px-5 pt-5 pb-6 text-white rounded-b-[32px] shadow-lg shadow-blue-950/20">
        {/* Header Top Row: Logo, Title & Countdown */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <AeroMarineLogo size={28} variant="icon" />
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
              My Fleet Orders
            </h1>
          </div>

          {/* Income Countdown Timer Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/30 text-cyan-200 text-[11px] font-mono font-bold shadow-inner flex-shrink-0">
            <Clock size={12} className="animate-spin text-cyan-300" style={{ animationDuration: '6s' }} />
            <span>Income Time {stats.incomeTimer || '09:42:39'}</span>
          </div>
        </div>

        {/* 3 Summary Stats Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 min-w-0">
            <div className="text-[10px] sm:text-[11px] text-blue-200 font-medium truncate">Total Invested</div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5 truncate">₹{stats.totalInvested}</div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 min-w-0">
            <div className="text-[10px] sm:text-[11px] text-cyan-200 font-medium truncate">Daily Income</div>
            <div className="text-sm sm:text-base font-black text-cyan-300 mt-0.5 truncate">₹{stats.dailyIncome}</div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 min-w-0">
            <div className="text-[10px] sm:text-[11px] text-blue-200 font-medium truncate">Active Plans</div>
            <div className="text-sm sm:text-base font-black text-white mt-0.5 truncate">{stats.activePlans}</div>
          </div>
        </div>
      </div>

      {/* Daily Settlements Action Card (No negative margin collision) */}
      <div className="px-4 mt-3 sm:mt-4">
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Zap size={20} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">Automated Daily Settlements</div>
              <div className="text-[10px] text-slate-400">Earnings automatically arrive every 24h</div>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={claiming || stats.activePlans === 0}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white text-xs font-bold shadow-md shadow-cyan-900/15 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            {claiming ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <span>Collect Yield</span>
            )}
          </button>
        </div>

        {claimMessage && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[#0077B6] text-xs font-semibold text-center animate-in fade-in">
            {claimMessage}
          </div>
        )}
      </div>

      {/* Orders List / Empty State */}
      <div className="px-4 pt-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Shipping Leases
          </h2>
          <span className="text-xs font-medium text-slate-500">{orders.length} Total</span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#0077B6]/20 border-t-[#0077B6] rounded-full animate-spin mb-2"></div>
            <span className="text-xs">Loading active fleet...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0077B6] flex items-center justify-center mx-auto mb-3">
              <Ship size={32} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No plans yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              You haven't purchased any plan yet. Explore the plans and start earning daily.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore plans</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 space-y-2.5 overflow-hidden"
            >
              <ShipVisualCard
                planName={order.planName}
                height="h-36"
                showSpecs={true}
                className="mb-2"
              />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 truncate">{order.planName}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Leased on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    order.status === 'running'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {order.status === 'running' ? 'Running' : 'Completed'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center text-xs">
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 truncate">Lease Price</div>
                  <div className="font-bold text-slate-800 mt-0.5 truncate">₹{order.price}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#0077B6] truncate">Daily Yield</div>
                  <div className="font-bold text-[#0077B6] mt-0.5 truncate">₹{order.dailyIncome}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 truncate">Days Left</div>
                  <div className="font-bold text-slate-800 mt-0.5 truncate">{order.daysRemaining} Days</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">Total Earned So Far:</span>
                <span className="font-black text-emerald-600">₹{order.totalEarned || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
