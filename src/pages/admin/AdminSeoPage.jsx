import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  FileCode,
  ShieldCheck,
  Search,
  Layers,
  ArrowRight,
} from 'lucide-react';
import api from '../../lib/api';

export const AdminSeoPage = () => {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAudit = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/seo/audit');
      if (res.data?.success) {
        setAuditData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching SEO audit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-teal-brand" />
        <span>Compiling SEO health audit...</span>
      </div>
    );
  }

  const totalChecked = auditData?.totalChecked || 0;
  const totalIssues = auditData?.totalIssues || 0;
  const healthScore = totalChecked > 0 ? Math.max(0, 100 - totalIssues * 15) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900 tracking-tight flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-teal-brand" />
            <span>Search Engine Optimization & Sitemap</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit meta tags, verify XML sitemaps, inspect OpenGraph cards, and optimize search engine visibility
          </p>
        </div>

        <button
          onClick={fetchAudit}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-teal-brand" />
          <span>Re-run SEO Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SEO Health Rating</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                healthScore >= 80 ? 'text-emerald-600' : healthScore >= 50 ? 'text-amber-600' : 'text-rose-600'
              }`}
            >
              {healthScore}%
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {healthScore >= 80 ? 'Optimal' : healthScore >= 50 ? 'Moderate' : 'Needs Fixes'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Based on meta completeness, tags, and ALT coverage</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published Pages Scanned</span>
          <div className="text-3xl font-black text-ocean-900">{totalChecked}</div>
          <p className="text-[10px] text-slate-400">Indexed in automated XML sitemap</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SEO Issues Detected</span>
          <div className="text-3xl font-black text-rose-600">{totalIssues}</div>
          <p className="text-[10px] text-slate-400">Requires metadata improvements</p>
        </div>
      </div>

      {/* Quick Crawler Tools (Sitemap & Robots) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-ocean-900">Dynamic XML Sitemap</h4>
              <span className="text-[11px] text-slate-500 block font-mono">/sitemap.xml</span>
            </div>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-brand hover:text-white text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View XML</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-ocean-100 text-ocean-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-ocean-900">Robots.txt Directives</h4>
              <span className="text-[11px] text-slate-500 block font-mono">/robots.txt</span>
            </div>
          </div>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-ocean-900 hover:text-white text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View File</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Pages Health Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-ocean-900">Page-by-Page SEO Metadata Audit</h3>
          <span className="text-[11px] text-slate-400">Click any page to edit title, description, or OG tags</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Page & URL</th>
                <th className="py-3 px-4">Meta Title</th>
                <th className="py-3 px-4">Meta Description</th>
                <th className="py-3 px-4">OG Image</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditData?.pageAudits?.map((pa) => (
                <tr key={pa.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-800">
                    <div>{pa.title}</div>
                    <span className="text-[10px] text-slate-400 font-mono">/{pa.slug}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 truncate max-w-[200px]">
                    {pa.seoTitle || <span className="text-rose-500 font-bold">Missing</span>}
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-slate-600 truncate max-w-[250px]">
                    {pa.seoDescription || <span className="text-rose-500 font-bold">Missing</span>}
                  </td>

                  <td className="py-3.5 px-4">
                    {pa.hasOgImage ? (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attached</span>
                      </span>
                    ) : (
                      <span className="text-amber-500 text-[11px]">Fallback</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {pa.issuesCount === 0 ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Pass
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        {pa.issuesCount} Warning{pa.issuesCount === 1 ? '' : 's'}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <Link
                      to={`/admin/pages/${pa.id}`}
                      className="px-2.5 py-1 rounded-lg bg-teal-brand/10 hover:bg-teal-brand hover:text-white text-teal-brand font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Edit SEO</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
