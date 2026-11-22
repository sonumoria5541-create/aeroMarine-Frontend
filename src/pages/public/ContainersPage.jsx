import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { formatINR } from '../../lib/utils';
import { Box, Filter, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const ContainersPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Fleet Types' },
    { id: 'Standard Cargo', label: 'Standard 20ft Cargo' },
    { id: 'High Cube Fleet', label: 'High Cube 40ft' },
    { id: 'Refrigerated Fleet', label: 'Reefer Cold-Chain' },
    { id: 'ISO Tanker', label: 'ISO Tankers' },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === 'all' ? '/plans' : `/plans?category=${encodeURIComponent(selectedCategory)}`;
        const res = await api.get(url);
        if (res.data?.success) {
          setPlans(res.data.data);
        }
      } catch (e) {
        console.error('Failed to fetch plans:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedCategory]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Fleet Catalog</span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-ocean-900 tracking-tight">
          Maritime Container Fleet Plans
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Select an active container fleet allocation. Each unit represents physical equipment deployed across verified
          global trade corridors with clear terms and risk disclosures.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === c.id
                ? 'bg-ocean-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Container Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-ocean-900 text-lg">No container plans found in this category</h3>
          <p className="text-xs text-slate-500 mt-1">Please try selecting another category or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-card transition-all flex flex-col overflow-hidden group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ocean-900">
                <img
                  src={plan.imageUrl}
                  alt={plan.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-ocean-950/90 text-white border border-ocean-700">
                  {plan.category}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-1 rounded bg-teal-brand text-white">
                  {plan.availableUnits} Available
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-bold text-ocean-900 text-lg group-hover:text-teal-brand transition-colors">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{plan.description}</p>
                </div>

                {/* Specs Box */}
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-500">Participation Cost</span>
                    <span className="font-black text-lg text-ocean-900 font-display">
                      {formatINR(plan.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Charter Term</span>
                    <span className="font-bold text-slate-800">{plan.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Illustrative Estimate</span>
                    <span className="font-bold text-teal-brand">~{plan.dailyRatePercent}% / day</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400">Risk Profile</span>
                    <span className="text-amber-700 font-medium">{plan.riskLabel}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to={`/containers/${plan.slug}`}
                    className="w-full py-3 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Specifications & Participate</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
