import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, Ship, Anchor, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AeroMarineLogo } from '../../components/common/AeroMarineLogo';

export const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await login(cleanPhone, password);
      if (['owner', 'admin', 'finance', 'support', 'operations'].includes(res?.user?.role)) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col justify-between">
      <div>
        {/* Top Maritime Banner with Overlay */}
        <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0077B6]">
          {/* Subtle wave / vessel pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center pt-2">
            <AeroMarineLogo size={68} variant="hero" theme="dark" showSubtitle={true} />
          </div>

          {/* Bottom Gradient Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F8FC] to-transparent"></div>

          {/* Centered Circular Logo Badge */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 z-10 w-20 h-20 rounded-full bg-white p-1 shadow-xl ring-4 ring-cyan-500/20 flex items-center justify-center">
            <AeroMarineLogo size={70} variant="icon" />
          </div>
        </div>

        {/* Floating Card */}
        <div className="relative z-20 mx-3 sm:mx-4 -mt-2 bg-white rounded-3xl p-4 sm:p-6 shadow-[0_16px_36px_-12px_rgba(11,37,69,0.15)] border border-slate-100">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-3 mb-6">
            <button
              type="button"
              className="flex-1 text-center font-bold text-base text-[#0077B6] relative pb-2"
            >
              Login
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#0077B6] rounded-full"></div>
            </button>
            <Link
              to="/register"
              className="flex-1 text-center font-medium text-base text-slate-400 hover:text-slate-600 pb-2"
            >
              Register
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={17} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number Field */}
            <div>
              <div className="flex items-center h-14 px-3 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center mr-2">
                  <Phone size={18} />
                </div>
                <span className="font-bold text-sm text-slate-700 pr-2 border-r border-slate-200 mr-2">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="Enter Phone Number"
                  className="flex-1 bg-transparent border-0 outline-none text-slate-800 text-sm font-medium placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center h-14 px-3 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0077B6] flex items-center justify-center mr-3">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent border-0 outline-none text-slate-800 text-sm font-medium placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-2 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white font-bold text-base shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Login Now'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#0077B6] hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="py-6 text-center text-[11px] text-slate-400">
        AeroMarine Shipping & Exports Logistics Inc. · 256-bit SSL Secure
      </div>
    </div>
  );
};
