'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  BadgeCheck,
  ShieldCheck,
  Check,
  User,
  Clock,
  Printer,
  FileText,
  Activity,
  Layers,
  Award,
  Gauge,
  ShieldAlert,
  Eye,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import type { CaseRecord, DRClass } from '@/lib/ai/types'
import type { UserProfile } from '@/lib/db/userStore'
import type { ViewMode } from '@/components/common/RetinaVisual'

interface CaseDetailModalProps {
  caseItem: CaseRecord | null
  onClose: () => void
  onReviewSubmitted?: () => void
  user?: UserProfile | null
}

export function CaseDetailModal({
  caseItem,
  onClose,
  onReviewSubmitted,
  user,
}: CaseDetailModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<DRClass>(caseItem?.drLevelNum ?? 2)
  const [notes, setNotes] = useState(caseItem?.ophthalmologistReview?.clinicalNotes || '')
  const [modalMode, setModalMode] = useState<ViewMode>('original')
  const [referral, setReferral] = useState<
    'Routine 12m' | 'Early 3-6m' | 'Laser / Anti-VEGF Specialist Referral' | 'Emergency Referral'
  >(
    caseItem?.ophthalmologistReview?.referralRecommendation ||
      (caseItem?.status === 'Referable' ? 'Laser / Anti-VEGF Specialist Referral' : 'Routine 12m')
  )
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (caseItem) {
      setSelectedLevel(caseItem.drLevelNum ?? 2)
      setNotes(caseItem.ophthalmologistReview?.clinicalNotes || '')
      setModalMode('original')
      if (caseItem.ophthalmologistReview?.referralRecommendation) {
        setReferral(caseItem.ophthalmologistReview.referralRecommendation)
      } else {
        setReferral(caseItem.status === 'Referable' ? 'Laser / Anti-VEGF Specialist Referral' : 'Routine 12m')
      }
    }
  }, [caseItem])

  if (!caseItem) return null

  const isOphthalmologist = user?.role === 'Ophthalmologist'
  const isReviewed =
    caseItem.caseStatus === 'REVIEWED' ||
    caseItem.priority === 'Reviewed' ||
    caseItem.priority === 'Finalized' ||
    caseItem.priority === 'Completed' ||
    !!caseItem.ophthalmologistReview

  const handleSave = async () => {
    if (!isOphthalmologist) return

    setSubmitting(true)
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: caseItem.id,
          finalDRLevel: Number(selectedLevel),
          clinicalNotes: notes,
          reviewerName: user?.name || 'Dr. Rajesh Sharma, MS',
          reviewerRegNo: user?.medicalCouncilRegNo || 'NMC-OPH-88421',
          hospitalAffiliation: user?.hospitalAffiliation || 'Regional Institute of Ophthalmology',
          referralRecommendation: referral,
        }),
      })
      if (onReviewSubmitted) onReviewSubmitted()
    } catch (err) {
      console.error('Case review error:', err)
    } finally {
      setSubmitting(false)
      onClose()
    }
  }

  const activeImgSrc =
    modalMode === 'gradcam' && caseItem.gradcamHeatmapSrc
      ? caseItem.gradcamHeatmapSrc
      : modalMode === 'overlay' && caseItem.gradcamOverlaySrc
      ? caseItem.gradcamOverlaySrc
      : caseItem.imageSrc || '/netrika-fundus.png'

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          aria-label="Close case detail"
        >
          <X size={18} />
        </button>

        <div>
          <div className="text-xs font-bold text-[#0da487] uppercase tracking-wider mb-1">
            Clinical Case Dossier &middot; {caseItem.id}
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Retinal Screening Summary</h3>
          <p className="text-xs text-slate-600 mt-1">
            Standardized ICDR severity staging, Grad-CAM attention regions, and certified clinical sign-off.
          </p>
        </div>

        {/* TOP IMAGE & AI OVERVIEW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* Fundus Image with Mode Switcher */}
          <div className="sm:col-span-6 space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square shadow-inner">
              <img
                src={activeImgSrc}
                alt={caseItem.id}
                className="w-full h-full object-cover select-none"
              />
            </div>
            {(caseItem.gradcamHeatmapSrc || caseItem.gradcamOverlaySrc) && (
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalMode('original')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-1 ${
                    modalMode === 'original' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye size={12} />
                  Original
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('gradcam')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-1 ${
                    modalMode === 'gradcam' ? 'bg-[#0da487] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles size={12} />
                  Grad-CAM
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('overlay')}
                  className={`py-1 text-[11px] font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-1 ${
                    modalMode === 'overlay' ? 'bg-[#0da487] text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers size={12} />
                  Overlay
                </button>
              </div>
            )}
          </div>

          {/* Key Metric Pills */}
          <div className="sm:col-span-6 space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Award size={12} className="text-slate-400" />
                AI Prediction
              </span>
              <div className="text-base font-extrabold text-slate-900">
                {caseItem.level} {caseItem.drClassName ? `· ${caseItem.drClassName}` : ''}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Gauge size={12} className="text-slate-400" />
                Softmax Confidence
              </span>
              <div className="text-base font-bold font-mono text-[#0da487]">
                {caseItem.confidence}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-slate-400" />
                Clinical Status
              </span>
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                    caseItem.status === 'Referable'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {caseItem.status === 'Referable' ? 'REFERABLE DR' : 'NON-REFERABLE'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                Review Queue Status
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {isReviewed ? (
                  <span className="text-[#0da487] flex items-center gap-1">
                    <BadgeCheck size={14} className="text-[#0da487]" />
                    <span>Reviewed &amp; Signed Off</span>
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Pending Ophthalmologist Review</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PATIENT & SCREENER METADATA */}
        {(caseItem.patient || caseItem.screener) && (
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 space-y-2">
            {caseItem.patient && (
              <div className="flex items-start gap-2">
                <User size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Patient:</strong> {caseItem.patient.name || 'Anonymous'}
                  {caseItem.patient.age ? ` (${caseItem.patient.age}y, ${caseItem.patient.gender || 'M'})` : ''}
                  {caseItem.patient.diabetesYears ? ` · DM Duration: ${caseItem.patient.diabetesYears} yrs` : ''}
                  {caseItem.patient.eye ? ` · Eye Tested: ${caseItem.patient.eye}` : ''}
                  {caseItem.patient.abhaId ? ` · ABHA: ${caseItem.patient.abhaId}` : ''}
                </div>
              </div>
            )}
            {caseItem.screener && (
              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <Stethoscope size={13} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700">Field Screener:</strong> {caseItem.screener.name}
                  {caseItem.screener.centerName ? ` (${caseItem.screener.centerName})` : ''}
                </div>
              </div>
            )}
          </div>
        )}

        {/* OPHTHALMOLOGIST EDITABLE ASSESSMENT FORM */}
        {isOphthalmologist ? (
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="text-xs font-bold text-[#0da487] uppercase tracking-wider">
              Specialist Clinical Assessment &amp; Endorsement
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Award size={12} className="text-slate-400" />
                Doctor Diagnosis (ICDR DR Level)
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value) as DRClass)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#0da487]"
              >
                <option value="0">Level 0 &middot; No Diabetic Retinopathy</option>
                <option value="1">Level 1 &middot; Mild Non-Proliferative DR</option>
                <option value="2">Level 2 &middot; Moderate Non-Proliferative DR</option>
                <option value="3">Level 3 &middot; Severe Non-Proliferative DR</option>
                <option value="4">Level 4 &middot; Proliferative Diabetic Retinopathy</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-slate-400" />
                Referral &amp; Follow-up Protocol
              </label>
              <select
                value={referral}
                onChange={(e) => setReferral(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#0da487]"
              >
                <option value="Routine 12m">Routine 12-Month Field Rescreening (No / Mild DR)</option>
                <option value="Early 3-6m">Early 3–6 Month Monitoring (Mild / Moderate DR)</option>
                <option value="Laser / Anti-VEGF Specialist Referral">Laser Photocoagulation / Anti-VEGF Specialist Referral</option>
                <option value="Emergency Referral">Emergency Vitreo-Retinal Surgical Referral</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <FileText size={12} className="text-slate-400" />
                Specialist Clinical Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document macular involvement, microaneurysm distribution, or referral instructions..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0da487]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-slate-700 space-y-0.5">
              <span className="text-slate-900 font-semibold block">Signing Specialist:</span>
              <div>{user.name} &middot; {user.medicalCouncilRegNo || 'NMC Verified'}</div>
              <div className="text-[11px] text-slate-500">{user.hospitalAffiliation || 'Regional Eye Hospital'}</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                title="Print Case Dossier"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={submitting}
                className="flex-1 py-3 rounded-full bg-[#0da487] text-white text-xs font-bold hover:bg-[#0b8a70] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0da487]/20"
              >
                {submitting ? 'Saving Review...' : 'Submit Final Review & Digital Sign-Off'}
                <Check size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* READ-ONLY VIEW FOR SCREENER / TECHNICIAN */
          <div className="space-y-4 pt-2 border-t border-slate-200">
            {caseItem.ophthalmologistReview ? (
              <div className="p-4 rounded-2xl bg-[#e6f8f3] border border-[#a7f3d0] text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#0da487] font-bold">
                  <BadgeCheck size={16} />
                  <span>Verified Specialist Review Complete</span>
                </div>
                <div className="text-slate-900 font-semibold">
                  Endorsed: Level {caseItem.ophthalmologistReview.finalDRLevel} &middot;{' '}
                  {caseItem.ophthalmologistReview.referralRecommendation || 'Routine follow-up'}
                </div>
                <p className="text-slate-600 italic">
                  &ldquo;{caseItem.ophthalmologistReview.clinicalNotes}&rdquo;
                </p>
                <div className="pt-2 border-t border-teal-200/50 text-[11px] text-slate-500">
                  Reviewed by <strong className="text-slate-900">{caseItem.ophthalmologistReview.reviewerName}</strong> (
                  {caseItem.ophthalmologistReview.reviewerRegNo || 'NMC Verified'}) &middot;{' '}
                  {caseItem.ophthalmologistReview.hospitalAffiliation || 'Eye Care Hospital'}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-slate-600">
                <ShieldCheck size={24} className="text-amber-500 shrink-0" />
                <div>
                  <strong className="text-slate-900 block">Pending Ophthalmologist Review</strong>
                  <span>This case is queued for tele-ophthalmology verification.</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-xs"
                title="Print Case Dossier"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition-all shadow-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
