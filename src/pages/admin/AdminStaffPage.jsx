import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Key,
  Trash2,
  Edit2,
  X,
  RefreshCw,
  Lock,
  Phone,
  UserCheck,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';

const AVAILABLE_PERMISSIONS = [
  { id: 'pages.manage', label: 'Pages & Section Builder', desc: 'Create, edit, and publish website landing pages' },
  { id: 'media.manage', label: 'Media Library Manager', desc: 'Upload, delete, and inspect images and videos' },
  { id: 'inquiries.manage', label: 'Inquiries & Leads Desk', desc: 'Triage customer inquiries and log internal notes' },
  { id: 'appearance.manage', label: 'Website Branding & Appearance', desc: 'Modify logo, colors, header, and footer' },
  { id: 'seo.manage', label: 'SEO & Sitemap Engine', desc: 'Audit meta tags and configure crawler settings' },
  { id: 'deposits.manage', label: 'Deposit Verification', desc: 'Approve or reject member bank recharge requests' },
  { id: 'withdrawals.manage', label: 'Payout Processing', desc: 'Approve and reconcile withdrawal payments' },
  { id: 'users.manage', label: 'User Member Accounts', desc: 'Inspect balances, suspend/unblock member accounts' },
  { id: 'settings.manage', label: 'Platform Financial Settings', desc: 'Update banking coordinates and limits' },
];

export const AdminStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // Create Staff Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState('support');
  const [createPermissions, setCreatePermissions] = useState(['inquiries.manage']);
  const [submitting, setSubmitting] = useState(false);

  // Edit Staff Modal State
  const [editingStaff, setEditingStaff] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/staff');
      if (res.data?.success) {
        setStaff(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
      showToast('Error loading staff officers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!createPhone || createPhone.length !== 10) {
      showToast('10-digit mobile number is required', 'error');
      return;
    }
    if (!createPassword || createPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/admin/staff', {
        name: createName,
        phone: createPhone,
        password: createPassword,
        role: createRole,
        permissions: createPermissions,
      });

      if (res.data?.success) {
        showToast(`Staff account for ${createPhone} created!`, 'success');
        setShowCreateModal(false);
        setCreateName('');
        setCreatePhone('');
        setCreatePassword('');
        setCreateRole('support');
        setCreatePermissions(['inquiries.manage']);
        fetchStaff();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to create staff account'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    try {
      setSubmitting(true);
      const res = await api.patch(`/admin/staff/${editingStaff._id}`, {
        name: editingStaff.name,
        role: editingStaff.role,
        permissions: editingStaff.permissions,
        status: editingStaff.status,
      });

      if (res.data?.success) {
        showToast('Staff privileges updated successfully', 'success');
        setEditingStaff(null);
        fetchStaff();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to update staff'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (officer) => {
    if (officer.isProtectedOwner || officer.phone === '8427348239') {
      showToast('Security Violation: Primary owner account cannot be revoked.', 'error');
      return;
    }

    if (!window.confirm(`Revoke administrative staff privileges for ${officer.phone}?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/staff/${officer._id}`);
      if (res.data?.success) {
        showToast('Staff privileges revoked', 'success');
        fetchStaff();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to revoke staff'), 'error');
    }
  };

  const togglePermission = (permId, isEditing = false) => {
    if (isEditing && editingStaff) {
      const cur = editingStaff.permissions || [];
      const updated = cur.includes(permId) ? cur.filter((p) => p !== permId) : [...cur, permId];
      setEditingStaff({ ...editingStaff, permissions: updated });
    } else {
      setCreatePermissions((prev) =>
        prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top ${
            toastType === 'success' ? 'bg-[#0077B6]' : 'bg-rose-600'
          }`}
        >
          {toastType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-teal-brand" />
            <span>Staff Administration & Granular RBAC</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage administrative officers, assign role-based privileges, and control desk permissions
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-ocean-900 to-teal-brand hover:from-ocean-800 hover:to-teal-hover text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-brand/20 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Officer</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Staff Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Permissions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-brand" />
                    <span>Loading staff directory...</span>
                  </td>
                </tr>
              ) : (
                staff.map((u) => {
                  const isOwner = u.isProtectedOwner || u.phone === '8427348239';
                  const permCount = u.permissions?.length || 0;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-2xl bg-ocean-100 text-ocean-900 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name ? u.name.charAt(0).toUpperCase() : <ShieldCheck className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-sm">{u.name || 'Staff Officer'}</span>
                              {isOwner && (
                                <span className="bg-container-orange/15 text-container-orange text-[9px] font-bold px-1.5 py-0.2 rounded border border-container-orange/30">
                                  Primary Owner
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">{u.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold font-mono px-2 py-0.5 rounded capitalize">
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {isOwner ? (
                          <span className="text-teal-brand font-bold text-[11px]">All Privileges (Full Superadmin)</span>
                        ) : permCount > 0 ? (
                          <span className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-blue-100">
                            {permCount} permission module{permCount === 1 ? '' : 's'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Role default access only</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingStaff(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-brand hover:bg-slate-100 transition-colors"
                            title="Edit permissions"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleRevoke(u)}
                            disabled={isOwner}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isOwner
                                ? 'text-slate-200 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={isOwner ? 'Cannot revoke primary owner' : 'Revoke staff privileges'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Provision New Staff Officer</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g. Officer Amit Kumar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:border-teal-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Password *</label>
                  <input
                    type="password"
                    required
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Role</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  >
                    <option value="support">Support Coordinator</option>
                    <option value="operations">Operations Officer</option>
                    <option value="finance">Finance Specialist</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Granular Permission Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block text-xs">Granular Desk Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = createPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition-all ${
                          isChecked ? 'bg-teal-brand/5 border-teal-brand' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id, false)}
                          className="mt-0.5 rounded text-teal-brand"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">{perm.label}</span>
                          <span className="text-[10px] text-slate-500 leading-tight">{perm.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Creating Officer...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">
                Edit Officer: {editingStaff.name || editingStaff.phone}
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Role</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="support">Support Coordinator</option>
                    <option value="operations">Operations Officer</option>
                    <option value="finance">Finance Specialist</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Account Status</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              {/* Granular Permission Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-bold text-slate-800 block text-xs">Granted Desk Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = editingStaff.permissions?.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition-all ${
                          isChecked ? 'bg-teal-brand/5 border-teal-brand' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id, true)}
                          className="mt-0.5 rounded text-teal-brand"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">{perm.label}</span>
                          <span className="text-[10px] text-slate-500 leading-tight">{perm.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Privileges'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
