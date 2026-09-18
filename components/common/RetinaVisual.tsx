'use client'

import React from 'react'

export type ViewMode = 'original' | 'gradcam' | 'overlay'

export function RetinaVisual({
  mode = 'original',
  compact = false,
  src = '/netrika-fundus.png',
  heatmapSrc,
  overlaySrc,
  className = '',
}: {
  mode?: ViewMode
  compact?: boolean
  src?: string
  heatmapSrc?: string
  overlaySrc?: string
  className?: string
}) {
  const activeSrc =
    mode === 'gradcam' && heatmapSrc
      ? heatmapSrc
      : mode === 'overlay' && overlaySrc
      ? overlaySrc
      : src

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-200 shadow-lg flex items-center justify-center transition-all duration-300 ${
        compact ? 'w-full max-w-[280px] aspect-square' : 'w-full aspect-square'
      } ${className}`}
      role="img"
      aria-label={`${mode} retinal image visualization`}
    >
      {/* Background Retinal Image */}
      <img
        src={activeSrc}
        alt="Retinal fundus scan"
        className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Radial Vignette Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(7,17,31,0.85)_100%)] pointer-events-none" />

      {/* Synthetic Heatmap Layer (if in gradcam mode without explicit pre-rendered heatmap) */}
      {mode !== 'original' && !heatmapSrc && (
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/25 via-violet-500/30 to-amber-500/20 mix-blend-color-dodge pointer-events-none animate-pulse" />
      )}

      {/* Overlay Tint */}
      {mode === 'overlay' && !overlaySrc && (
        <div className="absolute inset-0 bg-teal-500/15 mix-blend-overlay pointer-events-none" />
      )}

      {/* Circular Instrument Ring */}
      <div className="absolute inset-3 rounded-full border border-teal-500/20 pointer-events-none shadow-[inset_0_0_20px_rgba(56,217,197,0.05)]" />

      {/* Animated Medical Scan Line */}
      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_14px_rgba(56,217,197,0.9)] pointer-events-none animate-[scanPulseMove_3.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" />

      {/* Saliency Feature Pinpoints (Demonstrative AI Attention) */}
      <span
        className="absolute top-[38%] left-[46%] w-2.5 h-2.5 rounded-full bg-teal-400/90 shadow-[0_0_10px_#38d9c5] animate-ping pointer-events-none"
        title="Salient Microaneurysm Region"
      />
      <span
        className="absolute top-[38%] left-[46%] w-2 h-2 rounded-full bg-teal-300 pointer-events-none"
      />

      <span
        className="absolute top-[52%] left-[62%] w-2 h-2 rounded-full bg-violet-400/80 shadow-[0_0_8px_#8b7cff] animate-pulse pointer-events-none"
        title="Hemorrhagic Saliency"
      />

      <span
        className="absolute top-[32%] left-[34%] w-1.5 h-1.5 rounded-full bg-amber-400/70 shadow-[0_0_6px_#f2b84b] pointer-events-none"
        title="Exudate Marker"
      />

      {/* Crosshair Corner Markers */}
      <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-teal-400/60 rounded-tl-sm pointer-events-none" />
      <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-teal-400/60 rounded-tr-sm pointer-events-none" />
      <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-teal-400/60 rounded-bl-sm pointer-events-none" />
      <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-teal-400/60 rounded-br-sm pointer-events-none" />
    </div>
  )
}
