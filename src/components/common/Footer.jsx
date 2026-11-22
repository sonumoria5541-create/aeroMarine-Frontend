import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, ShieldAlert, Globe, Compass, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-ocean-950 text-slate-400 border-t border-ocean-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-ocean-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-brand to-ocean-700 flex items-center justify-center text-white">
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-display">
                  AERO<span className="text-teal-brand">MARINE</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Maritime Capital Platform
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting maritime capital with verified global container logistics and international freight charter lines.
              Operating under strict auditable ledger governance.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-teal-brand flex-shrink-0" />
              <span>International Port Complex, Nariman Point, Mumbai</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Fleet Operations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/containers" className="hover:text-teal-brand transition-colors">
                  Container Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-brand transition-colors">
                  Maritime Logistics
                </Link>
              </li>
              <li>
                <Link to="/containers/standard-20ft-dry-cargo" className="hover:text-teal-brand transition-colors">
                  Standard 20ft Cargo
                </Link>
              </li>
              <li>
                <Link to="/containers/reefer-temperature-controlled" className="hover:text-teal-brand transition-colors">
                  Cold-Chain Reefers
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Governance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/terms" className="hover:text-teal-brand transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-brand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/risk-disclosure" className="hover:text-teal-brand transition-colors">
                  Risk Disclosures
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-teal-brand transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Desk */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Operations Desk
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-container-orange" />
                <span>support@aeromarine.local</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-brand" />
                <span>+91 22 4988 2000</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Global Ports Network</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Regulatory & Risk Disclosure Notice */}
        <div className="pt-8 text-xs text-slate-400 leading-relaxed space-y-3">
          <div className="flex items-start gap-2 bg-ocean-900/60 p-4 rounded-xl border border-ocean-800">
            <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-200">Regulatory & Risk Notice:</strong> AeroMarine is presented as a maritime container business infrastructure.
              Participating in container units and receiving earnings constitutes commercial participation subject to global freight charter demand, fuel surcharges, and maritime logistics variables.
              Figures presented reflect standard maritime freight lease agreements and do not constitute guaranteed or risk-free returns.
              All operations are governed by statutory maritime logistics standards.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-slate-400 text-xs gap-4">
            <p>© {new Date().getFullYear()} AeroMarine Logistics Global Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-brand" />
              <span>Double-Entry Balanced Ledger Infrastructure v1.0</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
