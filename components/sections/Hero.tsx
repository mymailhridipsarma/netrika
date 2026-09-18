'use client'

import React from 'react'
import {
  ArrowRight,
  Play,
  ShieldCheck,
  Sparkles,
  Check,
  Zap,
  BrainCircuit,
  HeartHandshake,
  Crosshair,
  TrendingUp,
  ScanEye,
} from 'lucide-react'
import type { UserProfile } from '@/lib/db/userStore'

interface HeroProps {
  onSignInClick?: () => void
  user?: UserProfile | null
}

export function Hero({ onSignInClick, user }: HeroProps) {
  const bottomFeatures = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Accuracy',
      desc: 'Advanced AI models for reliable retinopathy detection.',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      desc: 'Quick screening, better workflows.',
    },
    {
      icon: ShieldCheck,
      title: 'Trusted by Professionals',
      desc: 'Decision support, always reviewed by experts.',
    },
    {
      icon: HeartHandshake,
      title: 'Better Patient Outcomes',
      desc: 'Early detection leads to better vision care.',
    },
  ]

  return (
    <section
      id="top"
      className="relative min-h-[96vh] pt-28 sm:pt-32 pb-16 flex flex-col justify-between overflow-hidden bg-white"
    >
      {/* AMBIENT MINT & WHITE SOFT GLOW BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-teal-100/40 via-emerald-50/30 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-[450px] h-[450px] rounded-full bg-teal-50/50 blur-3xl pointer-events-none" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0da48712_1px,transparent_1px)] bg-[size:28px_28px] opacity-60 pointer-events-none" />
      </div>

      {/* MAIN HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* LEFT COLUMN: HERO TEXT & CALL TO ACTIONS */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f8f3] border border-[#a7f3d0] text-[#0da487] text-[11px] font-medium tracking-wide shadow-xs">
              <Sparkles size={13} className="text-[#0da487]" />
              <span>AI-POWERED DIABETIC RETINOPATHY SCREENING</span>
            </div>

            {/* Headline with refined elegance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-semibold tracking-tight text-slate-900 leading-[1.18]">
              Smarter Screening <br />
              for <span className="text-[#0da487] font-bold">Healthier Tomorrows</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-[17px] text-slate-600 max-w-lg leading-relaxed font-normal">
              See what the AI sees. <br className="hidden sm:inline" />
              Screen diabetic retinopathy from retinal images and understand the regions influencing every AI prediction.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#screening"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold bg-[#0da487] text-white hover:bg-[#0b8a70] shadow-md shadow-[#0da487]/20 hover:shadow-lg hover:shadow-[#0da487]/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <ScanEye size={17} />
                <span>Start Screening</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#technology"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:shadow-md transition-all"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700">
                  <Play size={10} fill="currentColor" />
                </span>
                <span>Explore how it works</span>
              </a>
            </div>

            {/* Clinical Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 font-normal">
              <ShieldCheck size={16} className="text-[#0da487] shrink-0" />
              <span>Decision support, always reviewed by a qualified professional.</span>
            </div>
          </div>

          {/* RIGHT COLUMN: EYE CLOSE-UP + SCANNER HUD + LIVE AI ANALYSIS CARD */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[520px]">
            
            {/* Top-Right Clinical Trust Annotation */}
            <div className="absolute top-2 right-4 sm:right-10 z-20 hidden sm:flex flex-col items-end pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-teal-200/80 shadow-md text-xs font-medium text-slate-700">
                <Sparkles size={13} className="text-[#0da487]" />
                <span>Better insights &middot; Brighter futures</span>
                <TrendingUp size={13} className="text-[#0da487]" />
              </div>
            </div>

            {/* Center Background Eye Graphic */}
            <div className="relative w-[340px] sm:w-[440px] md:w-[480px] aspect-square rounded-full overflow-hidden shadow-2xl shadow-teal-900/10 border-4 border-white">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/hero-eye.jpg"
                className="w-full h-full object-cover select-none transform scale-105"
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Concentric HUD Scanner Circles Overlay on Eye */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Outer Reticle Ring */}
                <div className="w-[82%] h-[82%] rounded-full border border-teal-400/50 relative">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#10b981]" />
                  <span className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#10b981]" />
                </div>
                {/* Mid Ring */}
                <div className="absolute w-[58%] h-[58%] rounded-full border border-teal-300/60 border-dashed" />
                {/* Inner Ring */}
                <div className="absolute w-[36%] h-[36%] rounded-full border border-teal-400/80" />
                {/* Center pupil target dot */}
                <div className="absolute w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_12px_#34d399]" />
              </div>

              {/* Edge Gradient Mask for seamless soft blending */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30 pointer-events-none" />
            </div>

            {/* Curved Orbit Connecting Line */}
            <div className="absolute -left-4 sm:left-4 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-teal-300/40 pointer-events-none hidden md:block" />

            {/* FLOATING GLASSMORPHIC LIVE ANALYSIS CARD */}
            <div className="absolute -bottom-4 sm:bottom-2 right-0 sm:right-2 z-20 w-[90%] sm:w-[320px] md:w-[340px] rounded-3xl bg-white/95 backdrop-blur-xl border border-teal-100/90 shadow-[0_20px_45px_rgba(13,164,135,0.14),0_6px_18px_rgba(0,0,0,0.06)] p-4 sm:p-5 space-y-3.5 transition-transform hover:-translate-y-1 duration-300">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0da487] animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wider text-slate-800">
                    NETRIKA AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9.5px] font-medium tracking-wider text-slate-400 uppercase">
                  <span>LIVE ANALYSIS</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0da487]" />
                </div>
              </div>

              {/* Retinal Fundus Scan Viewport with Corner Brackets */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner group">
                <img
                  src="/live-analysis-fundus.jpg"
                  alt="Live retinal fundus inference"
                  className="w-full h-full object-cover select-none"
                />

                {/* Reticle Scanner HUD & Target Markers */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-teal-400/60" />
                  <div className="absolute w-16 h-16 rounded-full border border-teal-300/40 border-dashed" />
                  <div className="absolute w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#34d399]" />
                  <span className="absolute top-6 left-8 flex items-center justify-center text-teal-300">
                    <Crosshair size={11} className="opacity-80" />
                  </span>
                  <span className="absolute bottom-6 left-12 flex items-center justify-center text-teal-300">
                    <Crosshair size={11} className="opacity-80" />
                  </span>
                </div>

                {/* Animated Horizontal Scanline */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_8px_#2dd4bf] animate-[scanPulseMove_2.5s_ease-in-out_infinite]" />

                {/* High-tech Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-white rounded-tl-sm pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-white rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-white rounded-bl-sm pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-white rounded-br-sm pointer-events-none" />
              </div>

              {/* Clinical Metrics Grid */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 pt-0.5 text-left">
                <div>
                  <div className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                    IMAGE STATUS
                  </div>
                  <div className="text-xs font-semibold text-[#0da487] mt-0.5">
                    Gradable
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                    DR SEVERITY
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    Level 2
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                    CONFIDENCE
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    94.2%
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
                    KEY FINDINGS
                  </div>
                  <div className="text-xs font-semibold text-slate-900 mt-0.5">
                    3 regions
                  </div>
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10.5px]">
                <div className="flex items-center gap-1 text-[#0da487] font-medium">
                  <Check size={13} className="stroke-[2.5]" />
                  <span>Analysis complete</span>
                </div>
                <div className="font-mono text-slate-400 text-[10px]">08:42</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM 4-FEATURE HIGHLIGHTS BAR */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
          {bottomFeatures.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0] shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Icon size={20} className="stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Organic Soft Wave Divider at bottom */}
      <div className="w-full overflow-hidden leading-none mt-10 -mb-16 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 text-[#f8faf9]"
          preserveAspectRatio="none"
        >
          <path
            d="M0 24C360 64 720 0 1080 36C1260 54 1360 40 1440 32V80H0V24Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}
