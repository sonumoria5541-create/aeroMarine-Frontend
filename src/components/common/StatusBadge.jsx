import React from 'react';
import { cn } from '../../lib/utils';
import { Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending Approval',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: RefreshCw,
  },
  approved: {
    label: 'Verified & Credited',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  processing: {
    label: 'Processing Payout',
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: RefreshCw,
  },
  paid: {
    label: 'Payout Dispatched',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Declined / Released',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
  active: {
    label: 'Active Position',
    bg: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: CheckCircle2,
  },
  completed: {
    label: 'Fleet Term Completed',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: CheckCircle2,
  },
  suspended: {
    label: 'Suspended',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertCircle,
  },
  blocked: {
    label: 'Blocked',
    bg: 'bg-red-100 text-red-800 border-red-300',
    icon: AlertCircle,
  },
  archived: {
    label: 'Archived',
    bg: 'bg-slate-100 text-slate-600 border-slate-300',
    icon: AlertCircle,
  },
};

export const StatusBadge = ({ status, className }) => {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: AlertCircle,
  };
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        config.bg,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
