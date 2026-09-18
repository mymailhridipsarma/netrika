'use client'

import React, { useRef, useEffect } from 'react'
import {
  Check,
  ShieldCheck,
  Sparkles,
  Eye,
  ArrowRight,
  Signal,
  Wifi,
  Battery,
  BatteryCharging,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  RotateCw,
  Activity,
} from 'lucide-react'

export function MobileScreeningShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const phoneLeftBoxRef = useRef<HTMLDivElement>(null)
  const phoneRightBoxRef = useRef<HTMLDivElement>(null)

  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rotYRef = useRef(0)
  const rotXRef = useRef(0)
  const velocityRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  const applyRotation = (y: number, x: number) => {
    if (phoneLeftBoxRef.current) {
      phoneLeftBoxRef.current.style.transform = `rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg)`
    }
    if (phoneRightBoxRef.current) {
      phoneRightBoxRef.current.style.transform = `rotateX(${x.toFixed(2)}deg) rotateY(${(y + 16).toFixed(2)}deg)`
    }
  }

  const stopMomentum = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }

  const startMomentum = () => {
    stopMomentum()
    const step = () => {
      if (Math.abs(velocityRef.current) > 0.05) {
        rotYRef.current += velocityRef.current
        velocityRef.current *= 0.94
        applyRotation(rotYRef.current, rotXRef.current)
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        velocityRef.current = 0
        stopMomentum()
      }
    }
    animFrameRef.current = requestAnimationFrame(step)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopMomentum()
    e.preventDefault()
    isDraggingRef.current = true
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    lastXRef.current = e.clientX
    lastTimeRef.current = performance.now()
    velocityRef.current = 0

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}

    if (stageRef.current) {
      stageRef.current.style.cursor = 'grabbing'
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    e.preventDefault()

    const currentX = e.clientX
    const currentY = e.clientY
    const now = performance.now()
    const dt = Math.max(1, now - (lastTimeRef.current || now))
    const dx = currentX - lastXRef.current

    const instantVel = (dx / dt) * 16.6
    velocityRef.current = velocityRef.current * 0.35 + instantVel * 0.65

    rotYRef.current += dx * 0.95
    rotXRef.current = Math.max(-25, Math.min(25, -((currentY - startYRef.current) * 0.2)))

    lastXRef.current = currentX
    lastTimeRef.current = now

    applyRotation(rotYRef.current, rotXRef.current)
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {}
      if (stageRef.current) {
        stageRef.current.style.cursor = 'grab'
      }
      if (Math.abs(velocityRef.current) > 0.3) {
        startMomentum()
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const rotationStep = 18

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      stopMomentum()
      rotYRef.current += e.key === 'ArrowLeft' ? -rotationStep : rotationStep
      applyRotation(rotYRef.current, rotXRef.current)
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      stopMomentum()
      rotXRef.current = Math.max(
        -25,
        Math.min(25, rotXRef.current + (e.key === 'ArrowUp' ? -rotationStep : rotationStep)),
      )
      applyRotation(rotYRef.current, rotXRef.current)
    }
  }

  useEffect(() => {
    const stageEl = stageRef.current
    if (!stageEl) return

    applyRotation(0, 0)

    const handleWindowPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        if (stageRef.current) {
          stageRef.current.style.cursor = 'grab'
        }
        if (Math.abs(velocityRef.current) > 0.3) {
          startMomentum()
        }
      }
    }

    window.addEventListener('pointerup', handleWindowPointerUp)
    window.addEventListener('pointercancel', handleWindowPointerUp)

    return () => {
      stopMomentum()
      window.removeEventListener('pointerup', handleWindowPointerUp)
      window.removeEventListener('pointercancel', handleWindowPointerUp)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="screening-app"
      className="relative py-24 bg-[#f8faf9] overflow-hidden border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT COLUMN: DESCRIPTIVE COPY & HIGHLIGHTS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f8f3] border border-[#a7f3d0] text-[#0da487] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0da487] animate-pulse" />
              <span>YOUR SCREENING, EXPLAINED</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Understand your diabetic <br />
              <span className="text-[#0da487]">
                retinopathy screening.
              </span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed max-w-lg">
              Empowering patients and vision technicians with transparent retinal intelligence. See your screening score, inspect localized lesions, and track longitudinal trends across screening visits.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0] shrink-0">
                  <Check size={14} className="stroke-[2.5]" />
                </div>
                <span>Instant AI screening confidence &amp; severity level</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0] shrink-0">
                  <Check size={14} className="stroke-[2.5]" />
                </div>
                <span>Retinal region heatmaps &amp; explainable clinical findings</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e6f8f3] text-[#0da487] border border-[#a7f3d0] shrink-0">
                  <Check size={14} className="stroke-[2.5]" />
                </div>
                <span>Historical progression tracking over longitudinal visits</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-3">
              <ShieldCheck size={15} className="text-[#0da487]" />
              <span>Demonstrative mobile patient companion &middot; Demo clinical data</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-xs">
              <RotateCw size={13} className="text-[#0da487]" />
              <span>360&deg; Interactive iPhone 16 Pro Model &middot; Drag or swipe on phones to spin</span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D DUAL-IPHONE STAGE */}
          <div className="lg:col-span-6 flex items-center justify-center min-h-[560px]">
            <div
              ref={stageRef}
              className="phones-3d-stage select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onLostPointerCapture={onPointerUp}
              onKeyDown={onKeyDown}
              onDragStart={(e) => e.preventDefault()}
              role="application"
              tabIndex={0}
              aria-label="Interactive 3D mobile screening preview. Use arrow keys to rotate."
              style={{ touchAction: 'none', cursor: 'grab' }}
            >
              <div className="phone-glow-bg" />

              {/* PHONE 1: RETINOPATHY SCORE CARD (IPHONE 16 PRO) */}
              <div className="phone-wrapper phone-left">
                <div ref={phoneLeftBoxRef} className="phone-3d-box">
                  <div className="phone-core phone-core-1" />
                  <div className="phone-core phone-core-2" />
                  <div className="phone-core phone-core-3" />

                  {/* FRONT FACE */}
                  <div className="phone-face phone-front">
                    <div className="phone-reflection" />
                    <div className="phone-screen">
                      {/* Dynamic Island */}
                      <div className="dynamic-island">
                        <div className="dynamic-island-cam" />
                        <div className="flex items-center gap-1">
                          <span className="dynamic-island-indicator" />
                          <span className="text-[7px] font-bold text-emerald-400 tracking-wider">LIVE</span>
                        </div>
                        <div className="dynamic-island-sensor" />
                      </div>

                      {/* iOS Status Bar */}
                      <div className="phone-status-bar">
                        <span className="status-time">9:41</span>
                        <div className="status-icons">
                          <Signal size={10} className="stroke-[2.5]" />
                          <span className="text-[8.5px] font-black tracking-tighter">5G</span>
                          <Wifi size={10} className="stroke-[2.5]" />
                          <div className="ios-battery">
                            <div className="ios-battery-fill" />
                          </div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="phone-app-head">
                        <div className="phone-brand">
                          <Eye size={14} className="text-[#0da487]" /> Netrika Health
                        </div>
                        <span className="phone-demo-tag">LIVE DEMO</span>
                      </div>

                      {/* Retinopathy Score Card */}
                      <div className="phone-card">
                        <div className="phone-card-title flex items-center justify-between">
                          <span>Retinopathy Score</span>
                          <Award size={11} className="text-[#0da487]" />
                        </div>
                        <div className="phone-score-val">
                          94.2% <span>Confidence</span>
                        </div>
                        <div className="phone-badge-row">
                          <span className="phone-badge">Level 2 Mild DR</span>
                          <span className="phone-badge">Low Risk</span>
                        </div>
                      </div>

                      {/* Retinal Scan Visual Preview */}
                      <div className="phone-card" style={{ padding: '8px 10px' }}>
                        <div className="phone-card-title">Retinal Scan Visual</div>
                        <div className="phone-mini-visual">
                          <img
                            src="/live-analysis-fundus.jpg"
                            alt="Retinal fundus scan preview"
                            draggable={false}
                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                          />
                          <div className="scan-pulse" />
                        </div>
                        <div style={{ fontSize: '9px', color: '#64748b', lineHeight: 1.2 }}>
                          3 microaneurysms detected in peripheral quadrant
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="phone-btn" style={{ userSelect: 'none', cursor: 'pointer' }}>
                        <FileText size={12} />
                        <span>View Clinical Report</span>
                        <ArrowRight size={12} />
                      </div>

                      {/* iOS Home Indicator */}
                      <div className="phone-home-indicator" />
                    </div>
                  </div>

                  {/* BACK FACE (IPHONE 16 PRO CAMERA ARRAY) */}
                  <div className="phone-face phone-back">
                    <div className="phone-back-glass-texture" />
                    <div className="phone-camera-island">
                      <div className="camera-island-plate">
                        {/* Main 48MP Fusion Lens */}
                        <div className="lens-mount lens-main">
                          <div className="lens-glass">
                            <div className="lens-iris" />
                            <div className="lens-glint" />
                            <div className="lens-secondary-glint" />
                          </div>
                        </div>
                        {/* Ultra-Wide Lens */}
                        <div className="lens-mount lens-ultra">
                          <div className="lens-glass">
                            <div className="lens-iris" />
                            <div className="lens-glint" />
                            <div className="lens-secondary-glint" />
                          </div>
                        </div>
                        {/* 5x Telephoto Tetraprism Lens */}
                        <div className="lens-mount lens-tele">
                          <div className="lens-glass">
                            <div className="lens-iris" />
                            <div className="lens-glint" />
                            <div className="lens-secondary-glint" />
                          </div>
                        </div>
                        {/* True Tone Flash */}
                        <div className="flash-module">
                          <span className="flash-core" />
                        </div>
                        {/* LiDAR Sensor */}
                        <div className="lidar-sensor" />
                        {/* Rear Mic */}
                        <div className="rear-mic-hole" />
                        <div className="camera-spec-label">48MP FUSION &middot; 5X TELE</div>
                      </div>
                    </div>

                    <div className="phone-back-branding">
                      <div className="back-apple-emblem">
                        <svg className="w-8 h-8 text-slate-500 fill-current" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.71-11.66-14-5.35-8.37-9.58-17.75-12.69-28.16-3.12-10.41-4.68-20.5-4.68-30.28 0-13.41 3.23-24.63 9.68-33.68 6.45-9.05 14.85-13.67 25.2-13.87 4.58 0 9.87 1.25 15.87 3.75 6 2.5 10.02 3.8 12.06 3.9 1.7 0 5.8-1.35 12.31-4.05 6.51-2.7 11.96-3.9 16.35-3.6 12.19.63 21.94 5.3 29.25 14-10.74 6.53-16 15.44-15.78 26.74.22 8.85 3.65 16.2 10.3 22.05 6.65 5.85 14.53 9.1 23.64 9.75-2.24 6.74-4.87 13.3-7.89 19.68zM119.22 31.85c0-7.39 2.65-14.34 7.95-20.85 5.3-6.51 11.75-10.51 19.35-12 1.05 5.48.58 11.23-1.4 17.25-1.98 6.02-5.37 11.38-10.17 16.08-4.58 4.48-9.44 7.23-14.58 8.25-.23-1.58-.58-3.08-1.05-4.5-0.07-1.42-.1-2.83-.1-4.23z" />
                        </svg>
                      </div>
                      <span className="back-brand-name">NETRIKA</span>
                      <span className="back-brand-tag">CLINICAL RETINAL AI</span>
                    </div>

                    <div className="phone-back-regulatory">
                      <span className="iphone-title">iPhone 16 Pro</span>
                      <span>Designed by Netrika in California &middot; Assembled in USA</span>
                    </div>
                  </div>

                  {/* SIDES */}
                  <div className="phone-face phone-edge-left">
                    <div className="antenna-line ant-top" />
                    <div className="side-btn button-action" />
                    <div className="side-btn button-vol-up" />
                    <div className="side-btn button-vol-down" />
                    <div className="antenna-line ant-bottom" />
                  </div>
                  <div className="phone-face phone-edge-right">
                    <div className="antenna-line ant-top" />
                    <div className="side-btn button-power" />
                    <div className="side-btn button-camera-control" />
                    <div className="antenna-line ant-bottom" />
                  </div>
                  <div className="phone-face phone-edge-top">
                    <div className="antenna-line ant-left" />
                    <div className="top-mic-hole" />
                    <div className="antenna-line ant-right" />
                  </div>
                  <div className="phone-face phone-edge-bottom">
                    <div className="antenna-line ant-left" />
                    <div className="speaker-cluster left">
                      <span /><span /><span />
                    </div>
                    <div className="usbc-port">
                      <span className="usbc-tongue" />
                    </div>
                    <div className="speaker-cluster right">
                      <span /><span /><span /><span /><span />
                    </div>
                    <div className="antenna-line ant-right" />
                  </div>
                </div>
              </div>

              {/* PHONE 2: RISK ANALYTICS & TREND (IPHONE 16 PRO) */}
              <div className="phone-wrapper phone-right">
                <div ref={phoneRightBoxRef} className="phone-3d-box">
                  <div className="phone-core phone-core-1" />
                  <div className="phone-core phone-core-2" />
                  <div className="phone-core phone-core-3" />

                  {/* FRONT FACE */}
                  <div className="phone-face phone-front">
                    <div className="phone-reflection" />
                    <div className="phone-screen">
                      {/* Dynamic Island */}
                      <div className="dynamic-island">
                        <div className="dynamic-island-cam" />
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                          <span className="text-[7px] font-bold text-teal-300 tracking-wider">SYNC</span>
                        </div>
                        <div className="dynamic-island-sensor" />
                      </div>

                      {/* iOS Status Bar */}
                      <div className="phone-status-bar">
                        <span className="status-time">9:41</span>
                        <div className="status-icons">
                          <Signal size={10} className="stroke-[2.5]" />
                          <span className="text-[8.5px] font-black tracking-tighter">5G</span>
                          <Wifi size={10} className="stroke-[2.5]" />
                          <div className="ios-battery">
                            <div className="ios-battery-fill" />
                          </div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="phone-app-head">
                        <div className="phone-brand">
                          <TrendingUp size={13} className="text-[#0da487]" /> Risk Analytics
                        </div>
                        <span className="phone-demo-tag">STABLE</span>
                      </div>

                      {/* Trend Card */}
                      <div className="phone-card">
                        <div className="phone-card-title flex items-center justify-between">
                          <span>Screening Progression</span>
                          <Activity size={11} className="text-[#0da487]" />
                        </div>
                        <div className="trend-chart-container">
                          <svg className="trend-svg" viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path d="M 10 52 Q 50 48, 90 30 T 170 22 T 190 18 L 190 70 L 10 70 Z" fill="url(#chartGrad)" />
                            <path d="M 10 52 Q 50 48, 90 30 T 170 22 T 190 18" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="10" cy="52" r="3" fill="#0d9488" />
                            <circle cx="90" cy="30" r="3" fill="#0d9488" />
                            <circle cx="170" cy="22" r="3" fill="#0d9488" />
                            <circle cx="190" cy="18" r="4.5" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
                          </svg>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', color: '#64748b', fontWeight: 600 }}>
                          <span>JUN</span>
                          <span>JUL</span>
                          <span>AUG</span>
                          <span>SEP</span>
                        </div>
                      </div>

                      {/* Records Card */}
                      <div className="phone-card" style={{ marginBottom: 0 }}>
                        <div className="phone-card-title">Recent Records</div>
                        <div className="history-item">
                          <div className="flex items-center gap-1.5">
                            <Clock size={10} className="text-teal-600 shrink-0" />
                            <div>
                              <strong>Sep 10, 2026</strong>
                              <div className="history-item-date">Level 2 (94.2%)</div>
                            </div>
                          </div>
                          <span className="phone-badge" style={{ fontSize: '8px' }}>Stable</span>
                        </div>
                        <div className="history-item">
                          <div className="flex items-center gap-1.5">
                            <Clock size={10} className="text-teal-600 shrink-0" />
                            <div>
                              <strong>Aug 14, 2026</strong>
                              <div className="history-item-date">Level 2 (93.8%)</div>
                            </div>
                          </div>
                          <span className="phone-badge" style={{ fontSize: '8px' }}>Stable</span>
                        </div>
                        <div className="history-item" style={{ marginBottom: 0 }}>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                            <div>
                              <strong>Jun 02, 2026</strong>
                              <div className="history-item-date">Level 1 (96.1%)</div>
                            </div>
                          </div>
                          <span className="phone-badge badge-amber" style={{ fontSize: '8px' }}>Clear</span>
                        </div>
                      </div>

                      {/* iOS Home Indicator */}
                      <div className="phone-home-indicator" />
                    </div>
                  </div>

                  {/* BACK FACE (IPHONE 16 PRO CAMERA ARRAY) */}
                  <div className="phone-face phone-back">
                    <div className="phone-back-glass-texture" />
                    <div className="phone-camera-island">
                      <div className="camera-island-plate">
                        {/* Main 48MP Fusion Lens */}
                        <div className="lens-mount lens-main">
                          <div className="lens-glass">
                            <div className="lens-iris" />
                            <div className="lens-glint" />
                            <div className="lens-secondary-glint" />
                          </div>
                        </div>
                        {/* Ultra-Wide Lens */}
                        <div className="lens-mount lens-ultra">
                          <div className="lens-glass">
                            <div className="lens-iris" />
                            <div className="lens-glint" />
                            <div className="lens-secondary-glint" />
                          </div>
                        </div>
                        {/* 5x Telephoto Tetraprism Lens */}
                        <div className="lens-mount lens-tele">
                          <div className="lens-glass">
                            <div className="lens-iris" />
                            <div className="lens-glint" />
                            <div className="lens-secondary-glint" />
                          </div>
                        </div>
                        {/* True Tone Flash */}
                        <div className="flash-module">
                          <span className="flash-core" />
                        </div>
                        {/* LiDAR Sensor */}
                        <div className="lidar-sensor" />
                        {/* Rear Mic */}
                        <div className="rear-mic-hole" />
                        <div className="camera-spec-label">48MP FUSION &middot; 5X TELE</div>
                      </div>
                    </div>

                    <div className="phone-back-branding">
                      <div className="back-apple-emblem">
                        <svg className="w-8 h-8 text-slate-500 fill-current" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.71-11.66-14-5.35-8.37-9.58-17.75-12.69-28.16-3.12-10.41-4.68-20.5-4.68-30.28 0-13.41 3.23-24.63 9.68-33.68 6.45-9.05 14.85-13.67 25.2-13.87 4.58 0 9.87 1.25 15.87 3.75 6 2.5 10.02 3.8 12.06 3.9 1.7 0 5.8-1.35 12.31-4.05 6.51-2.7 11.96-3.9 16.35-3.6 12.19.63 21.94 5.3 29.25 14-10.74 6.53-16 15.44-15.78 26.74.22 8.85 3.65 16.2 10.3 22.05 6.65 5.85 14.53 9.1 23.64 9.75-2.24 6.74-4.87 13.3-7.89 19.68zM119.22 31.85c0-7.39 2.65-14.34 7.95-20.85 5.3-6.51 11.75-10.51 19.35-12 1.05 5.48.58 11.23-1.4 17.25-1.98 6.02-5.37 11.38-10.17 16.08-4.58 4.48-9.44 7.23-14.58 8.25-.23-1.58-.58-3.08-1.05-4.5-0.07-1.42-.1-2.83-.1-4.23z" />
                        </svg>
                      </div>
                      <span className="back-brand-name">NETRIKA</span>
                      <span className="back-brand-tag">CLINICAL RETINAL AI</span>
                    </div>

                    <div className="phone-back-regulatory">
                      <span className="iphone-title">iPhone 16 Pro</span>
                      <span>Designed by Netrika in California &middot; Assembled in USA</span>
                    </div>
                  </div>

                  {/* SIDES */}
                  <div className="phone-face phone-edge-left">
                    <div className="antenna-line ant-top" />
                    <div className="side-btn button-action" />
                    <div className="side-btn button-vol-up" />
                    <div className="side-btn button-vol-down" />
                    <div className="antenna-line ant-bottom" />
                  </div>
                  <div className="phone-face phone-edge-right">
                    <div className="antenna-line ant-top" />
                    <div className="side-btn button-power" />
                    <div className="side-btn button-camera-control" />
                    <div className="antenna-line ant-bottom" />
                  </div>
                  <div className="phone-face phone-edge-top">
                    <div className="antenna-line ant-left" />
                    <div className="top-mic-hole" />
                    <div className="antenna-line ant-right" />
                  </div>
                  <div className="phone-face phone-edge-bottom">
                    <div className="antenna-line ant-left" />
                    <div className="speaker-cluster left">
                      <span /><span /><span />
                    </div>
                    <div className="usbc-port">
                      <span className="usbc-tongue" />
                    </div>
                    <div className="speaker-cluster right">
                      <span /><span /><span /><span /><span />
                    </div>
                    <div className="antenna-line ant-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
