import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Settings, Save, CheckCircle2, ShieldCheck, Building2, QrCode } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    deposit_bank_details: {
      bankName: 'HDFC Bank Ltd',
      accountHolderName: 'AeroMarine Fleet Escrow India',
      accountNumber: '50200088991122',
      ifscCode: 'HDFC0001234',
      branch: 'Port Complex Nariman Point, Mumbai',
      upiId: 'aeromarine@icici',
    },
    financial_limits: {
      minDeposit: 100,
      maxDeposit: 10000000,
      minWithdrawal: 200,
      maxWithdrawal: 1000000,
      withdrawalFeePercent: 0,
    },
    demo_mode: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/settings');
        if (res.data?.success && Object.keys(res.data.data).length > 0) {
          setSettings((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setNotice('');
      const res = await api.patch('/admin/settings', settings);
      if (res.data?.success) {
        setNotice('System settings saved and applied to platform.');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black font-display text-ocean-900">Platform Operational Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure bank settlement coordinates, operational thresholds, and compliance mode
        </p>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Bank & UPI Transfer Coordinates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-teal-brand" />
            <h3 className="font-bold text-ocean-900 text-sm">Deposit Bank & UPI Transfer Coordinates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Bank Name</label>
              <input
                type="text"
                value={settings.deposit_bank_details?.bankName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deposit_bank_details: { ...settings.deposit_bank_details, bankName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Account Holder Name</label>
              <input
                type="text"
                value={settings.deposit_bank_details?.accountHolderName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deposit_bank_details: { ...settings.deposit_bank_details, accountHolderName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Account Number</label>
              <input
                type="text"
                value={settings.deposit_bank_details?.accountNumber || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deposit_bank_details: { ...settings.deposit_bank_details, accountNumber: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">IFSC Code</label>
              <input
                type="text"
                value={settings.deposit_bank_details?.ifscCode || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deposit_bank_details: { ...settings.deposit_bank_details, ifscCode: e.target.value.toUpperCase() },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-ocean-900">Official UPI ID</label>
              <input
                type="text"
                value={settings.deposit_bank_details?.upiId || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    deposit_bank_details: { ...settings.deposit_bank_details, upiId: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>
        </div>

        {/* Financial Limits */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
          <h3 className="font-bold text-ocean-900 text-sm pb-3 border-b border-slate-100">
            Financial Limits & Fees
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Min Deposit (₹)</label>
              <input
                type="number"
                value={settings.financial_limits?.minDeposit || 100}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    financial_limits: { ...settings.financial_limits, minDeposit: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Min Withdrawal (₹)</label>
              <input
                type="number"
                value={settings.financial_limits?.minWithdrawal || 200}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    financial_limits: { ...settings.financial_limits, minWithdrawal: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Withdrawal Fee (%)</label>
              <input
                type="number"
                value={settings.financial_limits?.withdrawalFeePercent || 0}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    financial_limits: { ...settings.financial_limits, withdrawalFeePercent: Number(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Platform Mode</label>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-700">
                DEMO Simulation
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3.5 rounded-xl bg-teal-brand hover:bg-teal-hover text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Saving Configuration...' : 'Save System Settings'}</span>
        </button>
      </form>
    </div>
  );
};
