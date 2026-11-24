import React, { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Compass,
  Volume2,
  Globe,
  Share2,
  Layout,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../lib/api';
import { MediaPickerModal } from '../../components/common/MediaPickerModal';

export const AdminAppearancePage = () => {
  const [appearance, setAppearance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'header_footer' | 'marquee' | 'seo'

  // Media picker target
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState(null); // 'logo' | 'logoDark' | 'favicon' | 'ogImage'

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const fetchAppearance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/appearance');
      if (res.data?.success) {
        setAppearance(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching appearance:', err);
      showToast('Error loading appearance configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppearance();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!appearance) return;

    try {
      setSaving(true);
      const res = await api.patch('/admin/appearance', appearance);
      if (res.data?.success) {
        showToast('Website appearance and branding updated successfully!', 'success');
        setAppearance(res.data.data);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Failed to save appearance settings'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelected = (url) => {
    if (!mediaTargetField) return;

    if (mediaTargetField === 'logo') {
      setAppearance((prev) => ({ ...prev, branding: { ...prev.branding, logoUrl: url } }));
    } else if (mediaTargetField === 'logoDark') {
      setAppearance((prev) => ({ ...prev, branding: { ...prev.branding, logoDarkUrl: url } }));
    } else if (mediaTargetField === 'favicon') {
      setAppearance((prev) => ({ ...prev, branding: { ...prev.branding, faviconUrl: url } }));
    } else if (mediaTargetField === 'ogImage') {
      setAppearance((prev) => ({ ...prev, seo: { ...prev.seo, defaultOgImage: url } }));
    }
    setShowMediaPicker(false);
  };

  if (loading || !appearance) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-teal-brand" />
        <span>Loading design settings...</span>
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
            <Palette className="w-6 h-6 text-teal-brand" />
            <span>Website Appearance & Branding</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage site logo, brand color accents, live announcement marquee, header, footer, and global SEO defaults
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ocean-900 to-teal-brand hover:from-ocean-800 hover:to-teal-hover text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-teal-brand/20 disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Publish Appearance</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'branding', label: 'Branding & Theme Colors', icon: Palette },
          { id: 'header_footer', label: 'Header & Footer Settings', icon: Layout },
          { id: 'marquee', label: 'Announcement Marquee Ticker', icon: Volume2 },
          { id: 'seo', label: 'Global SEO Defaults', icon: Globe },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === t.id
                  ? 'bg-ocean-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-xs max-w-4xl">
        {/* TAB 1: BRANDING & COLORS */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">Brand Identity & Visual Theme</h3>
              <p className="text-[11px] text-slate-500">Configure logo graphics and primary color accents</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Platform Public Name</label>
                <input
                  type="text"
                  value={appearance.branding?.siteName || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      branding: { ...appearance.branding, siteName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Brand Tagline</label>
                <input
                  type="text"
                  value={appearance.branding?.tagline || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      branding: { ...appearance.branding, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                />
              </div>
            </div>

            {/* Logo and Favicon Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 block text-xs">Primary Logo Asset</label>
                <div className="flex items-center gap-3">
                  {appearance.branding?.logoUrl ? (
                    <img
                      src={appearance.branding.logoUrl}
                      alt="Site Logo"
                      className="h-10 object-contain max-w-[120px] rounded p-1 bg-white border border-slate-200"
                    />
                  ) : (
                    <div className="w-16 h-10 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-[10px]">
                      Default
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField('logo');
                      setShowMediaPicker(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs shadow-xs"
                  >
                    Select from Media Library
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 block text-xs">Favicon Graphic</label>
                <div className="flex items-center gap-3">
                  {appearance.branding?.faviconUrl ? (
                    <img
                      src={appearance.branding.faviconUrl}
                      alt="Favicon"
                      className="w-8 h-8 object-contain rounded p-1 bg-white border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-[10px]">
                      ICO
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField('favicon');
                      setShowMediaPicker(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs shadow-xs"
                  >
                    Select from Media Library
                  </button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="font-bold text-slate-800 block text-xs">Platform Color Palette</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Primary Color (Buttons & Highlights)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={appearance.colors?.primaryColor || '#0077B6'}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          colors: { ...appearance.colors, primaryColor: e.target.value },
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={appearance.colors?.primaryColor || '#0077B6'}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          colors: { ...appearance.colors, primaryColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Secondary Color (Navy Header & Cards)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={appearance.colors?.secondaryColor || '#0B2545'}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          colors: { ...appearance.colors, secondaryColor: e.target.value },
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={appearance.colors?.secondaryColor || '#0B2545'}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          colors: { ...appearance.colors, secondaryColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Accent Color (Teal Badges)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={appearance.colors?.accentColor || '#00B4D8'}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          colors: { ...appearance.colors, accentColor: e.target.value },
                        })
                      }
                      className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={appearance.colors?.accentColor || '#00B4D8'}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          colors: { ...appearance.colors, accentColor: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HEADER & FOOTER */}
        {activeTab === 'header_footer' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">Header & Footer Global Settings</h3>
              <p className="text-[11px] text-slate-500">
                Configure navigation header behavior, company address, and social channels
              </p>
            </div>

            {/* Header Settings */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="font-bold text-slate-800 text-xs block">Top Header Navigation</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={appearance.header?.sticky ?? true}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        header: { ...appearance.header, sticky: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-teal-brand"
                  />
                  <span>Sticky Header (Fixed to top on scroll)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={appearance.header?.showSupportButton ?? true}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        header: { ...appearance.header, showSupportButton: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-teal-brand"
                  />
                  <span>Show Customer Support Desk Trigger</span>
                </label>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="space-y-4">
              <span className="font-bold text-slate-800 text-xs block">Footer Information & Coordinates</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Legal Name</label>
                  <input
                    type="text"
                    value={appearance.footer?.companyName || ''}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        footer: { ...appearance.footer, companyName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Compliance Email</label>
                  <input
                    type="email"
                    value={appearance.footer?.email || ''}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        footer: { ...appearance.footer, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Physical Port / Business Address</label>
                  <input
                    type="text"
                    value={appearance.footer?.address || ''}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        footer: { ...appearance.footer, address: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Platform Description / Mission</label>
                  <textarea
                    rows={2}
                    value={appearance.footer?.description || ''}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        footer: { ...appearance.footer, description: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                  />
                </div>
              </div>

              {/* Social Profiles */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">Official Social Channels</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Telegram Channel URL</label>
                    <input
                      type="text"
                      value={appearance.footer?.socialLinks?.telegram || ''}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          footer: {
                            ...appearance.footer,
                            socialLinks: { ...appearance.footer?.socialLinks, telegram: e.target.value },
                          },
                        })
                      }
                      placeholder="https://t.me/aeromarine_official"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">WhatsApp Helpdesk URL</label>
                    <input
                      type="text"
                      value={appearance.footer?.socialLinks?.whatsapp || ''}
                      onChange={(e) =>
                        setAppearance({
                          ...appearance,
                          footer: {
                            ...appearance.footer,
                            socialLinks: { ...appearance.footer?.socialLinks, whatsapp: e.target.value },
                          },
                        })
                      }
                      placeholder="https://wa.me/912249882000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE MARQUEE ANNOUNCEMENT */}
        {activeTab === 'marquee' && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">Live Operations Marquee Ticker</h3>
              <p className="text-[11px] text-slate-500">
                Broadcast instant dispatch alerts and real-time payout notices across the website homepage
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={appearance.announcement?.enabled ?? true}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      announcement: { ...appearance.announcement, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-teal-brand"
                />
                <span>Enable Live Announcement Ticker on Homepage</span>
              </label>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ticker Message Text</label>
                <textarea
                  rows={3}
                  value={appearance.announcement?.text || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      announcement: { ...appearance.announcement, text: e.target.value },
                    })
                  }
                  placeholder="Welcome to AeroMarine Shipping & Exports! Member 98***12 just received ₹4,354 daily yield! • Fast automated withdrawals active."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Click Destination Route (Optional)</label>
                <input
                  type="text"
                  value={appearance.announcement?.link || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      announcement: { ...appearance.announcement, link: e.target.value },
                    })
                  }
                  placeholder="/#plans"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GLOBAL SEO DEFAULTS */}
        {activeTab === 'seo' && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">Global Website SEO Configuration</h3>
              <p className="text-[11px] text-slate-500">
                Fallback meta tags, OpenGraph social sharing card, and Google Analytics tracking
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Website Title Tag</label>
                <input
                  type="text"
                  value={appearance.seo?.defaultTitle || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      seo: { ...appearance.seo, defaultTitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={appearance.seo?.defaultDescription || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      seo: { ...appearance.seo, defaultDescription: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Default Keywords</label>
                <input
                  type="text"
                  value={appearance.seo?.defaultKeywords || ''}
                  onChange={(e) =>
                    setAppearance({
                      ...appearance,
                      seo: { ...appearance.seo, defaultKeywords: e.target.value },
                    })
                  }
                  placeholder="container leasing, maritime investments, freight yields"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-brand"
                />
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Global Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelected}
      />
    </div>
  );
};
