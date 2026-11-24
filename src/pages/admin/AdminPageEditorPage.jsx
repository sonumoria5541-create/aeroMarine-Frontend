import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  RefreshCw,
  Settings,
  HelpCircle,
  Globe,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';
import { MediaPickerModal } from '../../components/common/MediaPickerModal';

export const AdminPageEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'seo' | 'preview'
  const [previewViewport, setPreviewViewport] = useState('mobile'); // 'mobile' | 'desktop'

  // Expanded section state (which section accordion is open)
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  // Media Picker state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null); // { type: 'featured' | 'sectionImage', sectionId, index }

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchPage = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/pages/${id}`);
      if (res.data?.success) {
        setPage(res.data.data);
        if (res.data.data.sections?.length > 0) {
          setExpandedSectionId(res.data.data.sections[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading page:', err);
      showToast('Error loading page details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [id]);

  const handleSavePage = async () => {
    if (!page) return;

    try {
      setSaving(true);
      const res = await api.patch(`/admin/pages/${page._id}`, {
        title: page.title,
        slug: page.slug,
        description: page.description,
        status: page.status,
        featuredImage: page.featuredImage,
        seo: page.seo,
        sections: page.sections,
      });

      if (res.data?.success) {
        showToast('Page changes saved successfully!', 'success');
        setPage(res.data.data);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to save page'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Section Manipulation
  const handleAddSection = (type) => {
    const secId = `sec_${Date.now()}`;
    const newSection = {
      id: secId,
      type,
      name: `${type.replace(/_/g, ' ').toUpperCase()} Block`,
      title: 'New Section Title',
      subtitle: 'Optional Section Subtitle',
      content: 'Add your section description or narrative here...',
      badge: '',
      images: [],
      buttons: [{ label: 'Action Button', href: '/#plans', variant: 'primary', isExternal: false }],
      items: [
        { title: 'Feature Item 1', description: 'Item description...', value: '100%', label: 'Metric' },
        { title: 'Feature Item 2', description: 'Item description...', value: '24h', label: 'Speed' },
      ],
      settings: { visible: true, alignment: 'left', paddingY: 'normal', containerWidth: 'wide' },
      order: (page.sections?.length || 0) + 1,
    };

    setPage((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
    setExpandedSectionId(secId);
    showToast(`Added ${type} section`, 'success');
  };

  const handleMoveSection = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= page.sections.length) return;

    const updated = [...page.sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);

    // Reassign order
    updated.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setPage((prev) => ({ ...prev, sections: updated }));
  };

  const handleToggleVisibility = (secId) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === secId
          ? { ...s, settings: { ...s.settings, visible: s.settings?.visible === false } }
          : s
      ),
    }));
  };

  const handleDeleteSection = (secId) => {
    if (!window.confirm('Delete this section?')) return;
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== secId),
    }));
  };

  const handleDuplicateSection = (sec) => {
    const clone = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec_${Date.now()}`,
      name: `${sec.name} (Copy)`,
      order: page.sections.length + 1,
    };
    setPage((prev) => ({
      ...prev,
      sections: [...prev.sections, clone],
    }));
    setExpandedSectionId(clone.id);
  };

  const updateSectionField = (secId, field, value) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === secId ? { ...s, [field]: value } : s)),
    }));
  };

  const updateSectionSetting = (secId, settingKey, value) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === secId
          ? { ...s, settings: { ...s.settings, [settingKey]: value } }
          : s
      ),
    }));
  };

  // Media Picker Callback
  const handleMediaSelected = (url, mediaItem) => {
    if (!mediaPickerTarget) return;

    if (mediaPickerTarget.type === 'featured') {
      setPage((prev) => ({ ...prev, featuredImage: url }));
    } else if (mediaPickerTarget.type === 'ogImage') {
      setPage((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: url } }));
    } else if (mediaPickerTarget.type === 'sectionImage') {
      setPage((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === mediaPickerTarget.sectionId
            ? {
                ...s,
                images: [...(s.images || []), { url, alt: mediaItem.altText || s.title, caption: '' }],
              }
            : s
        ),
      }));
    }
    setShowMediaPicker(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-teal-brand" />
        <span>Loading page editor...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs space-y-3">
        <p className="font-bold text-slate-700 text-sm">Page not found</p>
        <Link to="/admin/pages" className="text-teal-brand font-semibold hover:underline">
          Return to Pages List
        </Link>
      </div>
    );
  }

  const isSystemPage = page.isSystemPage || ['home', 'about', 'contact', 'terms'].includes(page.slug);

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

      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 bg-white p-5 rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/pages')}
            className="p-2 rounded-xl text-slate-400 hover:text-ocean-900 hover:bg-slate-100 transition-colors"
            title="Back to Pages list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-display text-ocean-900 tracking-tight">{page.title}</h1>
              {isSystemPage && (
                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                  System Page
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Live URL: /{page.slug === 'home' ? '' : page.slug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={page.status}
            onChange={(e) => setPage({ ...page, status: e.target.value })}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors outline-none cursor-pointer ${
              page.status === 'published'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <option value="published">Status: Published</option>
            <option value="draft">Status: Draft</option>
            <option value="archived">Status: Archived</option>
          </select>

          <a
            href={page.slug === 'home' ? '/' : `/${page.slug}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Preview in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleSavePage}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ocean-900 to-teal-brand hover:from-ocean-800 hover:to-teal-hover text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-brand/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'sections'
              ? 'bg-ocean-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Section Builder ({page.sections?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'bg-ocean-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Social Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'bg-ocean-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Interactive Preview</span>
        </button>
      </div>

      {/* TAB 1: SECTION BUILDER */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {/* Add Section Action Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-brand" />
              <span>Add Dynamic Section to Page:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { type: 'hero', label: '+ Hero Banner' },
                { type: 'announcement_banner', label: '+ Live Marquee' },
                { type: 'plans_catalog', label: '+ Fleet Catalog' },
                { type: 'stats', label: '+ Stats Counters' },
                { type: 'features', label: '+ How It Works / Steps' },
                { type: 'about_story', label: '+ Story & Narrative' },
                { type: 'testimonials', label: '+ Member Testimonials' },
                { type: 'faq', label: '+ FAQ Accordion' },
                { type: 'rich_text', label: '+ Rich Text Block' },
                { type: 'cta', label: '+ Call-To-Action Banner' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => handleAddSection(btn.type)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-brand hover:text-white text-slate-700 text-xs font-bold transition-all"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Stack */}
          {page.sections?.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-30 text-ocean-900" />
              <p className="font-bold text-slate-700">No sections on this page yet</p>
              <p className="text-slate-400 mt-1">Click any section type above to add it to your page layout.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {page.sections.map((sec, idx) => {
                const isExpanded = expandedSectionId === sec.id;
                const isVisible = sec.settings?.visible !== false;

                return (
                  <div
                    key={sec.id}
                    className={`bg-white rounded-3xl border transition-all shadow-sm ${
                      isExpanded ? 'border-teal-brand shadow-md ring-1 ring-teal-brand/20' : 'border-slate-200'
                    } ${!isVisible ? 'opacity-60 bg-slate-50/50' : ''}`}
                  >
                    {/* Section Accordion Title Bar */}
                    <div className="p-4 flex items-center justify-between gap-3 border-b border-slate-100">
                      <div
                        onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-ocean-900 truncate">
                              {sec.title || sec.name}
                            </span>
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded capitalize">
                              {sec.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {sec.subtitle && (
                            <span className="text-[11px] text-slate-400 truncate block">{sec.subtitle}</span>
                          )}
                        </div>
                      </div>

                      {/* Section Quick Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(sec.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isVisible ? 'text-slate-400 hover:text-slate-600' : 'text-amber-500 bg-amber-50'
                          }`}
                          title={isVisible ? 'Hide section from website' : 'Show section on website'}
                        >
                          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, 'up')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-20"
                          title="Move section up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === page.sections.length - 1}
                          onClick={() => handleMoveSection(idx, 'down')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-20"
                          title="Move section down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateSection(sec)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                          title="Duplicate section"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Expanded Form */}
                    {isExpanded && (
                      <div className="p-5 space-y-4 text-xs bg-slate-50/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Section Title</label>
                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) => updateSectionField(sec.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-brand font-bold text-slate-900"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Subtitle / Category Tag</label>
                            <input
                              type="text"
                              value={sec.subtitle}
                              onChange={(e) => updateSectionField(sec.id, 'subtitle', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Badge Text</label>
                            <input
                              type="text"
                              value={sec.badge || ''}
                              onChange={(e) => updateSectionField(sec.id, 'badge', e.target.value)}
                              placeholder="e.g. 100% INSURED"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Text Alignment</label>
                            <select
                              value={sec.settings?.alignment || 'center'}
                              onChange={(e) => updateSectionSetting(sec.id, 'alignment', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                            >
                              <option value="left">Left Aligned</option>
                              <option value="center">Centered</option>
                              <option value="right">Right Aligned</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Container Width</label>
                            <select
                              value={sec.settings?.containerWidth || 'wide'}
                              onChange={(e) => updateSectionSetting(sec.id, 'containerWidth', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                            >
                              <option value="narrow">Narrow (Centered Article)</option>
                              <option value="normal">Normal (Default)</option>
                              <option value="wide">Wide (Full Container)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700">Section Content (Narrative / Paragraphs)</label>
                          <textarea
                            rows={3}
                            value={sec.content}
                            onChange={(e) => updateSectionField(sec.id, 'content', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                          />
                        </div>

                        {/* Section Images Management */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-slate-700 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-teal-brand" />
                              <span>Section Images / Visuals ({sec.images?.length || 0})</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setMediaPickerTarget({ type: 'sectionImage', sectionId: sec.id });
                                setShowMediaPicker(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-teal-brand/10 hover:bg-teal-brand/20 text-teal-brand font-bold text-[11px] transition-colors"
                            >
                              + Attach Image from Library
                            </button>
                          </div>

                          {sec.images?.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {sec.images.map((img, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="relative rounded-xl border border-slate-200 overflow-hidden bg-white group"
                                >
                                  <img
                                    src={img.url}
                                    alt={img.alt}
                                    className="w-full h-24 object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedImages = sec.images.filter((_, i) => i !== imgIdx);
                                      updateSectionField(sec.id, 'images', updatedImages);
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove image from section"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SEO & SOCIAL CARDS */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-4xl text-xs">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-extrabold text-ocean-900">Search Engine Optimization & Social Sharing</h3>
            <p className="text-slate-500 text-[11px]">
              Configure meta tags, OpenGraph previews, and search crawler visibility for this page.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">SEO Title Tag</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {(page.seo?.title || page.title).length}/70 chars
                </span>
              </div>
              <input
                type="text"
                value={page.seo?.title || ''}
                onChange={(e) => setPage({ ...page, seo: { ...page.seo, title: e.target.value } })}
                placeholder={page.title}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Meta Description</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {(page.seo?.description || page.description).length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={page.seo?.description || ''}
                onChange={(e) => setPage({ ...page, seo: { ...page.seo, description: e.target.value } })}
                placeholder={page.description || 'Enter meta description for search engine snippets...'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Canonical URL</label>
              <input
                type="text"
                value={page.seo?.canonicalUrl || ''}
                onChange={(e) => setPage({ ...page, seo: { ...page.seo, canonicalUrl: e.target.value } })}
                placeholder="https://www.aeromarine.site/..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand font-mono"
              />
            </div>

            {/* Social Share Image */}
            <div className="space-y-2 pt-2">
              <label className="font-bold text-slate-700 block">Social Share Preview Image (OG Image)</label>
              <div className="flex items-center gap-3">
                {page.seo?.ogImage || page.featuredImage ? (
                  <img
                    src={page.seo?.ogImage || page.featuredImage}
                    alt="OG Social Card"
                    className="w-24 h-16 object-cover rounded-xl border border-slate-200"
                  />
                ) : (
                  <div className="w-24 h-16 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaPickerTarget({ type: 'ogImage' });
                    setShowMediaPicker(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Choose Social Image from Library
                </button>
              </div>
            </div>

            {/* Google Snippet Simulator */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                Google Search Results Preview Simulator
              </span>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[11px] text-emerald-700 block font-mono">
                  https://www.aeromarine.site/{page.slug === 'home' ? '' : page.slug}
                </span>
                <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
                  {page.seo?.title || page.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {page.seo?.description ||
                    page.description ||
                    'Premier maritime cargo and container leasing platform offering daily yields.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-600">Simulated Viewport:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewViewport === 'mobile' ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (390px)</span>
              </button>
              <button
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  previewViewport === 'desktop' ? 'bg-white text-ocean-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (Full Width)</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-slate-900/10 p-6 rounded-3xl overflow-x-auto min-h-[600px]">
            <div
              className={`bg-[#F4F8FC] rounded-3xl shadow-2xl overflow-hidden border border-slate-300 transition-all ${
                previewViewport === 'mobile' ? 'w-[390px] min-h-[700px]' : 'w-full max-w-5xl min-h-[600px]'
              }`}
            >
              {/* Render dynamic section preview */}
              <div className="space-y-4 p-4">
                {page.sections
                  ?.filter((s) => s.settings?.visible !== false)
                  .map((sec) => (
                    <div key={sec.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-2">
                      {sec.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-brand bg-teal-50 px-2 py-0.5 rounded-full inline-block">
                          {sec.badge}
                        </span>
                      )}
                      <h3 className="font-extrabold text-sm text-slate-900">{sec.title}</h3>
                      {sec.subtitle && <p className="text-xs text-slate-500 font-medium">{sec.subtitle}</p>}
                      {sec.content && <p className="text-xs text-slate-600 leading-relaxed">{sec.content}</p>}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Media Picker Modal Integration */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelected}
      />
    </div>
  );
};
