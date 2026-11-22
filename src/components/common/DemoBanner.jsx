import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DemoBanner = () => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs py-2 px-4 font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-950">
            Demo Simulation Mode
          </span>
          <span className="hidden sm:inline text-amber-900">
            AeroMarine is operating in demonstration & sandbox mode. Financial returns are illustrative simulation only.
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-800">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          <span>Ledger Integrity Active</span>
        </div>
      </div>
    </div>
  );
};
