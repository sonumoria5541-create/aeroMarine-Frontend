import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Users, Search, ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusReason, setStatusReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = searchTerm ? `/admin/users?search=${encodeURIComponent(searchTerm)}` : '/admin/users';
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
  }, [searchTerm]);

  const handleStatusChange = async (newStatus) => {
    if (!statusReason.trim()) {
      alert('Please specify an operational audit reason.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.patch(`/admin/users/${selectedUser._id}/status`, {
        status: newStatus,
        reason: statusReason.trim(),
      });
      if (res.data?.success) {
        setSelectedUser(null);
        setStatusReason('');
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">Member Account Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit user accounts and review real-time balances derived from the immutable ledger
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none focus:border-teal-brand"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading accounts directory...</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">No member accounts match the search query.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div
                key={u._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ocean-900 text-sm">{u.name}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {u.role}
                    </span>
                    <StatusBadge status={u.status} />
                  </div>
                  <p className="font-mono text-slate-500">
                    Phone: <span className="font-bold text-ocean-900">{u.phone}</span> &bull; Referral Code:{' '}
                    <span className="font-bold uppercase text-teal-brand">{u.referralCode}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Joined: {formatDate(u.createdAt)}</p>
                </div>

                <div className="flex items-center gap-4 sm:justify-end">
                  <div className="text-right space-y-0.5">
                    <span className="text-sm font-bold text-ocean-900 block">
                      Avail: {formatINR(u.wallet?.availableBalance || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Reserved: {formatINR(u.wallet?.reservedBalance || 0)} &bull; Pending: {formatINR(u.wallet?.pendingDeposits || 0)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setStatusReason(u.statusReason || '');
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-ocean-900 font-bold text-xs transition-colors shadow-sm"
                  >
                    Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suspend / Activate Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Member Status Administration"
        subtitle={`Member: ${selectedUser?.name} (${selectedUser?.phone})`}
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <StatusBadge status={selectedUser.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Available Balance:</span>
                <span className="font-bold text-ocean-900">{formatINR(selectedUser.wallet?.availableBalance || 0)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900 block">Operational Reason (Required)</label>
              <textarea
                rows={3}
                required
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Specify the compliance or security audit reason..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {selectedUser.status === 'active' ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleStatusChange('suspended')}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Suspend Account
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleStatusChange('active')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Reactivate Account
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
