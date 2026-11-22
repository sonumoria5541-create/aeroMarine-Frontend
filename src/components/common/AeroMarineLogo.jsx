import React from 'react';

/**
 * AeroMarine Official Maritime Platform Logo Component
 * Combines an aerodynamic crest, cargo container vessel, oceanic waves, and navigation star.
 */
export const AeroMarineLogo = ({
  size = 40,
  variant = 'icon', // 'icon' | 'horizontal' | 'badge' | 'hero'
  className = '',
  showSubtitle = true,
  theme = 'dark', // 'dark' (on dark navy) | 'light' (on light backgrounds)
}) => {
  const iconSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-300"
    >
      <defs>
        <linearGradient id="logoOceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B2545" />
          <stop offset="50%" stopColor="#134074" />
          <stop offset="100%" stopColor="#0077B6" />
        </linearGradient>

        <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="logoCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00B4D8" />
          <stop offset="100%" stopColor="#90E0EF" />
        </linearGradient>

        <linearGradient id="logoHullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D9EDFC" />
        </linearGradient>

        <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#071324" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Outer Medallion */}
      <circle
        cx="120"
        cy="120"
        r="112"
        fill="url(#logoOceanGrad)"
        stroke="url(#logoGoldGrad)"
        strokeWidth="5"
        filter="url(#logoShadow)"
      />
      <circle
        cx="120"
        cy="120"
        r="102"
        stroke="#00B4D8"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.5"
      />

      {/* Aerodynamic Wave Wings */}
      <path
        d="M 40 125 C 65 95, 95 90, 115 100 C 95 108, 70 120, 50 145 Z"
        fill="url(#logoCyanGrad)"
        opacity="0.3"
      />
      <path
        d="M 200 125 C 175 95, 145 90, 125 100 C 145 108, 170 120, 190 145 Z"
        fill="url(#logoCyanGrad)"
        opacity="0.3"
      />

      {/* Gold Compass Star Beacon */}
      <g transform="translate(120, 56)">
        <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="url(#logoGoldGrad)" />
        <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
      </g>

      {/* Mast Antenna */}
      <line x1="120" y1="68" x2="120" y2="108" stroke="url(#logoGoldGrad)" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="108" y1="84" x2="132" y2="84" stroke="url(#logoGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="112" y1="94" x2="128" y2="94" stroke="url(#logoGoldGrad)" strokeWidth="2" strokeLinecap="round" />

      {/* Bridge / Control Tower */}
      <rect x="110" y="98" width="20" height="14" rx="2" fill="#FFFFFF" opacity="0.95" />
      <rect x="113" y="101" width="14" height="4" rx="1" fill="#0B2545" />

      {/* Stacked Freight Containers */}
      <g transform="translate(0, 5)">
        <rect x="86" y="112" width="14" height="10" rx="1.5" fill="#F59E0B" stroke="#0B2545" strokeWidth="0.8" />
        <rect x="102" y="112" width="16" height="10" rx="1.5" fill="#00B4D8" stroke="#0B2545" strokeWidth="0.8" />
        <rect x="122" y="112" width="16" height="10" rx="1.5" fill="#EF4444" stroke="#0B2545" strokeWidth="0.8" />
        <rect x="140" y="112" width="14" height="10" rx="1.5" fill="#10B981" stroke="#0B2545" strokeWidth="0.8" />

        <rect x="94" y="103" width="14" height="9" rx="1.5" fill="#3B82F6" stroke="#0B2545" strokeWidth="0.8" />
        <rect x="132" y="103" width="14" height="9" rx="1.5" fill="#F59E0B" stroke="#0B2545" strokeWidth="0.8" />
      </g>

      {/* Ship Hull Slicing Ocean */}
      <path
        d="M 62 132 L 80 152 L 160 152 L 178 132 L 168 126 L 72 126 Z"
        fill="url(#logoHullGrad)"
        stroke="#0B2545"
        strokeWidth="1.5"
      />
      <path d="M 72 138 L 82 152 L 158 152 L 168 138 Z" fill="#E63946" />

      {/* Dynamic Slicing Waves */}
      <path
        d="M 44 158 C 70 148, 95 158, 120 150 C 145 142, 170 154, 196 156 C 180 166, 150 168, 120 165 C 90 162, 65 168, 44 158 Z"
        fill="url(#logoCyanGrad)"
      />
      <path
        d="M 58 168 C 82 160, 106 170, 130 164 C 154 158, 178 166, 182 168 C 160 178, 135 178, 110 176 C 85 174, 68 176, 58 168 Z"
        fill="#0077B6"
        opacity="0.85"
      />

      {/* Bottom Anchor Crest */}
      <path
        d="M 104 186 C 114 192, 126 192, 136 186"
        stroke="url(#logoGoldGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="120" cy="190" r="2.8" fill="url(#logoGoldGrad)" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{iconSvg}</div>;
  }

  if (variant === 'badge') {
    return (
      <div className={`relative inline-flex items-center justify-center p-1 rounded-full shadow-lg ${className}`}>
        {iconSvg}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="relative mb-3.5 drop-shadow-[0_12px_24px_rgba(0,119,182,0.35)]">
          {iconSvg}
          <div className="absolute -inset-2 bg-cyan-400/20 blur-xl -z-10 rounded-full"></div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <span
            className={`text-2xl font-black tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            AEROMARINE
          </span>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm tracking-wider">
            EXPORTS
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`text-xs font-medium tracking-wide ${
              theme === 'dark' ? 'text-cyan-200/80' : 'text-slate-500'
            }`}
          >
            Global Container & Maritime Investment Platform
          </p>
        )}
      </div>
    );
  }

  // Default: 'horizontal'
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {iconSvg}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-black tracking-wider leading-none ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            AEROMARINE
          </span>
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500 text-white shadow-sm leading-none tracking-wider">
            EXPORTS
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] font-medium leading-tight mt-1 ${
              theme === 'dark' ? 'text-cyan-200/80' : 'text-slate-500'
            }`}
          >
            Global Maritime Logistics
          </span>
        )}
      </div>
    </div>
  );
};

export default AeroMarineLogo;
