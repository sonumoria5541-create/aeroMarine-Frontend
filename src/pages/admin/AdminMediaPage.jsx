import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Search,
  Image as ImageIcon,
  Folder,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Filter,
  HardDrive,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';

export const AdminMediaPage = () => {
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState(['all', 'general', 'fleet', 'banners', 'icons']);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Inspector edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editFolder, setEditFolder] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const fileInputRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (selectedFolder !== 'all') params.folder = selectedFolder;
      if (selectedType !== 'all') params.type = selectedType;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/media', { params });
      if (res.data?.success) {
        setItems(res.data.data.items || []);
        if (res.data.data.folders?.length) {
          setFolders(['all', ...res.data.data.folders.filter((f) => f !== 'all')]);
        }
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      showToast('Error loading media assets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder, selectedType]);

  const handleSelectInspect = (item) => {
    setSelectedItem(item);
    setEditTitle(item.title || '');
    setEditAltText(item.altText || '');
    setEditCaption(item.caption || '');
    setEditFolder(item.folder || 'general');
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', selectedFolder === 'all' ? 'general' : selectedFolder);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        showToast('Asset uploaded successfully!', 'success');
        setItems((prev) => [res.data.data, ...prev]);
        handleSelectInspect(res.data.data);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to upload media asset'), 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      setSavingEdit(true);
      const res = await api.patch(`/admin/media/${selectedItem._id}`, {
        title: editTitle,
        altText: editAltText,
        caption: editCaption,
        folder: editFolder,
      });

      if (res.data?.success) {
        showToast('Asset metadata saved', 'success');
        const updated = res.data.data;
        setSelectedItem(updated);
        setItems((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to save asset details'), 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteItem = async (force = false) => {
    if (!selectedItem) return;
    if (!window.confirm(`Are you sure you want to delete '${selectedItem.title || selectedItem.originalName}'?`)) {
      return;
    }

    try {
      setDeleting(true);
      const res = await api.delete(`/admin/media/${selectedItem._id}`, { data: { force } });
      if (res.data?.success) {
        showToast('Media asset deleted', 'success');
        setItems((prev) => prev.filter((it) => it._id !== selectedItem._id));
        setSelectedItem(null);
      }
    } catch (err) {
      if (err.response?.data?.isUsed) {
        if (window.confirm(`${err.response.data.message}\n\nDo you want to FORCE delete this asset anyway?`)) {
          handleDeleteItem(true);
        }
      } else {
        showToast(getApiErrorMessage(err, 'Failed to delete asset'), 'error');
      }
    } finally {
      setDeleting(false);
    }
  };

  const copyUrlToClipboard = () => {
    if (!selectedItem?.url) return;
    navigator.clipboard.writeText(selectedItem.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    showToast('Asset URL copied to clipboard!', 'success');
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

      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900 tracking-tight flex items-center gap-2.5">
            <HardDrive className="w-6 h-6 text-teal-brand" />
            <span>Media Asset Library</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository for website images, vessel photos, banners, and marketing assets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-ocean-900 to-teal-brand hover:from-ocean-800 hover:to-teal-hover text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-brand/20 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading Asset...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload New Media</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
            placeholder="Search media by title or name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-brand"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'all' ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'image' ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'video' ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Videos
            </button>
          </div>

          <button
            onClick={fetchMedia}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] shrink-0 mr-1 flex items-center gap-1">
          <Folder className="w-3.5 h-3.5" /> Folders:
        </span>
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFolder(f)}
            className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-all shrink-0 ${
              selectedFolder === f
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Layout: Grid + Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Media Grid */}
        <div className={`space-y-4 ${selectedItem ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {loading ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-teal-brand" />
              <span>Loading media repository...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-ocean-900" />
              <p className="font-bold text-slate-700 text-sm">No media assets in this view</p>
              <p className="text-slate-400 mt-1">Upload a photo or vessel graphic to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {items.map((item) => {
                const isSelected = selectedItem?._id === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelectInspect(item)}
                    className={`group bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-brand ring-4 ring-teal-brand/20 shadow-lg scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {item.mimeType?.startsWith('video/') ? (
                        <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center text-xs font-mono">
                          <span>VIDEO</span>
                          <span className="text-[10px] text-slate-400">{item.format?.toUpperCase()}</span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute top-2 left-2 bg-ocean-950/75 backdrop-blur-xs text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">
                        {item.format?.toUpperCase()}
                      </div>
                    </div>

                    <div className="p-3 bg-white">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.title || item.originalName}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>{(item.size / 1024).toFixed(0)} KB</span>
                        <span className="capitalize">{item.folder}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Asset Inspector Drawer */}
        {selectedItem && (
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-brand" />
                <span>Asset Inspector</span>
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center relative">
              {selectedItem.mimeType?.startsWith('video/') ? (
                <video src={selectedItem.url} controls className="w-full h-full object-contain" />
              ) : (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.altText || selectedItem.title}
                  className="w-full h-full object-contain bg-slate-900/5"
                />
              )}
            </div>

            {/* URL Copy Button */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700">Direct Asset URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedItem.url}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-700 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={copyUrlToClipboard}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-teal-brand hover:text-white text-slate-600 transition-colors shrink-0"
                  title="Copy link"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={selectedItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-ocean-900 hover:text-white text-slate-600 transition-colors shrink-0"
                  title="Open full resolution"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Metadata Edit Form */}
            <form onSubmit={handleSaveDetails} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Asset Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Alt Description (SEO & Accessibility)</label>
                <input
                  type="text"
                  value={editAltText}
                  onChange={(e) => setEditAltText(e.target.value)}
                  placeholder="e.g. 40ft Reefer Container at Mumbai Port"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Folder</label>
                  <input
                    type="text"
                    value={editFolder}
                    onChange={(e) => setEditFolder(e.target.value.toLowerCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Storage Provider</label>
                  <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono capitalize text-slate-600">
                    {selectedItem.storageProvider}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Asset Info'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(false)}
                  disabled={deleting}
                  className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors disabled:opacity-50"
                  title="Delete asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
