import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, RefreshCcw } from 'lucide-react';

export const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { name: 'Terms of Service', path: '/terms', icon: FileText },
    { name: 'Privacy Policy', path: '/privacy', icon: ShieldCheck },
    { name: 'Risk Disclosure', path: '/risk-disclosure', icon: AlertTriangle },
    { name: 'Refund Policy', path: '/refund-policy', icon: RefreshCcw },
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = path === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-ocean-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-subtle space-y-6">
        {path === '/terms' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-ocean-900">
              Maritime Terms & Conditions (Draft v1.0)
            </h1>
            <p className="text-xs text-slate-400">Effective Date: November 2026 | Governing Law: Maritime Jurisdiction</p>

            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">1. Acceptance of Terms</h3>
              <p>
                By creating an account on AeroMarine or participating in container fleet allocations, you agree to be bound
                by these operational terms. All transactions are logged in an immutable double-entry ledger.
              </p>

              <h3 className="text-base font-bold text-ocean-900">2. Demonstration & Simulation Mode</h3>
              <p>
                The AeroMarine platform is presently configured in DEMO Mode. All container fleet units, balances, deposits,
                withdrawals, and illustrative earning accruals are simulated demonstration assets with no cash conversion
                obligation unless formal regulatory review is certified.
              </p>

              <h3 className="text-base font-bold text-ocean-900">3. Deposit & Withdrawal Workflow</h3>
              <p>
                Submitting a deposit request does not immediately increase your spendable wallet balance. Balances are posted
                only after banking verification by our operations desk. Withdrawals atomically reserve available funds to prevent
                double spending.
              </p>
            </div>
          </div>
        )}

        {path === '/privacy' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-ocean-900">
              Privacy & Data Governance Policy
            </h1>
            <p className="text-xs text-slate-400">Version 1.0 | Applicable across Web & API</p>

            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">1. Information Collection</h3>
              <p>
                AeroMarine collects user phone numbers, full names, hashed passwords (bcrypt), and banking payout details.
                Passwords and full payment secrets are never stored in plaintext or returned in API responses.
              </p>

              <h3 className="text-base font-bold text-ocean-900">2. Cookie & Session Policy</h3>
              <p>
                We use HttpOnly, SameSite cookies for access and refresh sessions. Refresh tokens are securely hashed in the
                database and automatically rotated to prevent session replay attacks.
              </p>
            </div>
          </div>
        )}

        {path === '/risk-disclosure' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-ocean-900">
              Maritime Risk & Capital Disclosures
            </h1>
            <p className="text-xs text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              Important: Please review these operational risks before participating in container allocations.
            </p>

            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">1. No Guaranteed Profits</h3>
              <p>
                Commercial maritime chartering is subject to macroeconomic fluctuations, bunker fuel surcharges, port congestion,
                and currency movements. AeroMarine does not guarantee fixed returns or assure capital protection.
              </p>

              <h3 className="text-base font-bold text-ocean-900">2. Simulated Figures</h3>
              <p>
                Daily earning estimates displayed on container cards are illustrative models derived from charter market estimates.
                They do not represent legally enforceable yield claims until confirmed by actual commercial charter contracts.
              </p>
            </div>
          </div>
        )}

        {path === '/refund-policy' && (
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-ocean-900">
              Refund & Cancellation Guidelines
            </h1>
            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-ocean-900">1. Unprocessed Deposit Cancellation</h3>
              <p>
                If a deposit request is in `pending` status and not yet verified by our banking desk, the user or administrator
                may cancel the request. No ledger debit or credit will occur.
              </p>
              <h3 className="text-base font-bold text-ocean-900">2. Active Container Contracts</h3>
              <p>
                Once a container unit is acquired and deployed into charter operations, the capital is committed for the duration
                of the charter term ({'e.g. 30, 45, or 60 days'}) to honor terminal commitments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
