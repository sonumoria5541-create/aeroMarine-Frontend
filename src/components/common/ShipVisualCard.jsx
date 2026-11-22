import React, { useState, useEffect } from 'react';
import { Ship, Anchor, Navigation, Waves, Gauge, Compass } from 'lucide-react';
import { getVesselData } from '../../lib/vesselVisuals';

export const ShipVisualCard = ({
  planName = '',
  category = 'regular',
  className = '',
  height = 'h-36',
  showSpecs = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const vessel = getVesselData(planName, category);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [vessel.imageUrl]);

  return (
    <div
      className={`relative w-full ${height} rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#0077B6] select-none group shadow-inner ${className}`}
    >
      {/* Real Ship Photo */}
      {!imgError && (
        <img
          src={vessel.imageUrl}
          alt={planName}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            imgLoaded ? 'opacity-90' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}

      {/* Fallback Maritime Graphic if offline or image loading */}
      {(!imgLoaded || imgError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#07192F] via-[#0B2545] to-[#134074]">
          <div className="text-center text-cyan-200/50 flex flex-col items-center">
            <Ship size={48} className="animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-cyan-300/70">
              {vessel.type}
            </span>
          </div>
        </div>
      )}

      {/* Dark Oceanic Vignette Gradients for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07192F]/90 via-[#07192F]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07192F]/50 via-transparent to-transparent pointer-events-none" />

      {/* Floating Top Route & Status Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#07192F]/80 backdrop-blur-md border border-cyan-400/30 text-cyan-200 text-[10px] font-bold shadow-sm">
          <Navigation size={10} className="text-cyan-300" />
          <span className="truncate max-w-[160px]">{vessel.route}</span>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-extrabold tracking-wider shadow-sm">
          <span>{vessel.roi || vessel.badge}</span>
        </div>
      </div>

      {/* Bottom Maritime Specs Overlay */}
      {showSpecs && (
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between z-10 text-white">
          <div>
            <div className="text-[10px] font-semibold text-cyan-300 flex items-center gap-1 drop-shadow">
              <Compass size={11} className="text-cyan-400" />
              <span>{vessel.type}</span>
            </div>
            <div className="text-[9px] text-blue-100/80 mt-0.5">
              <span>Cap: {vessel.containers}</span> • <span>{vessel.tonnage}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm text-[9px] font-mono text-cyan-200 border border-white/10">
            <Gauge size={10} className="text-emerald-400" />
            <span>{vessel.speed}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipVisualCard;
