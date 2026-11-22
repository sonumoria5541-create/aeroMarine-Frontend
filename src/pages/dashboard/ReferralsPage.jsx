import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatDate } from '../../lib/utils';
import { Users, Copy, Check, Share2, ShieldCheck } from 'lucide-react';

export const ReferralsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/referrals');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const copyLink = () => {
    if (data?.referralLink) {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black font-display text-ocean-900">Member Referral Desk</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Invite members to the AeroMarine maritime container network
        </p>
      </div>

      {/* Referral Code & Share Link Card */}
      <div className="bg-ocean-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-ocean-800 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Your Unique Referral Code</span>
          <p className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white">
            {data?.referralCode || 'AMDEMO'}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400">Shareable Registration Invitation Link</label>
          <div className="flex items-center gap-2 bg-ocean-800 p-2 rounded-2xl border border-ocean-700">
            <input
              type="text"
              readOnly
              value={data?.referralLink || ''}
              className="flex-1 bg-transparent border-none text-xs font-mono text-slate-200 px-2 focus:outline-none"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Referred Members List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-ocean-900 text-base">Referred Network Members</h3>
          <span className="text-xs font-bold text-teal-brand">Total: {data?.totalReferrals || 0}</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading network...</p>
        ) : data?.referredUsers?.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">No users have registered with your invitation code yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data?.referredUsers?.map((u, i) => (
              <div key={i} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-ocean-900">{u.name}</p>
                  <p className="font-mono text-slate-500">{u.phoneMasked}</p>
                </div>
                <span className="text-slate-400">{formatDate(u.joinedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
