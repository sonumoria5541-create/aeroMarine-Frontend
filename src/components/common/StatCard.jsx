import React from 'react';
import { cn } from '../../lib/utils';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'teal', className, action }) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      iconBg: 'bg-teal-brand/10 text-teal-brand',
    },
    orange: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      iconBg: 'bg-container-orange/15 text-container-orange',
    },
    blue: {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      iconBg: 'bg-sky-100 text-sky-700',
    },
    navy: {
      bg: 'bg-ocean-50',
      text: 'text-ocean-900',
      iconBg: 'bg-ocean-700/10 text-ocean-700',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-ocean-900 tracking-tight font-display">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl flex-shrink-0', scheme.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {action && <div className="mt-4 pt-3 border-t border-slate-100">{action}</div>}
    </div>
  );
};
