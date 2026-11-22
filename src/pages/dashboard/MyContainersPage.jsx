import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Box, ArrowRight, Clock, ShieldCheck, Compass, AlertCircle } from 'lucide-react';

export const MyContainersPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders');
        if (res.data?.success) {
          setPositions(res.data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black font-display text-ocean-900">My Container Fleet</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active and Historical Commercial Maritime Container Participations
          </p>
        </div>

        <Link
          to="/containers"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-md"
        >
          <Box className="w-4 h-4" />
          <span>Acquire New Units</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading fleet positions...</div>
      ) : positions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Box className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-ocean-900 text-lg">No container fleet positions yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Browse our catalog to acquire standardized dry cargo, high-cube, or refrigerated containers.
          </p>
          <Link
            to="/containers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-900 text-white text-xs font-bold hover:bg-ocean-800 transition-colors"
          >
            <span>Explore Container Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positions.map((pos) => (
            <div
              key={pos._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded">
                    {pos.planSnapshot?.category || 'Container Fleet'}
                  </span>
                  <h3 className="font-bold text-ocean-900 text-base">{pos.planSnapshot?.name}</h3>
                </div>
                <StatusBadge status={pos.status} />
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 text-xs border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Participation Cost:</span>
                  <span className="font-bold text-ocean-900 font-display">{formatINR(pos.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Charter Rate:</span>
                  <span className="font-bold text-teal-brand">~{pos.planSnapshot?.dailyRatePercent}% / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Charter Contract Term:</span>
                  <span className="font-semibold text-slate-700">{pos.planSnapshot?.durationDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Start Date:</span>
                  <span className="font-medium text-slate-700">{formatDate(pos.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="font-medium text-slate-700">{formatDate(pos.endDate)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Accepted Terms:</span>
                <span className="font-mono text-slate-700">{pos.acceptedDocumentVersion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
