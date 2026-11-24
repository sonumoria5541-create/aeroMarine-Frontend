import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  User,
  MessageSquare,
  FileText,
  Download,
  Trash2,
  X,
  RefreshCw,
  Send,
  Calendar,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ new: 0, in_progress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Note form state
  const [newAdminNote, setNewAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/inquiries', { params });
      if (res.data?.success) {
        setInquiries(res.data.data.inquiries || []);
        if (res.data.data.statusCounts) {
          setStatusCounts(res.data.data.statusCounts);
        }
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      showToast('Error loading inquiries desk', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, priorityFilter]);

  const handleUpdateStatus = async (inqId, newStatus) => {
    try {
      setUpdating(true);
      const res = await api.patch(`/admin/inquiries/${inqId}`, { status: newStatus });
      if (res.data?.success) {
        showToast(`Inquiry marked as ${newStatus}`, 'success');
        const updated = res.data.data;
        setSelectedInquiry(updated);
        setInquiries((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to update status'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedInquiry || !newAdminNote.trim()) return;

    try {
      setUpdating(true);
      const res = await api.patch(`/admin/inquiries/${selectedInquiry._id}`, {
        adminNote: newAdminNote.trim(),
      });
      if (res.data?.success) {
        showToast('Internal note recorded', 'success');
        const updated = res.data.data;
        setSelectedInquiry(updated);
        setInquiries((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
        setNewAdminNote('');
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to add note'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (inqId) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      const res = await api.delete(`/admin/inquiries/${inqId}`);
      if (res.data?.success) {
        showToast('Inquiry deleted successfully', 'success');
        setInquiries((prev) => prev.filter((it) => it._id !== inqId));
        if (selectedInquiry?._id === inqId) setSelectedInquiry(null);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to delete inquiry'), 'error');
    }
  };

  const exportCSV = () => {
    if (inquiries.length === 0) {
      showToast('No inquiries to export', 'error');
      return;
    }

    const headers = ['Inquiry ID', 'Date', 'Name', 'Email', 'Phone', 'Subject', 'Status', 'Message'];
    const rows = inquiries.map((inq) => [
      inq.inquiryId,
      new Date(inq.createdAt).toISOString(),
      `"${inq.name.replace(/"/g, '""')}"`,
      inq.email,
      inq.phone,
      `"${(inq.subject || '').replace(/"/g, '""')}"`,
      inq.status,
      `"${inq.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aeromarine_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries CSV exported successfully!', 'success');
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
            <Inbox className="w-6 h-6 text-teal-brand" />
            <span>Port Inquiries & Leads Desk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Triage contact messages, manage inquiry status, and assign coordinator follow-up notes
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-teal-brand" />
          <span>Export Inquiries CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Inquiries</span>
          <div className="text-2xl font-black text-blue-600">{statusCounts.new || 0}</div>
          <span className="text-[10px] text-slate-500">Requires triage</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
          <div className="text-2xl font-black text-amber-600">{statusCounts.in_progress || 0}</div>
          <span className="text-[10px] text-slate-500">Being handled</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolved</span>
          <div className="text-2xl font-black text-emerald-600">{statusCounts.resolved || 0}</div>
          <span className="text-[10px] text-slate-500">Completed cases</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
          <div className="text-2xl font-black text-ocean-900">{inquiries.length}</div>
          <span className="text-[10px] text-slate-500">Lifetime logged</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInquiries()}
            placeholder="Search inquiries by name, email, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-brand"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            {['all', 'new', 'in_progress', 'resolved', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={fetchInquiries}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Inquiries Table + Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={`space-y-4 ${selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Inquirer & Subject</th>
                    <th className="py-3.5 px-4">Contact Coords</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-brand" />
                        <span>Loading customer inquiries...</span>
                      </td>
                    </tr>
                  ) : inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30 text-ocean-900" />
                        <p className="font-bold text-slate-700">No inquiries match this filter</p>
                      </td>
                    </tr>
                  ) : (
                    inquiries.map((inq) => {
                      const isSelected = selectedInquiry?._id === inq._id;
                      return (
                        <tr
                          key={inq._id}
                          onClick={() => setSelectedInquiry(inq)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-teal-brand/5 font-semibold' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-ocean-100 text-ocean-800 flex items-center justify-center font-bold text-xs shrink-0">
                                {inq.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate max-w-[200px]">
                                <span className="font-bold text-slate-900 block truncate">{inq.name}</span>
                                <span className="text-[11px] text-slate-500 truncate block">
                                  {inq.subject || 'Inquiry'}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                            <div>{inq.email}</div>
                            {inq.phone && <div className="text-[10px] text-slate-400">{inq.phone}</div>}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider capitalize ${
                                inq.status === 'new'
                                  ? 'bg-blue-100 text-blue-700'
                                  : inq.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-700'
                                  : inq.status === 'resolved'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {inq.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                            {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(inq._id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Inquiry Detail Inspector */}
        {selectedInquiry && (
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5 sticky top-24 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-brand uppercase">
                  {selectedInquiry.inquiryId}
                </span>
                <h3 className="font-extrabold text-sm text-ocean-900">{selectedInquiry.name}</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <a
                href={`mailto:${selectedInquiry.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 transition-colors font-medium"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{selectedInquiry.email}</span>
              </a>

              {selectedInquiry.phone && (
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedInquiry.phone}</span>
                </a>
              )}
            </div>

            {/* Subject and Message Box */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block text-[11px]">
                Subject: {selectedInquiry.subject || 'General Inquiry'}
              </span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
            </div>

            {/* Status & Priority Controller */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Triage Status</label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedInquiry._id, e.target.value)}
                  disabled={updating}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="spam">Spam</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Priority</label>
                <select
                  value={selectedInquiry.priority || 'normal'}
                  onChange={async (e) => {
                    await api.patch(`/admin/inquiries/${selectedInquiry._id}`, { priority: e.target.value });
                    setSelectedInquiry({ ...selectedInquiry, priority: e.target.value });
                    showToast('Priority updated', 'success');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Coordinator Internal Notes Trail */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-teal-brand" />
                <span>Coordinator Audit Notes ({selectedInquiry.adminNotes?.length || 0})</span>
              </label>

              {selectedInquiry.adminNotes?.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedInquiry.adminNotes.map((nt, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-100/70 border border-slate-200 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="font-bold text-slate-700">{nt.author}</span>
                        <span>{new Date(nt.createdAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-slate-800 text-[11px]">{nt.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newAdminNote}
                  onChange={(e) => setNewAdminNote(e.target.value)}
                  placeholder="Add internal note or resolution summary..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-brand"
                />
                <button
                  type="submit"
                  disabled={updating || !newAdminNote.trim()}
                  className="px-3.5 py-2 bg-ocean-900 hover:bg-ocean-800 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
