import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShoppingCart,
  Box,
  RefreshCw,
  Search,
  Ship,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  User,
  Copy,
  Check,
  ExternalLink,
  Eye,
  X,
  ShieldCheck,
  Layers,
  AlertCircle,
  Filter,
  Sparkles,
  Calendar,
  Zap,
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalInvested: 0,
    activeCount: 0,
    completedCount: 0,
    totalYieldsDistributed: 0,
    dailyYieldCommitment: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'running' | 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'amount_high' | 'days_left'
  const [selectedOrder, setSelectedOrder] = useState(null); // for Inspector modal
  const [copiedId, setCopiedId] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data?.success) {
        const rawOrders = res.data.data || [];
        setOrders(rawOrders);
        if (res.data.stats) {
          setStats(res.data.stats);
        } else {
          // Fallback calculation
          const totalInvested = rawOrders.reduce((sum, o) => sum + Number(o.price || o.amount || 0), 0);
          const activeOrders = rawOrders.filter((o) => o.status === 'running');
          const completedCount = rawOrders.filter((o) => o.status === 'completed').length;
          const totalYieldsDistributed = rawOrders.reduce((sum, o) => sum + Number(o.totalEarned || 0), 0);
          const dailyYieldCommitment = activeOrders.reduce((sum, o) => sum + Number(o.dailyIncome || 0), 0);
          setStats({
            totalOrders: rawOrders.length,
            totalInvested,
            activeCount: activeOrders.length,
            completedCount,
            totalYieldsDistributed,
            dailyYieldCommitment,
          });
        }
      }
    } catch (e) {
      console.error('Failed to fetch fleet orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let list = orders.filter((ord) => {
      const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
      const term = searchTerm.toLowerCase().trim();
      const userObj = ord.user || ord.userId;
      const matchesSearch =
        !term ||
        ord._id?.toLowerCase().includes(term) ||
        ord.planName?.toLowerCase().includes(term) ||
        ord.planSnapshot?.name?.toLowerCase().includes(term) ||
        userObj?.name?.toLowerCase().includes(term) ||
        userObj?.phone?.includes(term) ||
        userObj?.inviteCode?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'amount_high') {
      list.sort((a, b) => Number(b.price || b.amount || 0) - Number(a.price || a.amount || 0));
    } else if (sortBy === 'days_left') {
      list.sort((a, b) => Number(a.daysRemaining || 0) - Number(b.daysRemaining || 0));
    }

    return list;
  }, [orders, statusFilter, searchTerm, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      {/* SECTION 1: Page Headline & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-ocean-900 text-teal-brand flex items-center justify-center shadow-md">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
                Fleet Container Orders & Active Leases
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time member fleet participation, daily 13.3% yield disbursements, and container contract lifecycle
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Link
            to="/admin/plans"
            className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 flex-1 lg:flex-initial"
          >
            <Box className="w-4 h-4 text-teal-brand" />
            <span>Manage Fleet Plans</span>
          </Link>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm flex items-center justify-center"
            title="Refresh fleet orders"
            aria-label="Refresh orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-brand' : ''}`} />
          </button>
        </div>
      </div>

      {/* SECTION 2: Operational KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Capital */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-teal-brand">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Leased Capital
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-brand">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-ocean-900 truncate">
            {formatINR(stats.totalInvested)}
          </p>
          <p className="text-[11px] text-slate-400">
            {stats.totalOrders} Cumulative Contracts
          </p>
        </div>

        {/* Active Vessels */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Fleet Units
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-sky-700 truncate">
            {stats.activeCount} Units
          </p>
          <p className="text-[11px] text-slate-400">
            Currently yielding ~13.3% daily
          </p>
        </div>

        {/* Daily Yield Commitment */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              24h Daily Yield Output
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-amber-700 truncate">
            {formatINR(stats.dailyYieldCommitment)} <span className="text-xs font-normal text-slate-400">/ day</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Automated member settlement rate
          </p>
        </div>

        {/* Total Yields Settled */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Yields Credited To Date
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black font-display text-emerald-700 truncate">
            {formatINR(stats.totalYieldsDistributed)}
          </p>
          <p className="text-[11px] text-slate-400">
            {stats.completedCount} Contracts Concluded
          </p>
        </div>
      </div>

      {/* SECTION 3: Filter, Search & Controls Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: `All Orders (${orders.length})` },
              { id: 'running', label: `Active Running (${orders.filter((o) => o.status === 'running').length})` },
              { id: 'completed', label: `Concluded (${orders.filter((o) => o.status === 'completed').length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all text-xs whitespace-nowrap shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-ocean-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search member, phone, plan, or order ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-brand focus:bg-white transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-teal-brand cursor-pointer shrink-0 shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Capital</option>
              <option value="days_left">Lowest Days Left</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 4: Structured Orders List & Card Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-brand border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Loading fleet container contracts...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
              <Box className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-ocean-900">No Fleet Container Orders Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'No container contracts match the specified filter or search query.'
                : 'No members have currently leased container fleet units.'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredOrders.map((ord) => {
              const userObj = ord.user || ord.userId || {};
              const planName = ord.planName || ord.planSnapshot?.name || 'Standard 20ft Cargo';
              const price = Number(ord.price || ord.amount || 0);
              const dailyIncome = Number(ord.dailyIncome || 0);
              const totalRevenue = Number(ord.totalRevenue || dailyIncome * (ord.durationDays || 45));
              const totalEarned = Number(ord.totalEarned || 0);
              const durationDays = Number(ord.durationDays || ord.planSnapshot?.durationDays || 45);
              const daysRemaining = ord.daysRemaining != null ? Number(ord.daysRemaining) : 0;
              const daysElapsed = Math.max(0, durationDays - daysRemaining);
              const progressPercent =
                durationDays > 0 ? Math.min(100, Math.round((daysElapsed / durationDays) * 100)) : 0;
              const isRunning = ord.status === 'running';

              return (
                <div
                  key={ord._id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-teal-brand/50 shadow-subtle hover:shadow-md transition-all p-4 sm:p-6 space-y-4"
                >
                  {/* Row 1: Header (Plan info, Order ID, Status Badge) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-900 to-ocean-700 text-teal-brand flex items-center justify-center shrink-0 shadow-sm">
                        <Ship className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-sm sm:text-base text-ocean-900 truncate">
                            {planName}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 ${
                              isRunning
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}
                            />
                            {isRunning ? 'Active / Running' : 'Completed'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          <span>ID: {ord._id}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(ord._id, ord._id)}
                            className="text-slate-400 hover:text-ocean-900"
                            title="Copy Order ID"
                          >
                            {copiedId === ord._id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Member Fast Badge */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0 text-xs">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-ocean-900">{userObj.name || 'Member'}</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {userObj.phone || 'N/A'}
                      </span>
                      {userObj.inviteCode && (
                        <span className="text-[10px] font-mono text-teal-brand font-semibold">
                          Code: {userObj.inviteCode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: 4-Column Commercial Figures Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                    {/* Leased Capital */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Capital Deployed
                      </span>
                      <span className="text-base sm:text-lg font-black font-display text-ocean-900 block mt-0.5">
                        {formatINR(price)}
                      </span>
                      <span className="text-[10px] text-slate-400">Standard Container Lease</span>
                    </div>

                    {/* Daily Yield */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Daily Yield Rate
                      </span>
                      <span className="text-base sm:text-lg font-black font-display text-teal-brand block mt-0.5">
                        {formatINR(dailyIncome)} <span className="text-xs font-normal text-slate-500">/ day</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        ~{price > 0 ? ((dailyIncome / price) * 100).toFixed(1) : '13.3'}% daily return
                      </span>
                    </div>

                    {/* Total Earned */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Yields Credited So Far
                      </span>
                      <span className="text-base sm:text-lg font-black font-display text-emerald-700 block mt-0.5">
                        {formatINR(totalEarned)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Settled to member balance
                      </span>
                    </div>

                    {/* Expected Total */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Contract Target Total
                      </span>
                      <span className="text-base sm:text-lg font-black font-display text-ocean-900 block mt-0.5">
                        {formatINR(totalRevenue)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Full duration revenue
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Contract Progress Bar & Timestamps */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-teal-brand" />
                        <span className="font-semibold text-ocean-900">
                          {daysElapsed} of {durationDays} Days Completed
                        </span>
                        <span className="text-slate-400">({progressPercent}%)</span>
                      </div>
                      <span className="font-bold text-ocean-900">
                        {daysRemaining} Days Left
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isRunning
                            ? 'bg-gradient-to-r from-teal-brand to-[#0077B6]'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400 pt-1">
                      <span>Leased: {formatDate(ord.createdAt)}</span>
                      {ord.lastYieldAt && (
                        <span>Last Settlement: {formatDate(ord.lastYieldAt)}</span>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Action Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-teal-brand shrink-0" />
                      <span>Insured Maritime Cargo Asset • Ledger Verified</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-ocean-900 hover:text-white text-ocean-900 font-bold transition-all flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Contract</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 5: Detailed Order Inspector Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-ocean-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ocean-900 to-ocean-700 text-teal-brand flex items-center justify-center shadow-md">
                  <Ship className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-ocean-900 font-display">
                    Fleet Lease Agreement Audit
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Order UID: {selectedOrder._id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Member Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <span className="font-extrabold text-slate-700 text-[11px] uppercase tracking-wider block">
                Contract Holder Coordinates
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Member Name</span>
                  <span className="font-bold text-ocean-900 text-xs">
                    {(selectedOrder.user || selectedOrder.userId)?.name || 'Member'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Registered Phone</span>
                  <span className="font-mono font-bold text-ocean-900 text-xs">
                    {(selectedOrder.user || selectedOrder.userId)?.phone || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Referral Invite Code</span>
                  <span className="font-mono font-bold text-teal-brand text-xs">
                    {(selectedOrder.user || selectedOrder.userId)?.inviteCode || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan & Financial Details */}
            <div className="space-y-3">
              <span className="font-extrabold text-slate-700 text-[11px] uppercase tracking-wider block">
                Commercial Lease Specifications
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Plan Name</span>
                  <span className="font-bold text-ocean-900 block truncate">
                    {selectedOrder.planName || selectedOrder.planSnapshot?.name}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Capital Invested</span>
                  <span className="font-black text-ocean-900 block">
                    {formatINR(selectedOrder.price || selectedOrder.amount)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Daily Return</span>
                  <span className="font-black text-teal-brand block">
                    {formatINR(selectedOrder.dailyIncome)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Contract Duration</span>
                  <span className="font-bold text-ocean-900 block">
                    {selectedOrder.durationDays || selectedOrder.planSnapshot?.durationDays} Days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-emerald-700 text-[10px] block font-semibold">Total Yield Credited</span>
                  <span className="font-black text-emerald-800 text-sm block">
                    {formatINR(selectedOrder.totalEarned || 0)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <span className="text-[#0077B6] text-[10px] block font-semibold">Total Target Revenue</span>
                  <span className="font-black text-ocean-900 text-sm block">
                    {formatINR(selectedOrder.totalRevenue)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 col-span-2 sm:col-span-1">
                  <span className="text-amber-700 text-[10px] block font-semibold">Remaining Days</span>
                  <span className="font-black text-amber-800 text-sm block">
                    {selectedOrder.daysRemaining} Days
                  </span>
                </div>
              </div>
            </div>

            {/* Audit History & Ledger Info */}
            <div className="p-4 rounded-2xl bg-ocean-50 border border-ocean-100 text-xs space-y-1.5 text-ocean-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-brand shrink-0" />
                <span>Auditable Ledger Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                This lease was initiated on {formatDate(selectedOrder.createdAt)} under verified double-entry ledger controls.
                Automated daily payouts of {formatINR(selectedOrder.dailyIncome)} are credited on every 24-hour cycle.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
