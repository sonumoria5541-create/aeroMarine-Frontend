import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';
import { Box, Plus, Edit, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Standard Cargo',
    description: '',
    shortDescription: '',
    imageUrl: '',
    price: 10000,
    durationDays: 30,
    dailyRatePercent: 1.2,
    availableUnits: 50,
    riskLabel: 'Maritime Commercial Risk',
    riskDisclosure: 'Governed by AeroMarine standard marine cargo charter terms.',
    status: 'active',
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/plans');
      if (res.data?.success) {
        setPlans(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Standard Cargo',
      description: '',
      shortDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      price: 15000,
      durationDays: 30,
      dailyRatePercent: 1.2,
      availableUnits: 50,
      riskLabel: 'Maritime Commercial Risk',
      riskDisclosure: 'Governed by AeroMarine standard marine cargo charter terms.',
      status: 'active',
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPlan(p);
    setFormData({ ...p });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.patch(`/admin/plans/${editingPlan._id}`, formData);
      } else {
        await api.post('/admin/plans', formData);
      }
      setModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save plan.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Page Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black font-display text-ocean-900 tracking-tight">
            Container Fleet Plans
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure standardized container units, duration terms, and operational yield rates
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-brand hover:bg-teal-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Container Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {plans.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-subtle p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4"
          >
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {p.category}
                </span>
                <span className="text-xs font-bold text-teal-brand uppercase">{p.status}</span>
              </div>
              <div>
                <h3 className="font-bold text-ocean-900 text-sm sm:text-base">{p.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{p.description}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl sm:rounded-2xl text-xs space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Unit Price:</span>
                  <span className="font-bold text-ocean-900">{formatINR(p.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Charter Term:</span>
                  <span className="font-semibold text-slate-800">{p.durationDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Charter Rate:</span>
                  <span className="font-bold text-teal-brand">~{p.dailyRatePercent}% / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Units:</span>
                  <span className="font-semibold text-slate-800">{p.availableUnits}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openEditModal(p)}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-ocean-900 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Plan Specifications</span>
            </button>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPlan ? 'Edit Container Plan' : 'Create New Container Plan'}
        subtitle="Manage fleet dimensions, pricing, and compliance risk disclosures"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-3.5 sm:space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Plan Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Standard 20ft Cargo"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Slug (URL identifier)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. standard-20ft-cargo"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              >
                <option value="Standard Cargo">Standard Cargo</option>
                <option value="High Cube Fleet">High Cube Fleet</option>
                <option value="Refrigerated Fleet">Refrigerated Fleet</option>
                <option value="ISO Tanker">ISO Tanker</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Unit Price (₹)</label>
              <input
                type="number"
                min={100}
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Charter Term (Days)</label>
              <input
                type="number"
                min={1}
                required
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Yield Rate (%/day)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.dailyRatePercent}
                onChange={(e) => setFormData({ ...formData, dailyRatePercent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-ocean-900">Available Units</label>
              <input
                type="number"
                min={0}
                required
                value={formData.availableUnits}
                onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ocean-900">Description</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ocean-900">Risk Disclosure Text</label>
            <textarea
              rows={2}
              required
              value={formData.riskDisclosure}
              onChange={(e) => setFormData({ ...formData, riskDisclosure: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-brand"
            />
          </div>

          <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="w-full sm:w-auto flex-1 py-2.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-colors text-center order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 py-2.5 rounded-xl bg-teal-brand hover:bg-teal-hover text-white font-bold shadow-md transition-colors text-center order-1 sm:order-2"
            >
              Save Plan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
