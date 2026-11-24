import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Search, Image as ImageIcon, Check, Folder, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

export const MediaPickerModal = ({ isOpen, onClose, onSelect, title = 'Select Media Asset' }) => {
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState(['all', 'general', 'fleet', 'banners', 'icons']);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const params = { limit: 60 };
      if (selectedFolder !== 'all') params.folder = selectedFolder;
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
      setErrorMsg('Failed to load media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedItem(null);
    }
  }, [isOpen, selectedFolder]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg('');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', selectedFolder === 'all' ? 'general' : selectedFolder);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        const uploaded = res.data.data;
        setItems((prev) => [uploaded, ...prev]);
        setSelectedItem(uploaded);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload media asset');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmSelect = () => {
    if (selectedItem && onSelect) {
      onSelect(selectedItem.url, selectedItem);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ocean-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-brand/10 text-teal-brand flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">{title}</h3>
              <p className="text-[11px] text-slate-500">Pick an existing asset or upload a new image/video</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Search, Folder Filter, Upload Button) */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
                placeholder="Search media by title or filename..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-brand"
              />
            </div>
            <button
              onClick={fetchMedia}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-xs font-semibold"
              title="Refresh assets"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
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
              className="px-3.5 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Asset</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Folder Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] bg-slate-50/30">
          <span className="text-slate-400 font-bold uppercase tracking-wider mr-1 text-[10px] flex items-center gap-1">
            <Folder className="w-3 h-3" /> Folders:
          </span>
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                selectedFolder === f
                  ? 'bg-ocean-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-xs font-medium gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-brand" />
              <span>Loading media repository...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs">
              <ImageIcon className="w-10 h-10 mb-2 opacity-30" />
              <p className="font-semibold text-slate-600">No media assets found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Upload a new image or try a different filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {items.map((item) => {
                const isSelected = selectedItem?._id === item._id;
                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-brand ring-3 ring-teal-brand/30 shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                      {item.mimeType?.startsWith('video/') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 text-[10px]">
                          <span>VIDEO ({item.format?.toUpperCase()})</span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-brand text-white flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="p-2 bg-white">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{item.title || item.originalName}</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {(item.size / 1024).toFixed(0)} KB • {item.format?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer with Selection Actions */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="text-xs text-slate-500 truncate max-w-md">
            {selectedItem ? (
              <span className="font-semibold text-slate-800">
                Selected: <span className="text-teal-brand">{selectedItem.title || selectedItem.originalName}</span>
              </span>
            ) : (
              <span>Click any asset above to select</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedItem}
              className="px-5 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all disabled:opacity-40 shadow-sm"
            >
              Insert Selected Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
