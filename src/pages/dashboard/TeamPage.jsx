import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Share2, ChevronDown, ChevronUp, UserCheck, Shield, Award } from 'lucide-react';
import api from '../../lib/api';

export const TeamPage = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLevel, setOpenLevel] = useState(1); // 1, 2, or 3

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await api.get('/team');
        if (res.data?.status === 'success') {
          setTeamData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] px-5 pt-6 pb-14 text-white rounded-b-[36px] shadow-lg shadow-blue-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
              <Users size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tight">My Fleet Team</h1>
          </div>

          <Link
            to="/share"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold shadow-md shadow-amber-900/30 transition-all active:scale-95"
          >
            <Share2 size={13} />
            <span>Invite</span>
          </Link>
        </div>

        <div className="text-center my-3">
          <div className="text-3xl font-black text-cyan-300">
            {teamData?.totalMembers || 0}
          </div>
          <div className="text-xs text-blue-200 font-medium">Members across 3 levels</div>
        </div>

        {/* 3 Summary Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[10px] text-blue-200">Team Recharge</div>
            <div className="text-sm font-black text-white mt-0.5">₹{teamData?.teamRecharge || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[10px] text-cyan-200">Team Withdraw</div>
            <div className="text-sm font-black text-cyan-300 mt-0.5">₹{teamData?.teamWithdraw || 0}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <div className="text-[10px] text-blue-200">Total Partners</div>
            <div className="text-sm font-black text-white mt-0.5">{teamData?.totalMembers || 0}</div>
          </div>
        </div>
      </div>

      {/* Grow Your Team Promo Card */}
      <div className="px-4 -mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award size={22} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Grow your fleet team</div>
              <div className="text-[10px] text-slate-500">Earn up to 10% on every plan your team leases.</div>
            </div>
          </div>

          <Link
            to="/share"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs font-bold shadow-md shadow-blue-900/20 active:scale-95 transition-all shrink-0"
          >
            Invite
          </Link>
        </div>
      </div>

      {/* Team Levels Accordion */}
      <div className="px-4 pt-5 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Team Levels (3 Tiers)
          </h2>
          <span className="text-[11px] text-slate-400">Tap to view members</span>
        </div>

        {/* Level 1: 10% */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenLevel(openLevel === 1 ? null : 1)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0077B6] font-black text-xs flex items-center justify-center">
                LV1
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Level 1</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full">
                    10% commission
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {teamData?.levels?.level1?.membersCount || 0} members · Recharge ₹{teamData?.levels?.level1?.rechargeTotal || 0}
                </div>
              </div>
            </div>
            {openLevel === 1 ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>

          {openLevel === 1 && (
            <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2">
              {teamData?.levels?.level1?.members?.length > 0 ? (
                teamData.levels.level1.members.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{m.phone}</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-xs text-slate-400">
                  No Level 1 members yet. Share your invite link to grow your team!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Level 2: 3% */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenLevel(openLevel === 2 ? null : 2)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 font-black text-xs flex items-center justify-center">
                LV2
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Level 2</span>
                  <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.2 rounded-full">
                    3% commission
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {teamData?.levels?.level2?.membersCount || 0} members · Recharge ₹{teamData?.levels?.level2?.rechargeTotal || 0}
                </div>
              </div>
            </div>
            {openLevel === 2 ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>

          {openLevel === 2 && (
            <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2">
              {teamData?.levels?.level2?.members?.length > 0 ? (
                teamData.levels.level2.members.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{m.phone}</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-xs text-slate-400">
                  No Level 2 members yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Level 3: 1% */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenLevel(openLevel === 3 ? null : 3)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center">
                LV3
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Level 3</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.2 rounded-full">
                    1% commission
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {teamData?.levels?.level3?.membersCount || 0} members · Recharge ₹{teamData?.levels?.level3?.rechargeTotal || 0}
                </div>
              </div>
            </div>
            {openLevel === 3 ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>

          {openLevel === 3 && (
            <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2">
              {teamData?.levels?.level3?.members?.length > 0 ? (
                teamData.levels.level3.members.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-bold text-slate-800">{m.phone}</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-xs text-slate-400">
                  No Level 3 members yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
