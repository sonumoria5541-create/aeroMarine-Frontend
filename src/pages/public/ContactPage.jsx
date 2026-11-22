import React, { useState } from 'react';
import api from '../../lib/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/contact', formData);
      if (res.data?.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-brand">Support & Logistics Desk</span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-ocean-900 tracking-tight">
          Contact Port Operations Desk
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Have questions regarding container allocations, banking deposit verification, or charter contract terms?
          Our operations team is available Monday through Saturday.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ocean-900 text-white rounded-3xl p-8 space-y-6 border border-ocean-800 shadow-xl">
            <h3 className="text-xl font-bold font-display">AeroMarine Port Operations Hub</h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-brand flex-shrink-0 mt-0.5" />
                <span>Unit 14B, International Port Maritime Towers, Nariman Point, Mumbai 400021, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-brand flex-shrink-0" />
                <span>+91 22 4988 2000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-brand flex-shrink-0" />
                <span>sonumoria5541@gmail.com</span>
              </div>
            </div>

            <div className="pt-4 border-t border-ocean-800 text-xs text-slate-400">
              <p>Operational Hours: Mon – Sat (09:00 AM – 06:00 PM IST)</p>
              <p className="mt-1">Bank Clearing Windows: IMPS/NEFT Banking Hours</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-subtle">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-ocean-900">Message Received</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for reaching out. A port logistics coordinator has received your inquiry and will respond to your email.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-ocean-900 text-white text-xs font-bold hover:bg-ocean-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ocean-900">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Captain Rohan Roy"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ocean-900">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ocean-900">Contact Phone (Optional)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-ocean-900">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Deposit Verification Inquiry"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-ocean-900">Operational Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-teal-brand"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-teal-brand hover:bg-teal-hover disabled:bg-slate-300 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting...' : 'Transmit Operational Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
