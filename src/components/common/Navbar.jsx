import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Anchor, Menu, X, ArrowRight, LayoutDashboard, ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

const DEFAULT_NAV_LINKS = [
  { name: 'Fleet Containers', href: '/containers' },
  { name: 'Maritime Operations', href: '/about' },
  { name: 'Contact Desk', href: '/contact' },
  { name: 'Legal & Risk', href: '/terms' },
];

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState(DEFAULT_NAV_LINKS);
  const [branding, setBranding] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNavAndAppearance = async () => {
      try {
        const [navRes, appRes] = await Promise.allSettled([
          api.get('/navigation?location=header'),
          api.get('/appearance'),
        ]);

        if (
          navRes.status === 'fulfilled' &&
          navRes.value.data?.success &&
          navRes.value.data.data?.items?.length > 0
        ) {
          const items = navRes.value.data.data.items.map((i) => ({
            name: i.label,
            href: i.url,
            openInNewTab: i.openInNewTab,
          }));
          setNavLinks(items);
        }

        if (appRes.status === 'fulfilled' && appRes.value.data?.success) {
          const app = appRes.value.data.data;
          if (app.branding) {
            setBranding(app.branding);
          }
          if (app.announcement?.enabled && app.announcement?.text) {
            setAnnouncement(app.announcement.text);
          }
        }
      } catch (err) {
        // Fall back gracefully to hardcoded defaults
      }
    };

    fetchNavAndAppearance();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-ocean-900/95 backdrop-blur-md border-b border-ocean-800 text-white">
      {/* Dynamic Announcement Bar if enabled in Admin Appearance */}
      {announcement && (
        <div className="bg-gradient-to-r from-teal-brand via-ocean-700 to-container-orange text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
          <span>{announcement}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {branding?.logo ? (
              <img
                src={branding.logo}
                alt={branding.siteName || 'AeroMarine'}
                className="h-10 w-auto object-contain max-w-[140px]"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-brand to-ocean-700 flex items-center justify-center shadow-lg shadow-teal-brand/20 group-hover:scale-105 transition-transform">
                <Anchor className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                {branding?.siteName ? (
                  branding.siteName
                ) : (
                  <>
                    AERO<span className="text-teal-brand">MARINE</span>
                  </>
                )}
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                {branding?.tagline || 'Global Logistics'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                target={link.openInNewTab ? '_blank' : '_self'}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                className={`text-sm font-medium transition-colors hover:text-teal-brand ${
                  location.pathname === link.href ? 'text-teal-brand' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-container-orange/20 text-container-orange border border-container-orange/30 hover:bg-container-orange/30 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Control</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white transition-all shadow-md shadow-teal-brand/20"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-ocean-800 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold px-4 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-ocean-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-teal-brand hover:bg-teal-hover text-white transition-all shadow-md shadow-teal-brand/20"
                >
                  <span>Open Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-ocean-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ocean-950 border-b border-ocean-800 px-4 pt-3 pb-6 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-slate-200 hover:text-teal-brand"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-ocean-800 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-brand text-white font-semibold text-center"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>User Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-container-orange text-white font-semibold text-center"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Control Center</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-700 text-rose-400 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 rounded-xl border border-ocean-700 text-slate-200 font-semibold text-center hover:bg-ocean-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 rounded-xl bg-teal-brand text-white font-semibold text-center"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
