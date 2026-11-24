import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Ship,
  ShieldCheck,
  Clock,
  Users,
  ChevronRight,
  ExternalLink,
  Volume2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import api from '../../lib/api';
import { AeroMarineLogo } from '../../components/common/AeroMarineLogo';

export const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/pages/${slug || 'home'}`);
        if (res.data?.success) {
          setPage(res.data.data);
          // Set page meta title
          if (res.data.data.seo?.title) {
            document.title = res.data.data.seo.title;
          } else if (res.data.data.title) {
            document.title = `${res.data.data.title} — AeroMarine`;
          }
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error('Failed to load dynamic page:', err);
        setError('Page not found or not published');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center p-6 text-slate-400 text-xs">
        <RefreshCw className="w-5 h-5 animate-spin text-[#0077B6] mr-2" />
        <span>Loading maritime dispatch...</span>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0077B6] flex items-center justify-center mb-2">
          <Ship size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          The requested route (/{slug}) is not currently active on the AeroMarine platform.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-12">
      {/* Top Header */}
      <div className="bg-[#0B2545] px-4 py-3.5 text-white flex items-center justify-between shadow-md sticky top-0 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        <h1 className="text-sm font-black tracking-wide truncate max-w-[200px]">{page.title}</h1>
        <div className="w-12"></div>
      </div>

      <div className="p-4 space-y-4">
        {page.sections?.map((sec) => {
          if (sec.settings?.visible === false) return null;

          return (
            <div
              key={sec.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3"
            >
              {sec.badge && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-[#0077B6] text-[10px] font-extrabold uppercase tracking-wider border border-cyan-100">
                  {sec.badge}
                </span>
              )}

              {sec.title && (
                <h2 className="text-base font-black text-slate-900 tracking-tight leading-snug">{sec.title}</h2>
              )}

              {sec.subtitle && (
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{sec.subtitle}</h3>
              )}

              {sec.content && (
                <div
                  className="text-xs text-slate-600 leading-relaxed space-y-2 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: sec.content }}
                />
              )}

              {/* Items grid (e.g. stats, steps, features) */}
              {sec.items?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {sec.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/60 space-y-1"
                    >
                      {item.value && <div className="text-lg font-black text-[#0077B6]">{item.value}</div>}
                      {item.title && <div className="font-bold text-xs text-slate-800">{item.title}</div>}
                      {item.description && <div className="text-[11px] text-slate-500">{item.description}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Section Images */}
              {sec.images?.length > 0 && (
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {sec.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="rounded-2xl overflow-hidden border border-slate-100">
                      <img
                        src={img.url}
                        alt={img.alt || sec.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      {img.caption && (
                        <p className="p-2 text-[10px] text-slate-400 text-center bg-slate-50">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Section CTA Buttons */}
              {sec.buttons?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {sec.buttons.map((btn, btnIdx) => (
                    <Link
                      key={btnIdx}
                      to={btn.href}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                        btn.variant === 'secondary'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-gradient-to-r from-[#0B2545] to-[#0077B6] hover:from-[#134074] hover:to-[#0096C7] text-white shadow-blue-900/20'
                      }`}
                    >
                      <span>{btn.label}</span>
                      <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
