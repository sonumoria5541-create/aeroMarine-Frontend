import React, { useState, useEffect } from 'react';
import {
  Menu as MenuIcon,
  Plus,
  Save,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';

export const AdminNavigationPage = () => {
  const [menus, setMenus] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New item form state
  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');
  const [newIsExternal, setNewIsExternal] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/navigation');
      if (res.data?.success) {
        setMenus(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
      showToast('Error loading navigation menus', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const currentMenu = menus.find((m) => m.location === selectedLocation) || {
    location: selectedLocation,
    title: `${selectedLocation.toUpperCase()} Navigation`,
    items: [],
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !newHref.trim()) {
      showToast('Label and target link are required', 'error');
      return;
    }

    const newItem = {
      id: `menu_${Date.now()}`,
      label: newLabel.trim(),
      href: newHref.trim(),
      isExternal: newIsExternal,
      order: (currentMenu.items?.length || 0) + 1,
    };

    const updatedItems = [...(currentMenu.items || []), newItem];
    setMenus((prev) =>
      prev.map((m) => (m.location === selectedLocation ? { ...m, items: updatedItems } : m))
    );

    setNewLabel('');
    setNewHref('');
    setNewIsExternal(false);
    showToast('Menu link added to list', 'success');
  };

  const handleMove = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentMenu.items.length) return;

    const updated = [...currentMenu.items];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    updated.forEach((it, idx) => {
      it.order = idx + 1;
    });

    setMenus((prev) =>
      prev.map((m) => (m.location === selectedLocation ? { ...m, items: updated } : m))
    );
  };

  const handleDeleteItem = (itemId) => {
    const updated = currentMenu.items.filter((it) => it.id !== itemId);
    setMenus((prev) =>
      prev.map((m) => (m.location === selectedLocation ? { ...m, items: updated } : m))
    );
  };

  const handleUpdateItem = (itemId, field, value) => {
    const updated = currentMenu.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it));
    setMenus((prev) =>
      prev.map((m) => (m.location === selectedLocation ? { ...m, items: updated } : m))
    );
  };

  const handleSaveMenu = async () => {
    try {
      setSaving(true);
      const res = await api.patch(`/admin/navigation/${selectedLocation}`, {
        title: currentMenu.title,
        items: currentMenu.items,
        isActive: true,
      });

      if (res.data?.success) {
        showToast(`Saved ${selectedLocation} navigation menu successfully!`, 'success');
        const saved = res.data.data;
        setMenus((prev) => prev.map((m) => (m.location === selectedLocation ? saved : m)));
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to save menu'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-teal-brand" />
        <span>Loading navigation menus...</span>
      </div>
    );
  }

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
            <MenuIcon className="w-6 h-6 text-teal-brand" />
            <span>Navigation & Menu Architecture</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage top header links, footer columns, and mobile navigation items
          </p>
        </div>

        <button
          onClick={handleSaveMenu}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ocean-900 to-teal-brand hover:from-ocean-800 hover:to-teal-hover text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-brand/20 disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving Menu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Menu Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Menu Location Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        {[
          { id: 'header', label: 'Top Header Navigation' },
          { id: 'footer', label: 'Footer Navigation Columns' },
        ].map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocation(loc.id)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              selectedLocation === loc.id
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Menu Items Stack */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Active Links in {selectedLocation.toUpperCase()} ({currentMenu.items?.length || 0})
            </h3>
            <span className="text-[11px] text-slate-400">Reorder links using up / down arrows</span>
          </div>

          {currentMenu.items?.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No links in this menu. Add one below.</div>
          ) : (
            <div className="space-y-2.5">
              {currentMenu.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-white text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-200">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateItem(item.id, 'label', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 text-xs flex-1 max-w-[200px]"
                    />
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => handleUpdateItem(item.id, 'href', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-700 text-xs flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-20"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentMenu.items.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-20"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Link Form */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="pb-2 border-b border-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-brand" />
            <h3 className="font-bold text-sm text-ocean-900">Add Link to Menu</h3>
          </div>

          <form onSubmit={handleAddItem} className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Display Label *</label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Maritime Operations"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Destination Route / URL *</label>
              <input
                type="text"
                required
                value={newHref}
                onChange={(e) => setNewHref(e.target.value)}
                placeholder="e.g. /about or /#plans"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:border-teal-brand"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 pt-1">
              <input
                type="checkbox"
                checked={newIsExternal}
                onChange={(e) => setNewIsExternal(e.target.checked)}
                className="w-4 h-4 rounded text-teal-brand"
              />
              <span>Open in new browser tab</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold transition-colors shadow-sm"
            >
              Add Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
