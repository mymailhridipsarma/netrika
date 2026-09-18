'use client'

import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  Menu,
  X,
  User,
  Globe,
  ArrowRight,
  Home,
  ScanEye,
  MapPin,
  Info,
  Layers,
  Workflow,
  Eye,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Smartphone,
  FileText,
  TrendingUp,
  LayoutDashboard,
  FileCheck,
  UserCheck,
  BookOpen,
  ShieldCheck,
  Hospital,
  CalendarCheck,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import type { UserProfile } from '@/lib/db/userStore'

interface NavbarProps {
  onSignInClick?: () => void
  user?: UserProfile | null
}

export function Navbar({ onSignInClick, user }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('English')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Dynamic active section detection
      const sections = [
        { id: 'top', name: 'home' },
        { id: 'screening-app', name: 'mobile' },
        { id: 'technology', name: 'technology' },
        { id: 'screening', name: 'screening' },
        { id: 'reports', name: 'reports' },
        { id: 'cases', name: 'cases' },
      ]

      const scrollPosition = window.scrollY + 120
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id)
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(section.name)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navMenuItems = [
    {
      id: 'screening',
      label: 'Screening',
      href: '#screening',
      dropdown: [
        { title: 'AI Retinal Screening', desc: 'Instant ICDR Grade 0–4 & DR Severity', href: '#screening', icon: Eye },
        { title: 'Quality & Gradability Check', desc: 'Automated focus, illumination & artifact validation', href: '#screening', icon: CheckCircle2 },
        { title: 'Explainable Heatmaps', desc: 'Grad-CAM lesion visual saliency & localization', href: '#screening', icon: Sparkles },
        { title: 'Fundus Biomarkers', desc: 'Microaneurysms, exudates & hemorrhages analysis', href: '#screening', icon: ScanEye },
      ],
    },
    {
      id: 'cases',
      label: 'Cases',
      href: '#cases',
      dropdown: [
        { title: 'Patient Screening Queue', desc: 'Real-time triage table with severity badges', href: '#cases', icon: LayoutDashboard },
        { title: 'Specialist Sign-off Dossier', desc: 'Certified ophthalmologist review portal', href: '#cases', icon: UserCheck },
        { title: 'Rural PHC Tele-Consults', desc: 'Vision center referrals & secondary reviews', href: '#cases', icon: Stethoscope },
        { title: 'Urgent Case Alerts', desc: 'Priority flags for Severe NPDR & PDR cases', href: '#cases', icon: FileText },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '#reports',
      dropdown: [
        { title: 'Screening Overview & Stats', desc: 'Total screened, gradability rate & DR breakdown', href: '#reports', icon: TrendingUp },
        { title: 'Diagnostic Case Reports', desc: 'Printable patient summaries & audit trails', href: '#cases', icon: FileCheck },
        { title: 'Longitudinal DR Progression', desc: 'Historical grade shifts & visual trend tracking', href: '#screening-app', icon: BookOpen },
      ],
    },
    {
      id: 'technology',
      label: 'Technology',
      href: '#technology',
      dropdown: [
        { title: 'Clinical AI Pipeline', desc: 'Dual-stream PyTorch deep learning architecture', href: '#technology', icon: Layers },
        { title: '4-Step Screening Workflow', desc: 'Standardized capture to specialist sign-off', href: '#technology', icon: Workflow },
        { title: 'ICMR & WHO Standards', desc: 'Clinical guideline alignment & validation', href: '#technology', icon: ShieldCheck },
        { title: 'Grad-CAM Explainability', desc: 'Transparent saliency maps for clinician trust', href: '#technology', icon: Info },
      ],
    },
    {
      id: 'mobile',
      label: 'Mobile Device',
      href: '#screening-app',
      dropdown: [
        { title: '3D Smartphone Hardware', desc: 'Real-time interactive mobile screening model', href: '#screening-app', icon: Smartphone },
        { title: 'Field Worker Tele-Kit', desc: 'Point-of-care fundus capture in rural PHCs', href: '#screening-app', icon: Hospital },
        { title: 'Offline-Ready Inference', desc: 'Edge screening without uninterrupted internet', href: '#screening-app', icon: MapPin },
      ],
    },
    {
      id: 'home',
      label: 'About',
      href: '#top',
      dropdown: [
        { title: 'Netrika Platform Overview', desc: 'AI-assisted tele-ophthalmology for rural vision', href: '#top', icon: Home },
        { title: 'Rural Eye Care Impact', desc: 'Eliminating preventable vision loss in underserved areas', href: '#top', icon: MapPin },
      ],
    },
  ]

  return (
    <>
      {/* FLOATING LIGHT GLASSMORPHIC NAVBAR */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[min(1240px,calc(100%-2rem))] z-50 transition-all duration-300">
        <header
          className={`relative w-full h-[70px] flex items-center justify-between px-4 sm:px-6 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(13,164,135,0.08),0_4px_12px_rgba(0,0,0,0.04)]'
              : 'bg-white/90 backdrop-blur-md border border-slate-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
          }`}
        >
          {/* BRAND LOGO */}
          <Logo variant="default" size="md" />

          {/* DESKTOP NAVIGATION ITEMS */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navMenuItems.map((item, idx) => {
              const isActive = activeSection === item.id
              return (
                <div key={idx} className="relative group">
                  <a
                    href={item.href}
                    className={`relative flex items-center gap-1 px-3 py-1.5 rounded-full text-[13.5px] font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-teal-700 font-bold bg-teal-50/70'
                        : 'text-slate-700 hover:text-teal-700 hover:bg-teal-50/50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 group-hover:rotate-180 ${
                        isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'
                      }`}
                    />
                    {/* Underline indicator for active menu item */}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-teal-500 rounded-full" />
                    )}
                  </a>

                  {/* DROPDOWN MENU */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-2 shadow-xl shadow-slate-900/10 space-y-1">
                      {item.dropdown.map((sub, subIdx) => {
                        const SubIcon = sub.icon
                        return (
                          <a
                            key={subIdx}
                            href={sub.href}
                            className="flex items-start gap-2.5 p-2 rounded-xl text-slate-700 hover:text-teal-800 hover:bg-teal-50/70 transition-all group/item"
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-teal-50/80 text-[#0da487] border border-teal-100 group-hover/item:bg-teal-100/70 group-hover/item:scale-105 transition-all shrink-0">
                              <SubIcon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold group-hover/item:text-teal-700 transition-colors truncate">
                                {sub.title}
                              </div>
                              <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                                {sub.desc}
                              </div>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector Pill */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 transition-all"
              >
                <Globe size={13} className="text-teal-600" />
                <span>{currentLang}</span>
                <ChevronDown size={11} className="text-slate-400" />
              </button>

              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl p-1 shadow-lg z-50">
                  {['English', 'Hindi', 'Assamese', 'Bengali'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setCurrentLang(lang)
                        setLangOpen(false)
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentLang === lang ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            {user ? (
              <button
                type="button"
                onClick={onSignInClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 hover:bg-teal-100/70 transition-all cursor-pointer shadow-xs"
                title="Click to view clinician profile or switch account"
              >
                <UserCheck size={13} className="text-teal-600" />
                <span>{user.role}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSignInClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 hover:bg-teal-100/70 transition-all cursor-pointer shadow-xs"
              >
                <UserCheck size={13} className="text-teal-600" />
                <span>Technician</span>
              </button>
            )}

            {/* Screening CTA Button */}
            <a
              href="#screening"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Eye size={14} />
              <span>Start Screening</span>
            </a>

            {/* Hamburger Button (Mobile / Tablet) */}
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all"
              aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            >
              {drawerOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </header>
      </div>

      {/* MOBILE / TABLET SLIDE-OUT DRAWER */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 bottom-0 w-[min(340px,85vw)] bg-white border-l border-slate-200 z-50 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <Logo variant="default" size="md" />
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          {/* Clinician Pill in Drawer */}
          <div className="my-4">
            {user ? (
              <div
                onClick={() => {
                  setDrawerOpen(false)
                  if (onSignInClick) onSignInClick()
                }}
                className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                    <div className="text-[10px] text-slate-500">{user.role} · {user.centerName || 'Sonitpur PHC'}</div>
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400 -rotate-90" />
              </div>
            ) : (
              <button
                onClick={() => {
                  setDrawerOpen(false)
                  if (onSignInClick) onSignInClick()
                }}
                className="w-full py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 hover:bg-teal-100/70 flex items-center justify-center gap-2"
              >
                <User size={14} /> Clinician Sign In / Switch Role
              </button>
            )}
          </div>

          {/* Drawer Menu Links */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-260px)] pr-1">
            {navMenuItems.map((item, idx) => {
              const isExpanded = activeMobileDropdown === item.label
              return (
                <div key={idx} className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => setActiveMobileDropdown(isExpanded ? null : item.label)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:text-teal-700"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-teal-600' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-2 pt-1 space-y-1 bg-white border-t border-slate-200/70">
                      {item.dropdown.map((sub, subIdx) => {
                        const SubIcon = sub.icon
                        return (
                          <a
                            key={subIdx}
                            href={sub.href}
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-lg text-[11px] text-slate-600 hover:text-teal-800 hover:bg-teal-50"
                          >
                            <SubIcon size={14} className="text-[#0da487] shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-teal-700">{sub.title}</div>
                              <div className="text-[10px] text-slate-500">{sub.desc}</div>
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href="#screening"
            onClick={() => setDrawerOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-md"
          >
            <span>Start Screening</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </aside>
    </>
  )
}
