'use client'

import React, { useState, useEffect } from 'react'
import {
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
  BadgeCheck,
  ChevronRight,
  Filter,
  Search,
  Activity,
  ArrowUpRight,
  Layers,
  AlertTriangle,
  User,
  Gauge,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react'
import type { CaseRecord } from '@/lib/ai/types'

interface DashboardProps {
  refreshKey?: number
  onSelectCase?: (c: CaseRecord) => void
}

export function Dashboard({ refreshKey, onSelectCase }: DashboardProps) {
  const [cases, setCases] = useState<CaseRecord[]>([
    {
      id: 'NET-2026-0001',
      caseStatus: 'PENDING_REVIEW',
      level: 'Level 3',
      drLevelNum: 3,
      drClassName: 'Severe DR',
      confidence: '92.4%',
      status: 'Referable',
      priority: 'Pending Ophthalmologist Review',
      imageSrc: '/netrika-fundus.png',
      timestamp: '2026-09-10T08:30:00.000Z',
      patient: { name: 'Ramesh Gogoi', age: 58, eye: 'OD', gender: 'Male', diabetesYears: 12 },
    },
    {
      id: 'NET-2026-0002',
      caseStatus: 'PENDING_REVIEW',
      level: 'Level 2',
      drLevelNum: 2,
      drClassName: 'Moderate DR',
      confidence: '94.2%',
      status: 'Referable',
      priority: 'Pending Ophthalmologist Review',
      imageSrc: '/netrika-fundus.png',
      timestamp: '2026-09-10T07:55:00.000Z',
      patient: { name: 'Sunita Bora', age: 62, eye: 'OS', gender: 'Female', diabetesYears: 15 },
    },
    {
      id: 'NET-2026-0003',
      caseStatus: 'REVIEWED',
      level: 'Level 1',
      drLevelNum: 1,
      drClassName: 'Mild DR',
      confidence: '88.4%',
      status: 'Non-referable',
      priority: 'Reviewed',
      imageSrc: '/live-analysis-fundus.jpg',
      timestamp: '2026-09-10T08:15:00.000Z',
      patient: { name: 'Bipul Saikia', age: 49, eye: 'OD', gender: 'Male', diabetesYears: 6 },
    },
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'referable'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [stats, setStats] = useState({
    screenedToday: 24,
    referableCases: 5,
    pendingReview: 2,
    ungradable: 2,
  })

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/review')
        const data = await res.json()
        if (data.success) {
          if (data.cases) setCases(data.cases)
          if (data.stats) setStats(data.stats)
        }
      } catch (err) {
        console.log('Dashboard fetch error:', err)
      }
    }
    fetchCases()
  }, [refreshKey])

  const displayedCases = cases
    .filter((c) => {
      if (filter === 'pending') {
        return (
          c.caseStatus === 'PENDING_REVIEW' ||
          c.priority === 'Pending Ophthalmologist Review' ||
          c.priority === 'Pending' ||
          c.priority === 'High priority'
        )
      }
      if (filter === 'reviewed') {
        return (
          c.caseStatus === 'REVIEWED' ||
          c.priority === 'Reviewed' ||
          c.priority === 'Finalized' ||
          c.priority === 'Completed' ||
          !!c.ophthalmologistReview
        )
      }
      if (filter === 'referable') {
        return c.status === 'Referable'
      }
      return true
    })
    .filter((c) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        c.id.toLowerCase().includes(q) ||
        (c.patient?.name && c.patient.name.toLowerCase().includes(q)) ||
        (c.patient?.abhaId && c.patient.abhaId.toLowerCase().includes(q))
      )
    })

  return (
    <section id="reports" className="py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f8f3] border border-[#a7f3d0] text-[#0da487] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0da487] animate-pulse" />
              <span>CLINICAL SURVEILLANCE &middot; REAL-TIME METRICS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Screening Overview &amp; Reports
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Centralized triage and patient monitoring across vision centers and community health posts.
            </p>
          </div>
        </div>

        {/* 4 KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-[#f8faf9] border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Screened Today
              </span>
              <div className="text-3xl font-black text-slate-900">{stats.screenedToday}</div>
              <span className="text-[11px] text-[#0da487] font-semibold mt-1 inline-block">
                +14% from yesterday
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0]">
              <Eye size={24} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#f8faf9] border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Referable DR Cases
              </span>
              <div className="text-3xl font-black text-rose-600">{stats.referableCases}</div>
              <span className="text-[11px] text-rose-600 font-semibold mt-1 inline-block">
                Immediate specialist review
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertCircle size={24} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#f8faf9] border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Pending Doctor Review
              </span>
              <div className="text-3xl font-black text-amber-600">{stats.pendingReview}</div>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
                Awaiting sign-off
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Clock size={24} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#f8faf9] border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                Ungradable Scans
              </span>
              <div className="text-3xl font-black text-slate-700">{stats.ungradable}</div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">
                Requires re-capture
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-600 border border-slate-200">
              <Activity size={24} />
            </div>
          </div>
        </div>

        {/* CLINICAL CASES TABLE CARD */}
        <div id="cases" className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
          {/* Card Head */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Patient Screening Queue &amp; Case Records</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any case record to view the comprehensive Grad-CAM report, doctor notes, and sign-off.
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487] w-44 sm:w-52"
                />
              </div>

              <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filter === 'all'
                      ? 'bg-[#0da487] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers size={12} />
                  All ({cases.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('pending')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filter === 'pending'
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock size={12} />
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('reviewed')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filter === 'reviewed'
                      ? 'bg-[#0da487] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 size={12} />
                  Reviewed
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('referable')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    filter === 'referable'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AlertTriangle size={12} />
                  Referable
                </button>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4 inline-flex items-center gap-1.5">
              <User size={12} className="text-slate-400" />
              Case ID &amp; Patient
            </div>
            <div className="col-span-2 inline-flex items-center gap-1.5">
              <Activity size={12} className="text-slate-400" />
              AI Severity
            </div>
            <div className="col-span-2 inline-flex items-center gap-1.5">
              <Gauge size={12} className="text-slate-400" />
              Confidence
            </div>
            <div className="col-span-2 inline-flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-slate-400" />
              Clinical Status
            </div>
            <div className="col-span-2 text-right inline-flex items-center justify-end gap-1.5">
              <Stethoscope size={12} className="text-slate-400" />
              Doctor Review
            </div>
          </div>

          {/* Case Rows */}
          <div className="divide-y divide-slate-100">
            {displayedCases.map((c) => {
              const isRev =
                c.caseStatus === 'REVIEWED' ||
                c.priority === 'Reviewed' ||
                c.priority === 'Finalized' ||
                c.priority === 'Completed' ||
                !!c.ophthalmologistReview

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCase && onSelectCase(c)}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-teal-50/40 transition-colors cursor-pointer group"
                >
                  {/* Case & Patient */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={c.imageSrc || '/netrika-fundus.png'}
                        alt={c.id}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0da487] group-hover:text-teal-700 transition-colors flex items-center gap-1.5">
                        <span>{c.id}</span>
                        <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-slate-600">
                        {c.patient?.name || 'Patient'} ({c.patient?.eye || 'OD'} &middot; {c.patient?.age || '50'}y)
                      </div>
                    </div>
                  </div>

                  {/* AI Severity */}
                  <div className="col-span-2 text-xs font-semibold text-slate-900">
                    {c.level} {c.drClassName ? `· ${c.drClassName}` : ''}
                  </div>

                  {/* Confidence */}
                  <div className="col-span-2 text-xs font-mono text-slate-600">
                    {c.confidence}
                  </div>

                  {/* Status Pill */}
                  <div className="col-span-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                        c.status === 'Referable'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  {/* Doctor Review */}
                  <div className="col-span-2 md:text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        isRev ? 'text-[#0da487]' : 'text-amber-600'
                      }`}
                    >
                      {isRev ? (
                        <>
                          <BadgeCheck size={14} className="text-[#0da487]" />
                          <span>Reviewed</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Pending Review</span>
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}

            {displayedCases.length === 0 && (
              <div className="p-12 text-center text-slate-500 text-sm">
                No clinical cases found matching your selected filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
