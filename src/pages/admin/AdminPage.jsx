import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Wallet,
  ArrowUpRight,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import api from '../../lib/api';

export const AdminPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('recharges'); // 'overview', 'recharges', 'withdrawals', 'users'
  const [overview, setOverview] = useState(null);
  const [recharges, setRecharges] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await api.get('/admin/overview');
        if (res.data?.status === 'success') setOverview(res.data.data);
      } else if (activeTab === 'recharges') {
        const res = await api.get('/admin/recharges');
        if (res.data?.status === 'success') setRecharges(res.data.data);
      } else if (activeTab === 'withdrawals') {
        const res = await api.get('/admin/withdrawals');
        if (res.data?.status === 'success') setWithdrawals(res.data.data);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        if (res.data?.status === 'success') setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Admin load error:', err);
      showToast('Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleApproveRecharge = async (id) => {
    setActionLoading(id);
    try {
      const res = await api.post(`/admin/recharges/${id}/approve`);
      if (res.data?.status === 'success') {
        showToast('Recharge approved & funds credited!', 'success');
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error approving recharge', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRecharge = async (id) => {
    const reason = window.prompt('Enter rejection reason (optional):', 'Invalid UTR reference');
    if (reason === null) return;

    setActionLoading(id);
    try {
      const res = await api.post(`/admin/recharges/${id}/reject`, { reason });
      if (res.data?.status === 'success') {
        showToast('Recharge rejected', 'info');
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error rejecting recharge', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveWithdrawal = async (id) => {
    setActionLoading(id);
    try {
      const res = await api.post(`/admin/withdrawals/${id}/approve`);
      if (res.data?.status === 'success') {
        showToast('Withdrawal marked as paid!', 'success');
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error approving withdrawal', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const reason = window.prompt('Enter rejection reason (funds will be refunded to user):', 'Incorrect bank IFSC / Account');
    if (reason === null) return;

    setActionLoading(id);
    try {
      const res = await api.post(`/admin/withdrawals/${id}/reject`, { reason });
      if (res.data?.status === 'success') {
        showToast('Withdrawal rejected and balance refunded to user', 'info');
        loadData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error rejecting withdrawal', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-10">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2 ${
            toastType === 'success' ? 'bg-[#0077B6]' : 'bg-rose-600'
          }`}
        >
          {toastType === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-[#0B2545] px-4 py-3.5 text-white flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate('/my')}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-semibold">Exit Admin</span>
        </button>
        <div className="flex items-center gap-1.5 font-black text-sm">
          <Shield size={16} className="text-cyan-400" />
          <span>AeroMarine Admin</span>
        </div>
        <button onClick={loadData} className="p-1.5 text-cyan-300 hover:text-white">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-3 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('recharges')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'recharges' ? 'bg-white text-[#0B2545] shadow-sm font-black' : 'text-slate-500'
            }`}
          >
            Recharges
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'withdrawals' ? 'bg-white text-[#0B2545] shadow-sm font-black' : 'text-slate-500'
            }`}
          >
            Withdrawals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-white text-[#0B2545] shadow-sm font-black' : 'text-slate-500'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'users' ? 'bg-white text-[#0B2545] shadow-sm font-black' : 'text-slate-500'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* RECHARGES TAB */}
        {activeTab === 'recharges' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-extrabold text-slate-800">Deposit Requests (UTR Review)</h2>
              <span className="text-[11px] text-slate-400">{recharges.length} Total</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading deposits...</div>
            ) : recharges.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center text-xs text-slate-400 border border-slate-100">
                No deposit requests yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recharges.map((r) => (
                  <div key={r._id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold text-xs text-slate-800">{r.userPhone}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-600'
                            : r.status === 'rejected'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="text-lg font-black text-[#0077B6]">₹{r.amount}</div>
                      <div className="text-[11px] text-slate-400">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                      <span className="text-slate-400">UTR: </span>
                      <span className="font-mono font-bold text-slate-900">{r.utr}</span>
                      <span className="text-slate-400 ml-2">({r.channel})</span>
                    </div>

                    {r.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          disabled={actionLoading === r._id}
                          onClick={() => handleApproveRecharge(r._id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                        >
                          Approve & Credit
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === r._id}
                          onClick={() => handleRejectRecharge(r._id)}
                          className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WITHDRAWALS TAB */}
        {activeTab === 'withdrawals' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-extrabold text-slate-800">Withdrawal Payouts (Bank Review)</h2>
              <span className="text-[11px] text-slate-400">{withdrawals.length} Total</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading withdrawals...</div>
            ) : withdrawals.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl text-center text-xs text-slate-400 border border-slate-100">
                No withdrawal requests yet.
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w) => (
                  <div key={w._id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-mono font-bold text-xs text-slate-800">{w.userPhone}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          w.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-600'
                            : w.status === 'rejected'
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {w.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Net to Pay: </span>
                        <span className="text-base font-black text-emerald-600">₹{w.receiveAmount}</span>
                        <span className="text-slate-400 text-[10px] ml-1">(Fee: ₹{w.fee})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{new Date(w.createdAt).toLocaleDateString()}</div>
                    </div>

                    {w.bankDetails && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                        <div className="font-bold text-slate-900">{w.bankDetails.realName}</div>
                        <div className="font-mono text-[11px] text-slate-600">
                          A/C: {w.bankDetails.accountNumber} • IFSC: {w.bankDetails.ifsc}
                        </div>
                      </div>
                    )}

                    {w.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          disabled={actionLoading === w._id}
                          onClick={() => handleApproveWithdrawal(w._id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                        >
                          Mark Paid (Approve)
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading === w._id}
                          onClick={() => handleRejectWithdrawal(w._id)}
                          className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold"
                        >
                          Reject & Refund
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-slate-800">Platform Statistics</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-[10px] text-slate-400">Total Users</div>
                <div className="text-xl font-black text-slate-900 mt-1">{overview?.totalUsers || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-[10px] text-slate-400">Active Container Contracts</div>
                <div className="text-xl font-black text-[#0077B6] mt-1">{overview?.activeOrders || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-[10px] text-slate-400">Pending Recharges</div>
                <div className="text-xl font-black text-amber-600 mt-1">{overview?.pendingRecharges || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-[10px] text-slate-400">Pending Withdrawals</div>
                <div className="text-xl font-black text-rose-600 mt-1">{overview?.pendingWithdrawals || 0}</div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 col-span-2">
                <div className="text-[10px] text-slate-400">Approved Volume</div>
                <div className="flex justify-between items-baseline mt-1">
                  <div>
                    <span className="text-xs text-slate-500">Recharged: </span>
                    <span className="text-base font-black text-emerald-600">₹{overview?.totalRecharged || 0}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Withdrawn: </span>
                    <span className="text-base font-black text-slate-800">₹{overview?.totalWithdrawn || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold text-slate-800">Registered Users ({users.length})</h2>
            {users.map((u) => (
              <div key={u._id} className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900">{u.phone}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {u.role.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Available: ₹{u.wallet?.availableBalance || 0}</span>
                  <span>Recharge: ₹{u.wallet?.rechargeBalance || 0}</span>
                  <span>Income: ₹{u.wallet?.totalIncome || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
