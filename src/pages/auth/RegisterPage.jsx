import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, Ship, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AeroMarineLogo } from '../../components/common/AeroMarineLogo';

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialInvite = searchParams.get('invite') || '';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState(initialInvite);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register({ phone: cleanPhone, password, inviteCode });
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col justify-between">
      <div>
        {/* Top Maritime Banner with Overlay */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0077B6]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center pt-2">
            <AeroMarineLogo size={68} variant="hero" theme="dark" showSubtitle={true} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F8FC] to-transparent"></div>

          {/* Centered Circular Logo Badge */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 z-10 w-20 h-20 rounded-full bg-white p-1 shadow-xl ring-4 ring-cyan-500/20 flex items-center justify-center">
            <AeroMarineLogo size={70} variant="icon" />
          </div>
        </div>

        {/* Floating Card */}
        <div className="relative z-20 mx-4 -mt-2 bg-white rounded-[32px] p-6 shadow-[0_16px_36px_-12px_rgba(11,37,69,0.15)] border border-slate-100">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 pb-3 mb-6">
            <Link
              to="/login"
              className="flex-1 text-center font-medium text-base text-slate-400 hover:text-slate-600 pb-2"
            >
              Login
            </Link>
            <button
              type="button"
              className="flex-1 text-center font-bold text-base text-[#0077B6] relative pb-2"
            >
              Register
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#0077B6] rounded-full"></div>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-left">
                <AlertCircle size={17} className="text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
              {error.toLowerCase().includes('already') && (
                <Link
                  to="/login"
                  className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-bold shrink-0 hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Login
                </Link>
              )}
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
                  placeholder="Enter 10-Digit Mobile"
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
                  placeholder="Set login password (min 6 chars)"
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

            {/* Invite Code Field (Optional) */}
            <div>
              <div className="flex items-center h-14 px-3 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mr-3">
                  <Users size={18} />
                </div>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.trim())}
                  placeholder="Referral Code (Optional)"
                  className="flex-1 bg-transparent border-0 outline-none text-slate-800 text-sm font-medium placeholder:text-slate-400"
                />
                {inviteCode && (
                  <span className="text-[11px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-md">
                    Applied
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-2 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white font-bold text-base shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Register Now'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0077B6] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="py-6 text-center text-[11px] text-slate-400">
        By registering, you agree to AeroMarine Terms of Service & Privacy Policy.
      </div>
    </div>
  );
};
