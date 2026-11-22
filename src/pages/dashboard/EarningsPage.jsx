import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { TrendingUp, AlertTriangle, ShieldAlert, Calendar } from 'lucide-react';

export const EarningsPage = () => {
  const [earnings, setEarnings] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/earnings');
        if (res.data?.success) {
          setEarnings(res.data.data);
          setMeta(res.data.meta);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black font-display text-ocean-900">Fleet Earnings & Accruals</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Illustrative Daily Freight Charter Revenue Calculations (Demo Simulation)
        </p>
      </div>

      {/* Mandatory Regulatory Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block text-amber-950 font-bold uppercase tracking-wider text-[11px]">
            Simulated Demonstration Notice
          </strong>
          <p className="leading-relaxed">
            All daily calculations displayed here carry <code className="bg-amber-200/60 px-1 py-0.5 rounded">isDemo: true</code>.
            In compliance with international financial product guidelines, simulated earnings are illustrative models and cannot
            be withdrawn or converted to fiat currency until certified commercial charters are certified.
          </p>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-ocean-900 text-sm">Daily Accrual Log</h3>
          <span className="text-[11px] font-bold text-teal-brand uppercase tracking-wider">
            Total Records: {earnings.length}
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading accruals...</p>
        ) : earnings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <TrendingUp className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">No daily earning accruals recorded yet.</p>
            <p className="text-[11px] text-slate-400">
              Earnings post daily when active container positions are deployed.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {earnings.map((e) => (
              <div
                key={e._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ocean-900">{e.planPosition?.planSnapshot?.name || 'Container Unit'}</span>
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                      Simulated
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Period: {e.period}</span>
                    <span>&bull;</span>
                    <span>Rate: {e.calculationRatePercent}% / day</span>
                  </div>
                </div>

                <div className="sm:text-right space-y-0.5">
                  <span className="text-base font-black font-display text-emerald-600 block">
                    +{formatINR(e.netAmount)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Status: {e.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
