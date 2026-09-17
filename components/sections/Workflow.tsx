'use client'

import React from 'react'
import { UploadCloud, Activity, Sparkles, Stethoscope, ArrowRight } from 'lucide-react'

export function Workflow() {
  const steps = [
    {
      no: '01',
      title: 'Capture & Ingest',
      copy: 'Upload or capture a 45° or ultra-widefield retinal fundus image from any compatible camera.',
      icon: UploadCloud,
    },
    {
      no: '02',
      title: 'Assess Gradability',
      copy: 'Instant automated quality check validates focus clarity, field illumination, and artifact absence before inference.',
      icon: Activity,
    },
    {
      no: '03',
      title: 'Explain & Localize',
      copy: 'PyTorch deep neural network generates ICDR grade (0-4) with high-resolution Grad-CAM region saliency heatmaps.',
      icon: Sparkles,
    },
    {
      no: '04',
      title: 'Specialist Sign-off',
      copy: 'An ophthalmologist reviews the case, inspects microaneurysms/exudates, adds clinical notes, and signs off digitally.',
      icon: Stethoscope,
    },
  ]

  return (
    <section id="technology" className="relative py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f8f3] border border-[#a7f3d0] text-[#0da487] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0da487] animate-pulse" />
            <span>CLINICAL PROTOCOL &middot; 4-STEP PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            From retinal image <br />
            <span className="text-[#0da487]">
              to informed review.
            </span>
          </h2>

          <p className="text-base text-slate-600">
            A standardized diagnostic workflow designed for primary health centers, rural vision clinics, and tele-ophthalmology networks.
          </p>
        </div>

        {/* 4 STEPS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.no}
                className="group relative p-6 rounded-3xl bg-[#f8faf9] border border-slate-200/80 hover:border-teal-400/80 hover:bg-white transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-xl hover:shadow-teal-900/5 flex flex-col justify-between"
              >
                {/* Glowing top line accent on hover */}
                <div className="absolute inset-x-8 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#0da487] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Top Step Row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-300 font-mono group-hover:text-[#0da487] transition-colors">
                      {step.no}
                    </span>
                    <div className="p-3 rounded-2xl bg-[#e6f8f3] border border-[#a7f3d0] text-[#0da487] group-hover:scale-110 group-hover:bg-teal-100/60 transition-all duration-300">
                      <Icon size={22} className="stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Title & Copy */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0da487] transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.copy}
                  </p>
                </div>

                {/* Subtitle / Step Index indicator */}
                <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-slate-700">
                  <span>Phase {idx + 1}</span>
                  <ArrowRight size={13} className="text-[#0da487] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
