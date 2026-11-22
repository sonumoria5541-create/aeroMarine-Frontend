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
        'bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all relative overflow-hidden flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-black text-ocean-900 tracking-tight font-display break-words">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 break-words leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2.5 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0', scheme.iconBg)}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      {action && <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100">{action}</div>}
    </div>
  );
};
