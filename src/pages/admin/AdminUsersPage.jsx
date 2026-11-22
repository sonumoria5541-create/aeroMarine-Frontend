import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Box,
  CreditCard,
  FileText,
  UserCheck,
  Lock,
  Unlock,
  AlertTriangle,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected User Drawer / Modal
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'records', 'notes'

  // Actions
  const [statusReason, setStatusReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [reconcileResult, setReconcileResult] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);

      const url = `/admin/users?${queryParams.toString()}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter]);

  const openUserDetails = async (u) => {
    setSelectedUser(u);
    setStatusReason('');
    setReconcileResult('');
    setActiveTab('overview');
    setInspectModalOpen(true);
    setDetailsLoading(true);

    try {
      const res = await api.get(`/admin/users/${u._id}`);
      if (res.data?.success) {
        setUserDetails(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load user details:', e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!statusReason.trim()) {
      alert('Please specify an operational audit reason.');
      return;
    }

    try {
      setSubmittingAction(true);
      const res = await api.patch(`/admin/users/${selectedUser._id}/status`, {
        status: newStatus,
        reason: statusReason.trim(),
      });
      if (res.data?.success) {
        setStatusReason('');
        const updated = await api.get(`/admin/users/${selectedUser._id}`);
        if (updated.data?.success) {
          setUserDetails(updated.data.data);
          setSelectedUser(updated.data.data.user);
        }
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setNoteSubmitting(true);
      const res = await api.post(`/admin/users/${selectedUser._id}/notes`, {
        note: newNote.trim(),
      });
      if (res.data?.success) {
        setNewNote('');
        const updated = await api.get(`/admin/users/${selectedUser._id}`);
        if (updated.data?.success) {
          setUserDetails(updated.data.data);
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add admin note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleReconcileLedger = async () => {
    try {
      setReconcileResult('Reconciling ledger transactions with immutable balance entries...');
      const res = await api.get(`/admin/reconcile/${selectedUser._id}`);
      if (res.data?.success) {
        setReconcileResult(
          `Reconciliation successful! Calculated Balance: ₹${res.data.data?.calculatedBalance || 0}. Status: Balanced.`
        );
        fetchUsers();
      }
    } catch (err) {
      setReconcileResult(err.response?.data?.message || 'Reconciliation failed.');
    }
  };

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    blocked: users.filter((u) => u.status === 'blocked').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Page Title & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
            Member Account Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit registered members, review immutable ledger balances, and enforce account governance
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, phone, or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-brand shadow-sm"
            />
          </div>

          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm flex-shrink-0"
            title="Refresh member list"
            aria-label="Refresh member list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs with Horizontal Swipe */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: `All Members (${counts.total})` },
          { id: 'active', label: `Active (${counts.active})` },
          { id: 'suspended', label: `Suspended (${counts.suspended})` },
          { id: 'blocked', label: `Blocked (${counts.blocked})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex-shrink-0 text-xs ${
              statusFilter === tab.id
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Member Directory List */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-16 text-center">Loading accounts directory...</p>
        ) : users.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No member accounts match your search filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div
                key={u._id}
                className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-ocean-900 text-sm truncate max-w-[180px] sm:max-w-none">
                      {u.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                      {u.role}
                    </span>
                    <StatusBadge status={u.status} className="flex-shrink-0" />
                    {u.isProtectedOwner && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">
                        Protected Owner
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-slate-500 break-words">
                    Phone: <span className="font-bold text-ocean-900">{u.phone}</span> &bull; Ref Code:{' '}
                    <span className="font-bold uppercase text-teal-brand">{u.referralCode}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Registered: {formatDate(u.createdAt)} &bull; Last Login: {u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}
                  </p>
                </div>

                {/* Balance & Action Bottom Row for Mobile, Right Aligned for Desktop */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right space-y-0.5 min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-ocean-900 block truncate">
                      Avail: {formatINR(u.wallet?.availableBalance || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block truncate">
                      Reserved: {formatINR(u.wallet?.reservedBalance || 0)}
                    </span>
                  </div>

                  <button
                    onClick={() => openUserDetails(u)}
                    className="px-3.5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs transition-all shadow-sm flex-shrink-0"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive User Profile Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title={userDetails?.user ? `Member: ${userDetails.user.name}` : 'Member Profile Inspection'}
        subtitle={userDetails?.user ? `Phone: ${userDetails.user.phone} • ID: ${userDetails.user._id}` : ''}
        maxWidth="max-w-4xl"
      >
        {detailsLoading ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-500">Loading comprehensive member profile...</div>
        ) : !userDetails?.user ? (
          <div className="p-6 sm:p-8 text-center text-xs text-slate-500">Member details unavailable.</div>
        ) : (
          <div className="space-y-4 sm:space-y-5 text-xs text-slate-800">
            {/* Modal Internal Navigation Tabs */}
            <div className="flex border-b border-slate-200 text-xs font-bold gap-1 sm:gap-2 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
              {[
                { id: 'overview', label: 'Account & Actions', icon: UserCheck },
                { id: 'orders', label: `Fleet Containers (${userDetails.orders?.length || 0})`, icon: Box },
                { id: 'records', label: `Ledger Log (${userDetails.records?.length || 0})`, icon: CreditCard },
                { id: 'notes', label: `Admin Notes (${userDetails.user?.adminNotes?.length || 0})`, icon: FileText },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 pb-2 px-2.5 sm:px-3 border-b-2 transition-colors flex-shrink-0 ${
                      activeTab === t.id
                        ? 'border-container-orange text-ocean-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & STATUS CONTROL */}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-5">
                {/* Balance & Financial Snapshot Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block truncate">
                      Available Balance
                    </span>
                    <span className="text-sm sm:text-base font-bold text-teal-brand break-words">
                      {formatINR(userDetails.user.wallet?.availableBalance || 0)}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block truncate">
                      Reserved Payouts
                    </span>
                    <span className="text-sm sm:text-base font-bold text-amber-600 break-words">
                      {formatINR(userDetails.user.wallet?.reservedBalance || 0)}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block truncate">
                      Total Recharged
                    </span>
                    <span className="text-sm sm:text-base font-bold text-ocean-900 break-words">
                      {formatINR(userDetails.user.wallet?.rechargeBalance || 0)}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase block truncate">
                      Total Profit
                    </span>
                    <span className="text-sm sm:text-base font-bold text-ocean-900 break-words">
                      {formatINR(userDetails.user.wallet?.totalIncome || 0)}
                    </span>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Account Role:</span>{' '}
                      <span className="font-bold text-ocean-900 uppercase">{userDetails.user.role}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Current Status:</span>{' '}
                      <StatusBadge status={userDetails.user.status} />
                    </div>
                    <div>
                      <span className="text-slate-400">Invite Code:</span>{' '}
                      <span className="font-mono font-bold text-teal-brand">{userDetails.user.referralCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Registration Date:</span>{' '}
                      <span className="font-semibold text-ocean-900">{formatDate(userDetails.user.createdAt)}</span>
                    </div>
                    {userDetails.user.bankAccount?.accountNumber && (
                      <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                        <span className="text-slate-400 font-bold block mb-1">Linked Settlement Bank:</span>
                        <p className="font-mono text-ocean-900 break-all text-[11px] sm:text-xs">
                          {userDetails.user.bankAccount.bankName} &bull; A/C: {userDetails.user.bankAccount.accountNumber} &bull; IFSC: {userDetails.user.bankAccount.ifsc} &bull; Holder: {userDetails.user.bankAccount.holderName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reconciliation Action */}
                <div className="p-3 sm:p-4 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sky-900 text-xs sm:text-sm">Ledger Non-Destructive Reconciliation</h4>
                    <p className="text-[10px] sm:text-[11px] text-sky-700">
                      Verify that user wallet balances match the sum of immutable ledger entries.
                    </p>
                    {reconcileResult && <p className="text-[11px] font-bold text-teal-700 mt-1 break-words">{reconcileResult}</p>}
                  </div>
                  <button
                    onClick={handleReconcileLedger}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-colors text-center"
                  >
                    Reconcile Ledger
                  </button>
                </div>

                {/* Status Governance Actions */}
                <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 sm:space-y-3">
                  <h4 className="font-bold text-ocean-900 text-xs sm:text-sm">Account Status Governance</h4>

                  <div className="space-y-1">
                    <label className="font-bold text-ocean-900 block text-xs">
                      Audit Reason for Status Change <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      placeholder="Specify mandatory reason for suspension, unblocking, or reactivation..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
                    {userDetails.user.isProtectedOwner ? (
                      <div className="p-2.5 bg-amber-50 text-amber-800 text-xs rounded-xl font-bold flex items-center gap-1.5 w-full">
                        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span>Protected Owner account cannot be blocked or suspended.</span>
                      </div>
                    ) : (
                      <>
                        {userDetails.user.status !== 'active' && (
                          <button
                            type="button"
                            disabled={submittingAction}
                            onClick={() => handleStatusChange('active')}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 text-xs"
                          >
                            <Unlock className="w-4 h-4" />
                            <span>Reactivate / Restore Account</span>
                          </button>
                        )}

                        {userDetails.user.status === 'active' && (
                          <>
                            <button
                              type="button"
                              disabled={submittingAction}
                              onClick={() => handleStatusChange('suspended')}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 text-xs"
                            >
                              <Lock className="w-4 h-4" />
                              <span>Suspend Account (Reversible)</span>
                            </button>

                            <button
                              type="button"
                              disabled={submittingAction}
                              onClick={() => handleStatusChange('blocked')}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 text-xs"
                            >
                              <ShieldAlert className="w-4 h-4" />
                              <span>Block User Permanently</span>
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTAINER ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {userDetails.orders?.length === 0 ? (
                  <p className="text-center py-8 text-slate-400">No container fleet units leased by this member.</p>
                ) : (
                  userDetails.orders?.map((ord) => (
                    <div key={ord._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-ocean-900 truncate">{ord.planSnapshot?.name || 'Container Plan'}</span>
                          <StatusBadge status={ord.status} />
                        </div>
                        <p className="text-slate-500">
                          Duration: {ord.planSnapshot?.durationDays} Days &bull; Daily Rate: {ord.planSnapshot?.dailyRatePercent}%
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400">
                          Active: {formatDate(ord.createdAt)} to {formatDate(ord.endDate)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:text-right pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                        <span className="text-[10px] text-slate-400 font-mono sm:hidden">ID: {ord._id.slice(-6)}</span>
                        <span className="font-bold text-ocean-900 block">{formatINR(ord.amount)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: LEDGER RECORDS */}
            {activeTab === 'records' && (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {userDetails.records?.length === 0 ? (
                  <p className="text-center py-8 text-slate-400">No ledger transactions posted for this user.</p>
                ) : (
                  userDetails.records?.map((rec) => (
                    <div key={rec._id} className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold uppercase text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 flex-shrink-0">
                            {rec.type}
                          </span>
                          <span className="text-slate-700 truncate">{rec.description}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(rec.createdAt)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span
                          className={`font-bold block ${
                            rec.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {rec.amount >= 0 ? '+' : ''}{formatINR(rec.amount)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Bal: {formatINR(rec.balanceAfter || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: ADMIN NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-3 sm:space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <label className="font-bold text-ocean-900 block text-xs">Add Internal Compliance Note</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal observation, verification note, or customer support record..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
                    />
                    <button
                      type="submit"
                      disabled={noteSubmitting}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{noteSubmitting ? 'Posting...' : 'Post Note'}</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {!userDetails.user?.adminNotes || userDetails.user.adminNotes.length === 0 ? (
                    <p className="text-center py-6 text-slate-400 text-xs">No admin notes logged for this member.</p>
                  ) : (
                    userDetails.user.adminNotes.map((n, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                        <p className="text-slate-800 break-words">{n.note}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          By: {n.authorPhone || 'Admin'} &bull; {formatDate(n.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
