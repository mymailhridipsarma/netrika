'use client'

import React from 'react'
import { ArrowUp, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/common/Logo'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-slate-200/80 bg-[#f8faf9] py-14 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          <Logo />
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#top" className="hover:text-[#0da487] transition-colors">Home</a>
            <a href="#technology" className="hover:text-[#0da487] transition-colors">Technology &amp; Explainability</a>
            <a href="#screening-app" className="hover:text-[#0da487] transition-colors">3D Mobile App</a>
            <a href="#screening" className="hover:text-[#0da487] transition-colors">Screening Workspace</a>
            <a href="#reports" className="hover:text-[#0da487] transition-colors">Clinical Dashboard</a>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#0da487] hover:text-[#0da487] transition-all shadow-xs group"
          >
            <span>Back to top</span>
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Regulatory & Decision-Support Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-[#e6f8f3] border border-[#a7f3d0] flex items-start sm:items-center gap-3.5 text-xs text-slate-700 leading-relaxed">
          <div className="p-2 rounded-xl bg-white text-[#0da487] border border-[#a7f3d0] shrink-0 shadow-xs">
            <ShieldCheck size={18} />
          </div>
          <p>
            <strong className="text-slate-900">Clinical Decision Support Notice:</strong> Netrika is an AI-assisted diabetic retinopathy screening and triage system intended to support clinical workflows. Algorithmic outputs, Grad-CAM heatmaps, and severity scores do not constitute an independent medical diagnosis and must always be verified by an authorized ophthalmologist or qualified eye care practitioner.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Netrika Health AI. Designed for Tele-Ophthalmology &amp; Rural Vision Centres.
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span>Powered by PyTorch &amp; EfficientNet-B4</span>
            <span>&bull;</span>
            <span>ICMR &amp; WHO Guidelines Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
