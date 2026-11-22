import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Wallet, ArrowUpRight, Ship, Award, CheckCircle2, Clock, XCircle } from 'lucide-react';
import api from '../../lib/api';

export const RecordsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/wallet/records?tab=${activeTab}`);
        if (res.data?.status === 'success') {
          setRecords(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const getRecordIcon = (category) => {
    switch (category) {
      case 'recharge':
        return <Wallet size={18} className="text-[#0077B6]" />;
      case 'withdraw':
        return <ArrowUpRight size={18} className="text-rose-500" />;
      case 'yield':
      case 'order':
        return <Ship size={18} className="text-cyan-600" />;
      default:
        return <Award size={18} className="text-amber-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Success':
      case 'approved':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/50">
            Success
          </span>
        );
      case 'Pending':
      case 'pending':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/50">
            Pending
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/50">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-10">
      {/* Top Header */}
      <div className="bg-[#0B2545] px-4 py-3.5 text-white flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-semibold">Back</span>
        </button>
        <h1 className="text-sm font-black tracking-wide">Account Record</h1>
        <div className="w-12"></div>
      </div>

      {/* 3 Filter Tabs */}
      <div className="p-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-[#0B2545] shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Records
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('withdraw')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'withdraw'
                ? 'bg-white text-[#0B2545] shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Withdraw
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('recharge')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recharge'
                ? 'bg-white text-[#0B2545] shadow-sm font-black'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Recharge
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="p-4 space-y-2.5">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-[#0077B6]/20 border-t-[#0077B6] rounded-full animate-spin mb-2"></div>
            <span className="text-xs">Loading records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <Clock size={24} />
            </div>
            <div className="text-xs font-extrabold text-slate-700">No transactions found</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Your record history will appear here.</div>
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getRecordIcon(rec.category)}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {rec.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(rec.createdAt).toLocaleDateString()} · {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-black ${
                    rec.isCredit ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {rec.isCredit ? '+' : '−'} ₹{rec.amount}
                </div>
                <div className="mt-1">{getStatusBadge(rec.status)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
