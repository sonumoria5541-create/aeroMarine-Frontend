import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Settings, Save, CheckCircle2, ShieldCheck, Building2, QrCode, AlertCircle, Bell } from 'lucide-react';

export const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    bankDetails: {
      bankName: 'HDFC Bank Ltd',
      accountHolderName: 'AeroMarine Maritime Freight Escrow',
      accountNumber: '50200088991122',
      ifscCode: 'HDFC0001234',
      branch: 'Port Complex Nariman Point, Mumbai',
    },
    upiId: 'aeromarine.cargo@okhdfcbank',
    minDeposit: 250,
    maxDeposit: 10000000,
    minWithdrawal: 120,
    maxWithdrawal: 1000000,
    withdrawalFeePercent: 0,
    maintenanceMode: false,
    announcement: '',
    supportEmail: 'compliance@aeromarine.site',
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
          const d = res.data.data;
          setSettings((prev) => ({
            ...prev,
            ...d,
            bankDetails: d.bankDetails || d.deposit_bank_details || prev.bankDetails,
            upiId: d.upiId || d.deposit_bank_details?.upiId || prev.upiId,
            minDeposit: d.minDeposit ?? d.financial_limits?.minDeposit ?? prev.minDeposit,
            minWithdrawal: d.minWithdrawal ?? d.financial_limits?.minWithdrawal ?? prev.minWithdrawal,
            maxWithdrawal: d.maxWithdrawal ?? d.financial_limits?.maxWithdrawal ?? prev.maxWithdrawal,
            withdrawalFeePercent: d.withdrawalFeePercent ?? d.financial_limits?.withdrawalFeePercent ?? prev.withdrawalFeePercent,
            maintenanceMode: d.maintenanceMode ?? false,
            announcement: d.announcement || '',
            supportEmail: d.supportEmail || 'compliance@aeromarine.site',
          }));
        }
      } catch (e) {
        console.error('Failed to load settings:', e);
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

      const payload = {
        ...settings,
        deposit_bank_details: {
          ...settings.bankDetails,
          upiId: settings.upiId,
        },
        financial_limits: {
          minDeposit: settings.minDeposit,
          maxDeposit: settings.maxDeposit,
          minWithdrawal: settings.minWithdrawal,
          maxWithdrawal: settings.maxWithdrawal,
          withdrawalFeePercent: settings.withdrawalFeePercent,
        },
      };

      const res = await api.patch('/admin/settings', payload);
      if (res.data?.success) {
        setNotice('Platform settings saved and successfully applied to operational ledger.');
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl overflow-hidden">
      <div className="pb-3 sm:pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
          Platform Operational Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure bank settlement coordinates, operational financial thresholds, and security controls
        </p>
      </div>

      {notice && (
        <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6 text-xs">
        {/* Deposit Bank & UPI Coordinates */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2.5 sm:pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal-brand flex-shrink-0" />
            <h3 className="font-bold text-ocean-900 text-xs sm:text-sm">Deposit Bank & UPI Settlement Coordinates</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Bank Name</label>
              <input
                type="text"
                required
                value={settings.bankDetails?.bankName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, bankName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Account Holder Name</label>
              <input
                type="text"
                required
                value={settings.bankDetails?.accountHolderName || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, accountHolderName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Account Number</label>
              <input
                type="text"
                required
                value={settings.bankDetails?.accountNumber || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, accountNumber: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">IFSC Code</label>
              <input
                type="text"
                required
                value={settings.bankDetails?.ifscCode || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, ifscCode: e.target.value.toUpperCase() },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono uppercase text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Bank Branch</label>
              <input
                type="text"
                value={settings.bankDetails?.branch || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    bankDetails: { ...settings.bankDetails, branch: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Official UPI ID for QR / Collect</label>
              <input
                type="text"
                required
                value={settings.upiId || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    upiId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>
        </div>

        {/* Financial Limits & Fees */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2.5 sm:pb-3 border-b border-slate-100">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-container-orange flex-shrink-0" />
            <h3 className="font-bold text-ocean-900 text-xs sm:text-sm">Financial Thresholds & Policy</h3>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Min Deposit (₹)</label>
              <input
                type="number"
                min="10"
                value={settings.minDeposit}
                onChange={(e) => setSettings({ ...settings, minDeposit: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Min Withdrawal (₹)</label>
              <input
                type="number"
                min="10"
                value={settings.minWithdrawal}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Max Withdrawal (₹)</label>
              <input
                type="number"
                min="1000"
                value={settings.maxWithdrawal}
                onChange={(e) => setSettings({ ...settings, maxWithdrawal: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Withdrawal Fee (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                value={settings.withdrawalFeePercent}
                onChange={(e) => setSettings({ ...settings, withdrawalFeePercent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>
        </div>

        {/* Platform Status & Communications */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 pb-2.5 sm:pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-teal-brand flex-shrink-0" />
            <h3 className="font-bold text-ocean-900 text-xs sm:text-sm">Platform Status & Announcements</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">System Mode</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Production Mode (High-Security Ledger)</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Operations Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-ocean-900">Public Platform Announcement (Optional)</label>
              <input
                type="text"
                value={settings.announcement}
                onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                placeholder="Broadcast a maintenance notice or international shipping advisory..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-container-orange hover:bg-container-orange/90 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Applying Changes...' : 'Save & Deploy System Settings'}</span>
        </button>
      </form>
    </div>
  );
};
