import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';
import {
  Box,
  ShieldCheck,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const PlanDetailPage = () => {
  const { slug } = useParams();
  const { user, wallet, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isParticipateModalOpen, setIsParticipateModalOpen] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/plans/${slug}`);
        if (res.data?.success) {
          setPlan(res.data.data);
        }
      } catch (e) {
        console.error('Plan fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [slug]);

  const handleParticipate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('You must review and accept the compliance and risk disclosure conditions.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const res = await api.post('/orders', {
        planId: plan._id,
        acceptTerms: true,
      });

      if (res.data?.success) {
        setSuccessMessage('Container position acquired successfully!');
        await refreshUser();
        setTimeout(() => {
          setIsParticipateModalOpen(false);
          navigate('/dashboard/containers');
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to acquire container position. Please check your available balance.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-teal-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading container fleet specifications...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-ocean-900">Container Plan Not Found</h2>
        <Link to="/containers" className="text-sm font-semibold text-teal-brand hover:underline">
          Return to Container Catalog
        </Link>
      </div>
    );
  }

  const estimatedTotal = plan.estimatedDailyEarning * plan.durationDays;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/containers" className="hover:text-ocean-900">
          Fleet Containers
        </Link>
        <span>/</span>
        <span className="text-ocean-900 font-semibold">{plan.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image & Specifications */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-[16/10] bg-ocean-900 relative">
            <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 text-xs font-bold uppercase px-3 py-1 rounded bg-ocean-950/90 text-white border border-ocean-700">
              {plan.category}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black font-display text-ocean-900">{plan.name}</h1>
            <p className="text-slate-600 text-sm leading-relaxed">{plan.description}</p>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="font-bold text-ocean-900 text-base">Fleet Operational Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">ISO Standard</span>
                <p className="font-bold text-ocean-900">ISO 668 Series 1</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Contract Term</span>
                <p className="font-bold text-ocean-900">{plan.durationDays} Days</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Available Units</span>
                <p className="font-bold text-teal-brand">{plan.availableUnits} Containers</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Payout Frequency</span>
                <p className="font-bold text-ocean-900 uppercase">{plan.payoutSchedule}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Maintenance Fees</span>
                <p className="font-bold text-ocean-900">{plan.feesPercent}%</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Governance</span>
                <p className="font-bold text-ocean-900">Double-Entry Ledger</p>
              </div>
            </div>
          </div>

          {/* Risk Disclosure Box */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Statutory Compliance & Risk Transparency</span>
            </div>
            <p className="text-amber-950 text-xs leading-relaxed">{plan.riskDisclosure}</p>
          </div>
        </div>

        {/* Right Column: Pricing & Action Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unit Participation Cost</span>
              <p className="text-3xl sm:text-4xl font-black font-display text-ocean-900">
                {formatINR(plan.price)}
              </p>
            </div>

            {/* Illustrative Calculation Breakdown */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Illustrative Daily Charter Rate:</span>
                <span className="font-bold text-teal-brand">~{plan.dailyRatePercent}% / day</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Est. Daily Fleet Revenue (Simulated):</span>
                <span className="font-bold text-ocean-900">{formatINR(plan.estimatedDailyEarning)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Contract Duration:</span>
                <span className="font-bold text-ocean-900">{plan.durationDays} Days</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-ocean-900">
                <span>Illustrative Total Return:</span>
                <span className="text-teal-brand">{formatINR(estimatedTotal)}</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 leading-normal italic">
                *Illustrative estimate only. Not withdrawable balance until formal ledger posting.
              </p>
            </div>

            {/* Action CTA */}
            {user ? (
              <div className="space-y-3">
                <button
                  onClick={() => setIsParticipateModalOpen(true)}
                  disabled={plan.availableUnits <= 0}
                  className="w-full py-4 rounded-xl bg-teal-brand hover:bg-teal-hover disabled:bg-slate-300 text-white font-bold text-sm transition-all shadow-lg shadow-teal-brand/20 flex items-center justify-center gap-2"
                >
                  <Box className="w-4 h-4" />
                  <span>
                    {plan.availableUnits > 0 ? 'Acquire Container Position' : 'Sold Out for this Charter'}
                  </span>
                </button>

                <p className="text-xs text-center text-slate-500">
                  Available Wallet Balance: <span className="font-bold">{formatINR(wallet?.availableBalance || 0)}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full py-4 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-white font-bold text-sm transition-all text-center block shadow-md"
                >
                  Sign In to Participate
                </Link>
                <p className="text-xs text-center text-slate-500">
                  New to AeroMarine?{' '}
                  <Link to="/register" className="text-teal-brand font-bold hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation & Terms Modal */}
      <Modal
        isOpen={isParticipateModalOpen}
        onClose={() => setIsParticipateModalOpen(false)}
        title="Confirm Container Participation"
        subtitle={`Contract Term: ${plan.durationDays} Days | Equipment: ${plan.name}`}
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Container Model:</span>
              <span className="font-bold text-ocean-900">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount to Debit:</span>
              <span className="font-bold text-ocean-900 text-sm">{formatINR(plan.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Available Balance:</span>
              <span className="font-bold text-teal-brand">{formatINR(wallet?.availableBalance || 0)}</span>
            </div>
          </div>

          {(wallet?.availableBalance || 0) < plan.price && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              Insufficient available balance. Please deposit funds into your wallet before proceeding.
            </div>
          )}

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="planTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-brand focus:ring-teal-brand"
            />
            <label htmlFor="planTerms" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
              I acknowledge that container returns are illustrative estimates based on simulated charter economics. I
              agree to the Maritime Contract Terms ({plan.termsVersion}) and risk disclosures.
            </label>
          </div>

          {errorMessage && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
              {successMessage}
            </p>
          )}

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => setIsParticipateModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleParticipate}
              disabled={submitting || (wallet?.availableBalance || 0) < plan.price}
              className="flex-1 py-2.5 rounded-xl bg-teal-brand hover:bg-teal-hover disabled:bg-slate-300 text-white text-xs font-bold transition-colors shadow-md"
            >
              {submitting ? 'Processing...' : 'Confirm Participation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
