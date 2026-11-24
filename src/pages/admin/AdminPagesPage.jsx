import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  Edit3,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  Globe,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';

export const AdminPagesPage = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  // Create page modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/pages', { params });
      if (res.data?.success) {
        setPages(res.data.data.pages || []);
      }
    } catch (err) {
      console.error('Error fetching CMS pages:', err);
      showToast('Error loading pages list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [statusFilter]);

  const handleTitleChange = (val) => {
    setNewTitle(val);
    if (!newSlug || newSlug === '') {
      setNewSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) {
      showToast('Title and URL slug are required', 'error');
      return;
    }

    try {
      setCreating(true);
      const res = await api.post('/admin/pages', {
        title: newTitle.trim(),
        slug: newSlug.trim().toLowerCase(),
        description: newDescription.trim(),
        status: 'published',
        sections: [
          {
            id: `sec_${Date.now()}_1`,
            type: 'hero',
            name: 'Hero Section',
            title: newTitle.trim(),
            subtitle: 'AeroMarine Maritime Operations',
            content: newDescription.trim() || 'Welcome to this page.',
            settings: { visible: true, alignment: 'left' },
            order: 1,
          },
        ],
      });

      if (res.data?.success) {
        showToast('Page created successfully!', 'success');
        setShowCreateModal(false);
        setNewTitle('');
        setNewSlug('');
        setNewDescription('');
        navigate(`/admin/pages/${res.data.data._id}`);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to create page'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/admin/pages/${id}/duplicate`);
      if (res.data?.success) {
        showToast('Page duplicated as Draft', 'success');
        fetchPages();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to duplicate page'), 'error');
    }
  };

  const handleDelete = async (id, title, isSystem) => {
    if (isSystem) {
      showToast('System core pages (Home, About, Contact, Terms) are protected and cannot be deleted.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete '${title}'?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/pages/${id}`);
      if (res.data?.success) {
        showToast('Page deleted successfully', 'success');
        setPages((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to delete page'), 'error');
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
            <Layers className="w-6 h-6 text-teal-brand" />
            <span>CMS Website Pages</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public website pages, edit section content, configure SEO, and publish new routes
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-ocean-900 to-teal-brand hover:from-ocean-800 hover:to-teal-hover text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-brand/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPages()}
            placeholder="Search pages by title or slug..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-brand"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            {['all', 'published', 'draft'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === st ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={fetchPages}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh pages"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Page Title & Slug</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Sections</th>
                <th className="py-3.5 px-4">SEO Score</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-teal-brand" />
                    <span>Loading website pages...</span>
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-ocean-900" />
                    <p className="font-bold text-slate-700">No pages found</p>
                  </td>
                </tr>
              ) : (
                pages.map((p) => {
                  const sectionCount = p.sections?.length || 0;
                  const hasSeo = Boolean(p.seo?.title && p.seo?.description);
                  const isSystem = p.isSystemPage || ['home', 'about', 'contact', 'terms'].includes(p.slug);

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-ocean-100/60 text-ocean-800 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Link
                                to={`/admin/pages/${p._id}`}
                                className="font-bold text-ocean-900 hover:text-teal-brand transition-colors text-sm"
                              >
                                {p.title}
                              </Link>
                              {isSystem && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                                  System Core
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              /{p.slug === 'home' ? '' : p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {p.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-700">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {sectionCount} section{sectionCount === 1 ? '' : 's'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {hasSeo ? (
                          <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Optimized</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium text-[11px] flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Needs Meta</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(p.updatedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={p.slug === 'home' ? '/' : `/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-ocean-900 hover:bg-slate-100 transition-colors"
                            title="Preview on live website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          <Link
                            to={`/admin/pages/${p._id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-brand hover:bg-slate-100 transition-colors"
                            title="Open Section & Page Builder"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(p._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(p._id, p.title, isSystem)}
                            disabled={isSystem}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSystem
                                ? 'text-slate-200 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={isSystem ? 'System core page cannot be deleted' : 'Delete page'}
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

      {/* Create New Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-950/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-ocean-900">Create New Website Page</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Page Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Asia-Pacific Cargo Routes"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-brand font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">URL Slug *</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <span className="text-slate-400 font-mono mr-1">/</span>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                    placeholder="asia-pacific-cargo-routes"
                    className="flex-1 bg-transparent font-mono outline-none text-ocean-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Page Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of this page content..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-brand font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white font-bold shadow-sm disabled:opacity-50"
                >
                  {creating ? 'Creating Page...' : 'Create & Open Builder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
