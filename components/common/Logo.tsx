'use client'

import React from 'react'

export function Logo({
  variant = 'default',
  size = 'md',
  className = '',
}: {
  variant?: 'default' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const isLg = size === 'lg'
  const isSm = size === 'sm'

  return (
    <a
      href="#top"
      aria-label="Netrika home"
      className={`group inline-flex items-center gap-3 select-none no-underline transition-all duration-300 ${className}`}
    >
      {/* High-res Logo Mark Container */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-teal-200/80 shadow-sm shadow-teal-500/10 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-teal-500/20 group-hover:border-teal-400 ${
          isLg
            ? 'w-13 h-13 p-1.5'
            : isSm
            ? 'w-8 h-8 p-1'
            : 'w-11 h-11 sm:w-12 sm:h-12 p-1.5'
        }`}
      >
        <img
          src="/Logo.png"
          alt="Netrika Logo"
          className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:rotate-1"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`font-black tracking-tight text-slate-900 leading-none ${
              isLg
                ? 'text-2xl sm:text-3xl'
                : isSm
                ? 'text-base'
                : 'text-xl sm:text-[23px]'
            }`}
          >
            Netrika
          </span>
          <span
            className={`inline-flex items-center font-black rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xs leading-none ${
              isLg
                ? 'px-2 py-1 text-xs'
                : isSm
                ? 'px-1.5 py-0.5 text-[9px]'
                : 'px-1.5 py-0.5 text-[10.5px]'
            }`}
          >
            AI
          </span>
        </div>
        {variant !== 'compact' && (
          <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase mt-1 leading-none">
            Retinal Intelligence
          </span>
        )}
      </div>
    </a>
  )
}

