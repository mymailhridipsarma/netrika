'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  FileCheck2,
  FileImage,
  Hospital,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Phone,
  Play,
  RotateCw,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stethoscope,
  UploadCloud,
  User,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react'

import type { ScreeningResult, CaseRecord, DRClass, PatientMetadata, ScreenerMetadata } from '@/lib/ai/types'
import type { UserProfile, UserRole } from '@/lib/db/userStore'

type ScanState = 'ready' | 'analyzing' | 'complete'
type ViewMode = 'original' | 'gradcam' | 'overlay'

const evidence = [
  { name: 'Possible microaneurysms', confidence: '92%', tone: 'teal' },
  { name: 'Possible hemorrhagic regions', confidence: '86%', tone: 'violet' },
  { name: 'Possible exudative regions', confidence: '78%', tone: 'amber' },
  { name: 'Other retinal abnormalities', confidence: '64%', tone: 'coral' },
]

function RetinaVisual({
  mode = 'original',
  compact = false,
  src = '/netrika-fundus.png',
  heatmapSrc,
  overlaySrc,
}: {
  mode?: ViewMode;
  compact?: boolean;
  src?: string;
  heatmapSrc?: string;
  overlaySrc?: string;
}) {
  const activeSrc =
    mode === 'gradcam' && heatmapSrc
      ? heatmapSrc
      : mode === 'overlay' && overlaySrc
      ? overlaySrc
      : src;

  return (
    <div className={`fundus ${mode} ${compact ? 'compact' : ''}`} role="img" aria-label={`${mode} retinal image visualization`}>
      <img src={activeSrc} alt="Retinal fundus image" />
      <div className="fundus-vignette" />
      {mode !== 'original' && !heatmapSrc && <div className="heatmap" />}
      {mode === 'overlay' && !overlaySrc && <div className="overlay-tint" />}
      <div className="fundus-ring" />
      <div className="scan-line" />
      <span className="feature-point point-one" />
      <span className="feature-point point-two" />
      <span className="feature-point point-three" />
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
    </div>
  )
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Netrika home">
      <img
        src="/logo-netrika.png"
        alt="Netrika Logo"
        className="logo-img"
        width={36}
        height={36}
      />
      <span>Netrika</span>
    </a>
  )
}

function Navbar({
  onSignInClick,
  user,
}: {
  onSignInClick?: () => void
  user?: UserProfile | null
}) {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <Logo />
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <a href="#screening" onClick={() => setOpen(false)}>Screening</a>
        <a href="#cases" onClick={() => setOpen(false)}>Cases</a>
        <a href="#reports" onClick={() => setOpen(false)}>Reports</a>
        <a href="#technology" onClick={() => setOpen(false)}>Technology</a>
      </nav>
      <div className="nav-actions">
        <button
          type="button"
          className="nav-login"
          onClick={() => {
            setOpen(false)
            if (onSignInClick) onSignInClick()
          }}
          title={user ? 'Click to view clinician profile or sign out' : 'Click to sign in or register'}
        >
          {user ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-dot" />
              <strong style={{ color: '#ffffff', fontWeight: 600 }}>
                {user.role === 'Ophthalmologist' ? user.name : user.name.split(' ')[0]}
              </strong>
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  background: user.role === 'Ophthalmologist' ? 'rgba(139, 124, 255, 0.18)' : 'rgba(56, 217, 197, 0.15)',
                  color: user.role === 'Ophthalmologist' ? 'var(--violet)' : 'var(--teal)',
                  border: user.role === 'Ophthalmologist' ? '1px solid rgba(139, 124, 255, 0.3)' : '1px solid rgba(56, 217, 197, 0.3)',
                  fontWeight: 600,
                }}
              >
                {user.role}
              </span>
            </span>
          ) : (
            'Sign in / Register'
          )}
        </button>
        <a className="button button-teal small" href="#screening" onClick={() => setOpen(false)}>
          Start Screening <ArrowRight size={15} />
        </a>
      </div>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}

function Hero({
  onSignInClick,
  user,
}: {
  onSignInClick?: () => void
  user?: UserProfile | null
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const fundusRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLAnchorElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    if (videoRef.current) {
      videoRef.current.defaultMuted = true
      videoRef.current.muted = true
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Autoplay deferred or prevented by browser:', err)
        })
      }
    }

    let ticking = false
    let animationFrameId: number

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          if (heroRef.current) {
            const sy = window.scrollY
            const heroHeight = heroRef.current.clientHeight || window.innerHeight

            if (fundusRef.current && sy <= heroHeight * 1.2) {
              const fadeRatio = Math.min(1, Math.max(0, sy / (heroHeight * 0.85)))
              const targetOpacity = 1 - fadeRatio * 0.55
              fundusRef.current.style.opacity = `${targetOpacity}`
            }

            if (scrollIndicatorRef.current) {
              const indicatorOpacity = Math.max(0, 1 - sy / 300)
              scrollIndicatorRef.current.style.opacity = `${indicatorOpacity}`
              scrollIndicatorRef.current.style.pointerEvents = indicatorOpacity <= 0 ? 'none' : 'auto'
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section ref={heroRef} className="hero-dark" id="top">
      <div
        ref={fundusRef}
        className={`hero-fundus ${loaded ? 'hero-loaded' : ''}`}
      >
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="/netrika-fundus.png"
          preload="auto"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <img src="/netrika-fundus.png" alt="Detailed retinal fundus visual fallback" />
        </video>
        <div className="hero-cinematic-grade" />
        <div className="hero-vignette" />
        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="hero-scan" />
        <span className="hero-point hp-one" />
        <span className="hero-point hp-two" />
        <span className="hero-point hp-three" />
      </div>
      <Navbar onSignInClick={onSignInClick} user={user} />
      <div className={`hero-content wrap ${loaded ? 'content-loaded' : ''}`}>
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" /> Explainable AI · Diabetic Retinopathy Screening
          </div>
          <h1>
            See what<br />
            <em>the AI sees.</em>
          </h1>
          <p>
            Screen diabetic retinopathy from retinal images and understand the regions influencing every AI prediction.
          </p>
          <div className="hero-buttons">
            <a className="button button-teal" href="#screening">
              Start Screening <ArrowRight size={17} />
            </a>
            <a className="button button-ghost" href="#technology">
              <span className="play-circle">
                <Play size={11} fill="currentColor" />
              </span>{' '}
              Explore how it works
            </a>
          </div>
          <div className="hero-note">
            <ShieldCheck size={15} /> Decision support, always reviewed by a qualified professional.
          </div>
        </div>
        <div className="analysis-card">
          <div className="analysis-head">
            <span>
              <span className="live-dot" /> NETRIKA AI
            </span>
            <span className="analysis-time">LIVE ANALYSIS</span>
          </div>
          <RetinaVisual compact src="/live-analysis-fundus.jpg" />
          <div className="analysis-grid">
            <div>
              <span>Image status</span>
              <strong className="success">Gradable</strong>
            </div>
            <div>
              <span>DR severity</span>
              <strong>Level 2</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>94.2%</strong>
            </div>
            <div>
              <span>Key findings</span>
              <strong>3 regions</strong>
            </div>
          </div>
          <div className="analysis-foot">
            <Check size={14} /> Analysis complete <span>08:42</span>
          </div>
        </div>
      </div>
      <a
        ref={scrollIndicatorRef}
        href="#technology"
        className="hero-scroll"
        aria-label="Scroll to explore"
      >
        <span>Scroll to explore</span>
        <div className="scroll-arrow">
          <ChevronDown size={14} />
        </div>
      </a>
    </section>
  )
}

function MobileScreeningShowcase() {
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
        velocityRef.current *= 0.94 // smooth friction decay
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

    // Normalize swipe velocity
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

  useEffect(() => {
    const stageEl = stageRef.current
    if (!stageEl) return

    // Set initial stationary 3D orientation (0 deg - NO auto rotation)
    applyRotation(0, 0)

    // Direct passive:false touch listeners to prevent touch-scrolling cancellation on first swipe
    const handleNativeTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        stopMomentum()
        isDraggingRef.current = true
        const t = e.touches[0]
        startXRef.current = t.clientX
        startYRef.current = t.clientY
        lastXRef.current = t.clientX
        lastTimeRef.current = performance.now()
        velocityRef.current = 0
      }
    }

    const handleNativeTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return
      if (e.cancelable) {
        e.preventDefault()
      }
      const t = e.touches[0]
      const currentX = t.clientX
      const currentY = t.clientY
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

    const handleNativeTouchEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        if (Math.abs(velocityRef.current) > 0.3) {
          startMomentum()
        }
      }
    }

    stageEl.addEventListener('touchstart', handleNativeTouchStart, { passive: false })
    stageEl.addEventListener('touchmove', handleNativeTouchMove, { passive: false })
    stageEl.addEventListener('touchend', handleNativeTouchEnd, { passive: true })
    stageEl.addEventListener('touchcancel', handleNativeTouchEnd, { passive: true })

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
      stageEl.removeEventListener('touchstart', handleNativeTouchStart)
      stageEl.removeEventListener('touchmove', handleNativeTouchMove)
      stageEl.removeEventListener('touchend', handleNativeTouchEnd)
      stageEl.removeEventListener('touchcancel', handleNativeTouchEnd)
      window.removeEventListener('pointerup', handleWindowPointerUp)
      window.removeEventListener('pointercancel', handleWindowPointerUp)
    }
  }, [])

  return (
    <section ref={sectionRef} className="mobile-showcase" id="screening-app">
      <div className="wrap mobile-showcase-grid">
        <div className="showcase-copy">
          <div className="eyebrow">
            <span className="live-dot" /> YOUR SCREENING, EXPLAINED
          </div>
          <h2>
            Understand your diabetic<br />
            <em>retinopathy screening.</em>
          </h2>
          <p>
            See your screening score, understand your risk, and follow your results over time — all in one simple view.
          </p>
          <div className="showcase-features">
            <div className="showcase-feature-item">
              <div className="showcase-feature-icon">
                <Check size={14} />
              </div>
              <span>Instant AI screening confidence & severity level</span>
            </div>
            <div className="showcase-feature-item">
              <div className="showcase-feature-icon">
                <Check size={14} />
              </div>
              <span>Retinal region heatmaps & explainable findings</span>
            </div>
            <div className="showcase-feature-item">
              <div className="showcase-feature-icon">
                <Check size={14} />
              </div>
              <span>Historical trend tracking over multiple screening visits</span>
            </div>
          </div>
          <div className="showcase-badge-note">
            <ShieldCheck size={14} style={{ color: 'var(--teal)' }} /> Demonstrative clinical mobile app interface · Demo data
          </div>

          <div className="interactive-3d-hint">
            <Sparkles size={14} /> 360° Real-time 3D Smartphone View · Drag or touch to spin
          </div>
        </div>

        <div
          ref={stageRef}
          className="phones-3d-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onLostPointerCapture={onPointerUp}
          onDragStart={(e) => e.preventDefault()}
          style={{ touchAction: 'none' }}
        >
          <div className="phone-glow-bg" />

          {/* PHONE 1 — DIABETIC RETINOPATHY SCORE */}
          <div className="phone-wrapper phone-left">
            <div ref={phoneLeftBoxRef} className="phone-3d-box">
              {/* SOLID INTERNAL CHASSIS CORES (100% GAPLESS 3D VOLUME) */}
              <div className="phone-core phone-core-1" />
              <div className="phone-core phone-core-2" />
              <div className="phone-core phone-core-3" />

              {/* FRONT FACE (Screen & Frame) */}
              <div className="phone-face phone-front">
                <div className="phone-reflection" />
                <div className="phone-screen">
                  <div className="phone-header-notch">
                    <span className="camera-lens" />
                  </div>
                  <div className="phone-status-bar">
                    <span>09:42</span>
                    <span>94%</span>
                  </div>

                  <div className="phone-app-head">
                    <div className="phone-brand">
                      <Eye size={15} /> Netrika Health
                    </div>
                    <span className="phone-demo-tag">LIVE DEMO</span>
                  </div>

                  <div className="phone-card">
                    <div className="phone-card-title">Retinopathy Score</div>
                    <div className="phone-score-val">
                      94.2% <span>Confidence</span>
                    </div>
                    <div className="phone-badge-row">
                      <span className="phone-badge">Level 2 Mild DR</span>
                      <span className="phone-badge">Low Risk</span>
                    </div>
                  </div>

                  <div className="phone-card" style={{ padding: '10px 12px' }}>
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
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      3 microaneurysms detected in peripheral quadrant
                    </div>
                  </div>

                  <div className="phone-btn" style={{ userSelect: 'none', cursor: 'pointer' }}>
                    View Clinical Report <ArrowRight size={13} />
                  </div>
                </div>
              </div>

              {/* BACK FACE (Solid Midnight Titanium & 3D Pro Camera Visor) */}
              <div className="phone-face phone-back">
                <div className="phone-back-glass-texture" />
                
                {/* ATTACHED 3D PRO CAMERA ISLAND */}
                <div className="phone-camera-island">
                  <div className="camera-island-plate">
                    <div className="lens-mount lens-main">
                      <div className="lens-rim" />
                      <div className="lens-glass">
                        <div className="lens-glint" />
                        <div className="lens-iris" />
                      </div>
                    </div>
                    
                    <div className="lens-mount lens-ultra">
                      <div className="lens-rim" />
                      <div className="lens-glass">
                        <div className="lens-glint" />
                        <div className="lens-iris" />
                      </div>
                    </div>
                    
                    <div className="lens-mount lens-tele">
                      <div className="lens-rim" />
                      <div className="lens-glass">
                        <div className="lens-glint" />
                        <div className="lens-iris" />
                      </div>
                    </div>
                    
                    <div className="sensor-dock">
                      <div className="flash-module">
                        <span className="flash-ring" />
                        <span className="flash-core" />
                      </div>
                      <div className="lidar-sensor" title="LiDAR Ophthalmic Depth Sensor">
                        <span className="lidar-core" />
                      </div>
                      <div className="mic-port" />
                    </div>

                    <div className="camera-spec-label">
                      50MP OIS · F/1.6 · OPHTHALMIC
                    </div>
                  </div>
                </div>

                {/* METALLIC LASER-ETCHED NETRIKA EMBLEM */}
                <div className="phone-back-branding">
                  <div className="back-brand-mark">
                    <Eye size={26} />
                  </div>
                  <span className="back-brand-name">NETRIKA</span>
                  <span className="back-brand-tag">EXPLAINABLE AI VISION</span>
                </div>

                {/* CE / REGULATORY MEDICAL MARKING */}
                <div className="phone-back-regulatory">
                  <span>MODEL N-1 PRO · TELE-MEDICINE</span>
                  <span>DESIGNED FOR RURAL OPHTHALMOLOGY</span>
                </div>
              </div>

              {/* METALLIC TITANIUM EDGES */}
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
                <div className="sim-tray">
                  <span className="sim-hole" />
                </div>
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
                  <span /><span /><span /><span />
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

          {/* PHONE 2 — HEALTH / ANALYTICS TRENDS */}
          <div className="phone-wrapper phone-right">
            <div ref={phoneRightBoxRef} className="phone-3d-box">
              {/* SOLID INTERNAL CHASSIS CORES (100% GAPLESS 3D VOLUME) */}
              <div className="phone-core phone-core-1" />
              <div className="phone-core phone-core-2" />
              <div className="phone-core phone-core-3" />

              {/* FRONT FACE (Screen & Frame) */}
              <div className="phone-face phone-front">
                <div className="phone-reflection" />
                <div className="phone-screen">
                  <div className="phone-header-notch">
                    <span className="camera-lens" />
                  </div>
                  <div className="phone-status-bar">
                    <span>09:42</span>
                    <span>100%</span>
                  </div>

                  <div className="phone-app-head">
                    <div className="phone-brand">
                      <Sparkles size={15} /> Risk Analytics
                    </div>
                    <span className="phone-demo-tag">STABLE</span>
                  </div>

                  <div className="phone-card">
                    <div className="phone-card-title">Screening Progression</div>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', fontWeight: 600 }}>
                      <span>JUN</span>
                      <span>JUL</span>
                      <span>AUG</span>
                      <span>SEP</span>
                    </div>
                  </div>

                  <div className="phone-card" style={{ marginBottom: 0 }}>
                    <div className="phone-card-title">Recent Records</div>
                    <div className="history-item">
                      <div>
                        <strong>Sep 10, 2026</strong>
                        <div className="history-item-date">Level 2 (94.2%)</div>
                      </div>
                      <span className="phone-badge" style={{ fontSize: '8.5px' }}>Stable</span>
                    </div>
                    <div className="history-item">
                      <div>
                        <strong>Aug 14, 2026</strong>
                        <div className="history-item-date">Level 2 (93.8%)</div>
                      </div>
                      <span className="phone-badge" style={{ fontSize: '8.5px' }}>Stable</span>
                    </div>
                    <div className="history-item" style={{ marginBottom: 0 }}>
                      <div>
                        <strong>Jun 02, 2026</strong>
                        <div className="history-item-date">Level 1 (96.1%)</div>
                      </div>
                      <span className="phone-badge badge-amber" style={{ fontSize: '8.5px' }}>Clear</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK FACE (Solid Midnight Titanium & 3D Pro Camera Visor) */}
              <div className="phone-face phone-back">
                <div className="phone-back-glass-texture" />
                
                {/* ATTACHED 3D PRO CAMERA ISLAND */}
                <div className="phone-camera-island">
                  <div className="camera-island-plate">
                    <div className="lens-mount lens-main">
                      <div className="lens-rim" />
                      <div className="lens-glass">
                        <div className="lens-glint" />
                        <div className="lens-iris" />
                      </div>
                    </div>
                    
                    <div className="lens-mount lens-ultra">
                      <div className="lens-rim" />
                      <div className="lens-glass">
                        <div className="lens-glint" />
                        <div className="lens-iris" />
                      </div>
                    </div>
                    
                    <div className="lens-mount lens-tele">
                      <div className="lens-rim" />
                      <div className="lens-glass">
                        <div className="lens-glint" />
                        <div className="lens-iris" />
                      </div>
                    </div>
                    
                    <div className="sensor-dock">
                      <div className="flash-module">
                        <span className="flash-ring" />
                        <span className="flash-core" />
                      </div>
                      <div className="lidar-sensor" title="LiDAR Ophthalmic Depth Sensor">
                        <span className="lidar-core" />
                      </div>
                      <div className="mic-port" />
                    </div>

                    <div className="camera-spec-label">
                      50MP OIS · F/1.6 · OPHTHALMIC
                    </div>
                  </div>
                </div>

                {/* METALLIC LASER-ETCHED NETRIKA EMBLEM */}
                <div className="phone-back-branding">
                  <div className="back-brand-mark">
                    <Eye size={26} />
                  </div>
                  <span className="back-brand-name">NETRIKA</span>
                  <span className="back-brand-tag">EXPLAINABLE AI VISION</span>
                </div>

                {/* CE / REGULATORY MEDICAL MARKING */}
                <div className="phone-back-regulatory">
                  <span>MODEL N-1 PRO · TELE-MEDICINE</span>
                  <span>DESIGNED FOR RURAL OPHTHALMOLOGY</span>
                </div>
              </div>

              {/* METALLIC TITANIUM EDGES */}
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
                <div className="sim-tray">
                  <span className="sim-hole" />
                </div>
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
                  <span /><span /><span /><span />
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
    </section>
  )
}

function Workflow() {
  const steps = [
    { no: '01', title: 'Capture', copy: 'Upload or capture a retinal image from any compatible fundus camera.' },
    { no: '02', title: 'Assess', copy: 'Image quality is checked before any AI prediction is generated.' },
    { no: '03', title: 'Explain', copy: 'See the retinal regions that contributed to the model prediction.' },
    { no: '04', title: 'Review', copy: 'An ophthalmologist reviews the result and makes the final assessment.' },
  ]

  return (
    <section className="workflow wrap" id="technology">
      <div className="section-label">A clear path forward</div>
      <h2>
        From retinal image<br />
        <em>to informed review.</em>
      </h2>
      <div className="workflow-line" />
      <div className="steps">
        {steps.map((step, i) => (
          <article className={`workflow-step step-${i}`} key={step.no}>
            <span className="step-no">{step.no}</span>
            <div className="step-icon">
              {i === 0 ? <UploadCloud /> : i === 1 ? <Activity /> : i === 2 ? <Sparkles /> : <Stethoscope />}
            </div>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function ScreeningWorkspace({
  onCaseCreated,
  refreshKey,
  user,
}: {
  onCaseCreated?: () => void
  refreshKey?: number
  user?: UserProfile | null
}) {
  const [scanState, setScanState] = useState<ScanState>('ready')
  const [mode, setMode] = useState<ViewMode>('original')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [result, setResult] = useState<ScreeningResult | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string>('/samples/sample-3-severe-dr.jpg')
  const [metaText, setMetaText] = useState<string>('OD · 45° · 2048 × 2048 px')
  const [sampleIdx, setSampleIdx] = useState<number>(0)
  const [reviewLevel, setReviewLevel] = useState<DRClass>(2)
  const [reviewNotes, setReviewNotes] = useState<string>('')
  const [referralRecommendation, setReferralRecommendation] = useState<
    'Routine 12m' | 'Early 3-6m' | 'Laser / Anti-VEGF Specialist Referral' | 'Emergency Referral'
  >('Laser / Anti-VEGF Specialist Referral')
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false)
  const [submittedForReview, setSubmittedForReview] = useState<boolean>(false)

  // Pending queue for ophthalmologist review
  const [pendingCases, setPendingCases] = useState<CaseRecord[]>([])
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null)

  // Patient Intake & Field Demographics
  const [patientName, setPatientName] = useState('Ramesh Gogoi')
  const [patientAge, setPatientAge] = useState('58')
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male')
  const [diabetesDuration, setDiabetesDuration] = useState('12')
  const [eyeTested, setEyeTested] = useState<'OD' | 'OS'>('OD')
  const [abhaId, setAbhaId] = useState('ABHA-9821-4402')
  const [showPatientForm, setShowPatientForm] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const isOphthalmologist = user?.role === 'Ophthalmologist'

  const samples = [
    '/samples/sample-2-moderate-dr.jpg',
    '/samples/sample-1-mild-dr.jpg',
    '/samples/sample-0-no-dr.jpg',
    '/samples/sample-3-severe-dr.jpg',
    '/samples/sample-4-proliferative-dr.jpg',
  ]

  const loadCaseIntoWorkspace = (c: CaseRecord) => {
    setActiveCaseId(c.id)
    setPatientName(c.patient?.name || '')
    setPatientAge(String(c.patient?.age || ''))
    setPatientGender(c.patient?.gender || 'Male')
    setDiabetesDuration(String(c.patient?.diabetesYears || ''))
    setEyeTested(c.patient?.eye || 'OD')
    setAbhaId(c.patient?.abhaId || '')
    setPreviewSrc(c.imageSrc || '/netrika-fundus.png')
    setMetaText(`${c.id} · ${c.patient?.name || 'Patient'} (${c.patient?.eye || 'OD'}) · ${c.level}`)
    setReviewLevel(c.drLevelNum ?? 2)
    setReviewNotes(c.ophthalmologistReview?.clinicalNotes || '')
    setReferralRecommendation(
      c.ophthalmologistReview?.referralRecommendation ||
      (c.status === 'Referable' ? 'Laser / Anti-VEGF Specialist Referral' : 'Routine 12m')
    )
    setResult({
      caseId: c.id,
      imageSrc: c.imageSrc,
      originalImageSrc: c.originalImageSrc || c.imageSrc,
      quality: c.quality || { isGradable: true, score: 95, status: 'Gradable', clarity: 94, illumination: 96, reasons: [] },
      drLevel: c.drLevelNum,
      drLevelText: c.level,
      drClassName: c.drClassName || (c.drLevelNum === 3 ? 'Severe DR' : c.drLevelNum === 2 ? 'Moderate DR' : c.drLevelNum === 1 ? 'Mild DR' : c.drLevelNum === 4 ? 'Proliferative DR' : 'No DR'),
      confidence: parseFloat(c.confidence) || 94.0,
      confidenceText: c.confidence,
      isReferable: c.status === 'Referable',
      referableStatus: c.status,
      referableBadge: c.status === 'Referable' ? 'REFERABLE DR' : 'NON-REFERABLE',
      probabilities: [0.02, 0.05, 0.85, 0.05, 0.03],
      gradcam: {
        heatmapDataUrl: c.gradcamHeatmapSrc || '',
        overlayDataUrl: c.gradcamOverlaySrc || '',
        peakActivationQuadrant: 'Temporal Superior',
        salientCoordinates: [],
      },
      evidence: c.evidence && c.evidence.length > 0 ? c.evidence : evidence,
      processingTimeMs: 110,
      timestamp: c.timestamp,
    })
    setScanState('complete')
    setSubmittedForReview(false)
  }

  // Synchronize pending queue when in Ophthalmologist mode
  useEffect(() => {
    if (isOphthalmologist) {
      const fetchPending = async () => {
        try {
          const res = await fetch('/api/review')
          const data = await res.json()
          if (data.success && Array.isArray(data.cases)) {
            const pendings = data.cases.filter(
              (c: CaseRecord) => c.caseStatus === 'PENDING_REVIEW' || c.priority === 'Pending Ophthalmologist Review'
            )
            setPendingCases(pendings)
            // Auto-load currently active case if still pending, or the first pending case
            if (pendings.length > 0) {
              const currentActive = pendings.find((c: CaseRecord) => c.id === activeCaseId)
              if (!currentActive) {
                loadCaseIntoWorkspace(pendings[0])
              }
            } else {
              setActiveCaseId(null)
              setResult(null)
              setScanState('ready')
            }
          }
        } catch (e) {
          console.error('Error fetching pending queue:', e)
        }
      }
      fetchPending()
    }
  }, [isOphthalmologist, refreshKey])

  const processScreening = async (formData: FormData, localPreviewUrl?: string, filename?: string) => {
    setScanState('analyzing')
    setSubmittedForReview(false)
    if (localPreviewUrl) setPreviewSrc(localPreviewUrl)

    // Append patient demographics and screener info
    formData.append('patientName', patientName)
    formData.append('patientAge', patientAge)
    formData.append('patientGender', patientGender)
    formData.append('diabetesDuration', diabetesDuration)
    formData.append('eyeTested', eyeTested)
    formData.append('abhaId', abhaId)
    formData.append('screenerName', user?.name || 'Anjali Devi')
    formData.append('screenerOperatorId', user?.operatorId || 'TECH-AS-401')
    formData.append('screenerCenter', user?.centerName || 'Sonitpur Rural Vision Centre / PHC')

    try {
      const res = await fetch('/api/screen', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.data) {
        const screeningData: ScreeningResult = data.data
        setResult(screeningData)
        setPreviewSrc(screeningData.imageSrc)
        setMetaText(filename || `${screeningData.drClassName} · 512 × 512 px`)
        setReviewLevel(screeningData.drLevel)
        setReferralRecommendation(
          screeningData.isReferable
            ? 'Laser / Anti-VEGF Specialist Referral'
            : 'Routine 12m'
        )
        setScanState('complete')
        if (screeningData.quality.isGradable && onCaseCreated) {
          onCaseCreated()
        }
      } else {
        throw new Error(data.error || 'Screening failed')
      }
    } catch (err) {
      console.error('Screening failed:', err)
      setScanState('complete')
    }
  }

  const handleFileUpload = (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    const formData = new FormData()
    formData.append('file', file)
    processScreening(formData, previewUrl, `${file.name} · ${(file.size / 1024).toFixed(0)} KB`)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleSampleClick = () => {
    const nextSample = samples[sampleIdx % samples.length]
    setSampleIdx((prev) => prev + 1)
    const formData = new FormData()
    formData.append('sample', nextSample)
    processScreening(formData, nextSample, `${nextSample.replace('/samples/', '')} · Sample fundus`)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleTechnicianSubmit = () => {
    setSubmittedForReview(true)
    if (onCaseCreated) onCaseCreated()
  }

  const handleStartNewScreening = () => {
    setScanState('ready')
    setSubmittedForReview(false)
    setResult(null)
    setPreviewSrc('/netrika-fundus.png')
    setMetaText('OD · 45° · 2048 × 2048 px')
    setPatientName('')
    setPatientAge('')
    setDiabetesDuration('')
    setAbhaId('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOphthalmologistReviewSubmit = async () => {
    const targetCaseId = activeCaseId || result?.caseId
    if (!targetCaseId) {
      setReviewOpen(false)
      return
    }

    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: targetCaseId,
          finalDRLevel: Number(reviewLevel),
          clinicalNotes: reviewNotes,
          reviewerName: user?.role === 'Ophthalmologist' ? user.name : 'Dr. Rajesh Sharma, MS',
          reviewerRegNo: user?.role === 'Ophthalmologist' ? user.medicalCouncilRegNo : 'NMC-OPH-88421',
          hospitalAffiliation: user?.role === 'Ophthalmologist' ? user.hospitalAffiliation : 'Regional Institute of Ophthalmology',
          referralRecommendation,
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (onCaseCreated) onCaseCreated()
        const updatedPendings = (data.cases || []).filter(
          (c: CaseRecord) => c.caseStatus === 'PENDING_REVIEW' || c.priority === 'Pending Ophthalmologist Review'
        )
        setPendingCases(updatedPendings)
        if (updatedPendings.length > 0) {
          loadCaseIntoWorkspace(updatedPendings[0])
        } else {
          setActiveCaseId(null)
          setScanState('ready')
          setResult(null)
        }
      }
    } catch (err) {
      console.error('Review submit error:', err)
    } finally {
      setIsSubmittingReview(false)
      setReviewOpen(false)
    }
  }

  const currentEvidence = result?.evidence && result.evidence.length > 0 ? result.evidence : evidence
  const isImageGradable = result?.quality?.isGradable ?? true

  return (
    <section className="workspace-section" id="screening">
      <div className="wrap">
        <div className="workspace-title">
          <div>
            <div className="section-label teal-label">
              {isOphthalmologist ? 'Tele-Ophthalmology Review' : 'Netrika workspace'}
            </div>
            <h2>{isOphthalmologist ? 'Clinical Case Review' : 'New screening'}</h2>
            <p>
              {isOphthalmologist
                ? 'Review pending retinal cases, verify AI severity, inspect Grad-CAM, and sign off.'
                : 'Upload a retinal image to begin AI-assisted screening & triage.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span className="demo-badge">
              <span className="live-dot" /> Explainable AI Active
            </span>
            {user && (
              <span className="clinician-badge-pill">
                {isOphthalmologist ? <Stethoscope size={13} /> : <ScanLine size={13} />}
                {isOphthalmologist
                  ? `Specialist: ${user.name} (${user.medicalCouncilRegNo || 'NMC Verified'})`
                  : `Screener: ${user.name} (${user.centerName || 'Field PHC'})`}
              </span>
            )}
          </div>
        </div>

        {/* OPHTHALMOLOGIST PENDING QUEUE SELECTOR */}
        {isOphthalmologist && (
          <div
            style={{
              padding: '14px 18px',
              background: '#081423',
              border: '1px solid rgba(139, 124, 255, 0.35)',
              borderRadius: '14px',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="live-dot" style={{ background: 'var(--violet)' }} />
              <div>
                <strong style={{ color: '#ffffff', fontSize: '13px', display: 'block' }}>
                  Pending Review Queue ({pendingCases.length} case{pendingCases.length === 1 ? '' : 's'} awaiting sign-off)
                </strong>
                <span style={{ fontSize: '11px', color: '#9bb1c4' }}>
                  {activeCaseId ? `Currently loaded: ${activeCaseId}` : 'Select a pending patient case below to inspect:'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {pendingCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`button small ${activeCaseId === c.id ? 'button-teal' : 'button-dark'}`}
                  onClick={() => loadCaseIntoWorkspace(c)}
                  style={{ fontSize: '11px', padding: '6px 12px' }}
                >
                  {c.id} · {c.patient?.name || 'Patient'} ({c.patient?.eye || 'OD'})
                </button>
              ))}
              {pendingCases.length === 0 && (
                <span style={{ color: 'var(--teal)', fontSize: '11.5px', fontWeight: 600 }}>
                  ✓ All pending cases have been reviewed!
                </span>
              )}
            </div>
          </div>
        )}

        {/* PATIENT TRIAGE & FIELD DEMOGRAPHICS CARD */}
        <div className="patient-triage-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} /> Patient Demographics &amp; Triage Details
            </span>
            <button
              type="button"
              onClick={() => setShowPatientForm(!showPatientForm)}
              style={{ background: 'transparent', border: 0, color: '#8198ac', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {showPatientForm ? 'Collapse Form' : 'Edit Demographics'} <ChevronDown size={13} style={{ transform: showPatientForm ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {showPatientForm && (
            <div className="patient-triage-grid">
              <label>
                Patient Name
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Gogoi"
                />
              </label>
              <label>
                Age (Years)
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 58"
                />
              </label>
              <label>
                Gender
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Diabetes Duration (Yrs)
                <input
                  type="number"
                  value={diabetesDuration}
                  onChange={(e) => setDiabetesDuration(e.target.value)}
                  placeholder="e.g. 12"
                />
              </label>
              <label>
                Eye Tested
                <select
                  value={eyeTested}
                  onChange={(e) => setEyeTested(e.target.value as any)}
                >
                  <option value="OD">Right Eye (OD)</option>
                  <option value="OS">Left Eye (OS)</option>
                </select>
              </label>
              <label>
                ABHA / Health ID
                <input
                  type="text"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="ABHA-9821-4402"
                />
              </label>
            </div>
          )}
        </div>

        <div className="workspace-grid">
          <aside className="workspace-panel upload-panel">
            <div className="panel-top">
              <span>01 / INPUT</span>
              <CircleHelp size={16} />
            </div>
            <h3>Retinal image</h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
              aria-label="Upload retinal fundus image"
            />

            <div
              className="upload-box"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <FileImage />
              </div>
              <strong>
                {scanState === 'ready'
                  ? 'Upload retinal image'
                  : scanState === 'analyzing'
                  ? 'Reviewing image...'
                  : isImageGradable
                  ? 'Image received'
                  : 'Image rejected'}
              </strong>
              <p>
                {scanState === 'ready'
                  ? 'Drag and drop a fundus image here or browse from your device.'
                  : scanState === 'analyzing'
                  ? 'Checking image quality, retinal authenticity and vascular architecture'
                  : isImageGradable
                  ? `${metaText} · Patient: ${patientName || 'Anonymous'} (${eyeTested})`
                  : 'Image failed quality validation check.'}
              </p>
              {scanState === 'ready' && (
                <>
                  <button className="button button-outline" onClick={handleBrowseClick}>
                    <UploadCloud size={15} /> Browse files
                  </button>
                  <button className="sample-link" onClick={handleSampleClick}>
                    Try a sample image <ArrowRight size={13} />
                  </button>
                </>
              )}
              {scanState === 'analyzing' && (
                <div className="processing-bar">
                  <span />
                </div>
              )}
              {scanState === 'complete' && (
                <div
                  className="complete"
                  style={
                    !isImageGradable
                      ? {
                          color: '#ff7878',
                          background: 'rgba(255, 107, 107, 0.12)',
                          border: '1px solid rgba(255, 107, 107, 0.3)',
                        }
                      : undefined
                  }
                >
                  {isImageGradable ? <Check size={15} /> : <X size={15} />} Image quality: {result?.quality.status ?? 'Gradable'} ({result?.quality.score ?? 94}%)
                </div>
              )}
            </div>
            <div className="panel-meta">
              <span>
                <ShieldCheck size={13} /> Encrypted clinical transfer
              </span>
              <span>JPG · PNG · TIFF</span>
            </div>
          </aside>

          <div className="workspace-panel viewer-panel">
            <div className="panel-top">
              <span>02 / ANALYSIS</span>
              <span className={`state-pill ${scanState}`}>
                {scanState === 'ready' ? 'Ready' : scanState === 'analyzing' ? 'Analyzing' : 'Complete'}
              </span>
            </div>
            <h3>Grad-CAM explanation</h3>
            <div className="viewer">
              <RetinaVisual
                mode={isImageGradable ? mode : 'original'}
                src={previewSrc}
                heatmapSrc={result?.gradcam?.heatmapDataUrl}
                overlaySrc={result?.gradcam?.overlayDataUrl}
              />
              {scanState === 'ready' && (
                <div className="viewer-message">
                  <ScanLine size={24} />
                  <span>Start a screening to analyze this image</span>
                </div>
              )}
            </div>
            <div className="mode-tabs" role="tablist" aria-label="Retinal image view">
              <button
                className={mode === 'original' || !isImageGradable ? 'active' : ''}
                onClick={() => setMode('original')}
              >
                Original
              </button>
              <button
                className={mode === 'gradcam' && isImageGradable ? 'active' : ''}
                onClick={() => isImageGradable && setMode('gradcam')}
                disabled={!isImageGradable}
                style={!isImageGradable ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
              >
                Grad-CAM
              </button>
              <button
                className={mode === 'overlay' && isImageGradable ? 'active' : ''}
                onClick={() => isImageGradable && setMode('overlay')}
                disabled={!isImageGradable}
                style={!isImageGradable ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
              >
                Overlay
              </button>
            </div>
            {!isImageGradable && scanState === 'complete' && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 107, 107, 0.10)',
                  border: '1px solid rgba(255, 107, 107, 0.25)',
                  color: '#ff9b9b',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={14} /> Quality Check Failed: Retinal image is ungradable. AI analysis withheld.
              </div>
            )}
          </div>

          <aside className="workspace-panel insight-panel">
            <div className="panel-top">
              <span>03 / RESULT</span>
              <FileCheck2 size={16} />
            </div>
            <h3>Screening result</h3>
            {scanState !== 'complete' ? (
              <div className="empty-result">
                <div className="empty-ring">
                  <Eye size={22} />
                </div>
                <strong>Your result will appear here</strong>
                <p>Complete an image analysis to view severity, confidence, and clinical evidence.</p>
              </div>
            ) : !isImageGradable ? (
              /* CLEAR REJECTION UI FOR UNGRADABLE / NON-RETINAL IMAGES */
              <div className="result-content">
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255, 107, 107, 0.08)',
                    border: '1px solid rgba(255, 107, 107, 0.25)',
                    marginBottom: '14px',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      color: '#ff6b6b',
                      fontWeight: 700,
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '8px',
                    }}
                  >
                    <X size={14} /> Image not suitable for screening
                  </div>
                  <strong style={{ color: '#ffffff', fontSize: '13.5px', display: 'block', marginBottom: '8px' }}>
                    Validation Check Failed
                  </strong>
                  <div style={{ fontSize: '11.5px', color: '#c4d8ea', lineHeight: 1.5, marginBottom: '8px' }}>
                    Reason:
                  </div>
                  <ul style={{ margin: '0 0 10px 18px', padding: 0, fontSize: '11px', color: '#ffb3b3', lineHeight: 1.4 }}>
                    {(result?.quality.reasons || ['This does not appear to be a retinal/fundus image.']).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <div style={{ fontSize: '11px', color: '#8fb1cc', borderTop: '1px solid rgba(255, 107, 107, 0.2)', paddingTop: '8px' }}>
                    Please upload a clear retinal/fundus image.
                  </div>
                </div>

                <button
                  type="button"
                  className="button button-teal full"
                  onClick={handleBrowseClick}
                  style={{ marginTop: '4px' }}
                >
                  <UploadCloud size={15} /> Re-take / Upload Clear Retinal Image
                </button>
              </div>
            ) : (
              /* GRADABLE SCREENING RESULT */
              <div className="result-content">
                <div className="result-level">
                  <span>{result ? result.drLevelText : 'LEVEL 2'}</span>
                  <strong>{result ? result.drClassName : 'Moderate DR'}</strong>
                  <em style={{ color: result?.isReferable ? '#ff6b6b' : '#38d9c5' }}>
                    {result ? result.referableBadge : 'REFERABLE DR'}
                  </em>
                </div>
                <div className="confidence">
                  <span>AI confidence</span>
                  <strong>{result ? result.confidenceText : '94.2%'}</strong>
                  <div>
                    <i style={{ width: `${result ? result.confidence : 94.2}%` }} />
                  </div>
                </div>
                <div className="result-disclaimer">AI prediction, decision support for clinician.</div>

                {/* ROLE-AWARE ACTION BUTTONS */}
                {isOphthalmologist ? (
                  <button
                    className="button button-teal full"
                    onClick={() => setReviewOpen(true)}
                    style={{ marginTop: '16px' }}
                  >
                    Clinical Assessment &amp; Sign-Off <Check size={15} />
                  </button>
                ) : submittedForReview ? (
                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'rgba(56, 217, 197, 0.12)',
                        border: '1px solid rgba(56, 217, 197, 0.3)',
                        color: 'var(--teal)',
                        fontSize: '11.5px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={14} /> Screening submitted for ophthalmologist review.
                      </span>
                      <span style={{ fontSize: '10.5px', color: '#a0b9cc' }}>
                        Case <strong>{result?.caseId}</strong> is queued under &apos;Pending Ophthalmologist Review&apos;.
                      </span>
                    </div>
                    <button
                      type="button"
                      className="button button-teal full"
                      onClick={handleStartNewScreening}
                    >
                      <ScanLine size={15} /> Screen Next Patient
                    </button>
                  </div>
                ) : (
                  <button
                    className="button button-teal full"
                    onClick={handleTechnicianSubmit}
                    style={{ marginTop: '16px' }}
                  >
                    Submit for Ophthalmologist Review <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}
          </aside>
        </div>

        {scanState === 'complete' && isImageGradable && (
          <div className="evidence-section">
            <div className="evidence-heading">
              <div className="section-label teal-label">Supporting retinal evidence</div>
              <h3>Why did the AI predict this?</h3>
              <p>Highlighted regions indicate areas that contributed most strongly to the model&apos;s prediction.</p>
            </div>
            <div className="evidence-cards">
              {currentEvidence.map((item) => (
                <div className="evidence-card" key={item.name}>
                  <span className={`evidence-dot ${item.tone}`} />
                  <div>
                    <strong>{item.name}</strong>
                    <span>AI-detected · Requires clinical confirmation</span>
                  </div>
                  <b>{item.confidence}</b>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ONLY OPHTHALMOLOGIST CAN SEE OR SUBMIT THIS MODAL */}
      {reviewOpen && isOphthalmologist && (
        <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <div className="review-card">
            <button className="close-modal" onClick={() => setReviewOpen(false)} aria-label="Close review">
              <X />
            </button>
            <div className="section-label teal-label">Clinical assessment &amp; sign-off</div>
            <h3 id="review-title">Ophthalmologist review</h3>
            <p>
              Logged in as {user.name} ({user.medicalCouncilRegNo || 'Medical Specialist'}). Endorse grading, specify referral protocol, and sign off.
            </p>

            <label>
              Final DR severity level
              <select
                value={reviewLevel}
                onChange={(e) => setReviewLevel(Number(e.target.value) as DRClass)}
              >
                <option value="0">Level 0 · No Diabetic Retinopathy</option>
                <option value="1">Level 1 · Mild Non-Proliferative DR</option>
                <option value="2">Level 2 · Moderate Non-Proliferative DR</option>
                <option value="3">Level 3 · Severe Non-Proliferative DR</option>
                <option value="4">Level 4 · Proliferative Diabetic Retinopathy</option>
              </select>
            </label>

            <label>
              Clinical Referral Protocol
              <select
                value={referralRecommendation}
                onChange={(e) => setReferralRecommendation(e.target.value as any)}
              >
                <option value="Routine 12m">Routine 12-Month Field Rescreening (No / Mild DR)</option>
                <option value="Early 3-6m">Early 3–6 Month Monitoring (Mild / Moderate DR)</option>
                <option value="Laser / Anti-VEGF Specialist Referral">Laser Photocoagulation / Anti-VEGF Specialist Referral (Referable DR)</option>
                <option value="Emergency Referral">Emergency Vitreo-Retinal Surgical Referral (High Risk)</option>
              </select>
            </label>

            <label>
              Clinical notes &amp; findings
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Document macular involvement, microaneurysm distribution, or laser/tele-referral details"
              />
            </label>

            <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '10px', background: '#081423', border: '1px solid #1a364d', fontSize: '11px', color: '#9bb1c4' }}>
              <span style={{ color: '#ffffff', fontWeight: 600, display: 'block' }}>
                Digital Signing Clinician:
              </span>
              <span>{user.name} · {user.medicalCouncilRegNo || 'NMC Verified'} ({user.hospitalAffiliation || 'Regional Eye Care Center'})</span>
            </div>

            <button
              className="button button-teal full"
              onClick={handleOphthalmologistReviewSubmit}
              disabled={isSubmittingReview}
              style={{ marginTop: '18px' }}
            >
              {isSubmittingReview ? 'Signing assessment...' : 'Submit Final Review & Sign-Off'} <Check size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function CaseDetailModal({
  caseItem,
  onClose,
  onReviewSubmitted,
  user,
}: {
  caseItem: CaseRecord | null
  onClose: () => void
  onReviewSubmitted?: () => void
  user?: UserProfile | null
}) {
  const [selectedLevel, setSelectedLevel] = useState<DRClass>(caseItem?.drLevelNum ?? 2)
  const [notes, setNotes] = useState(caseItem?.ophthalmologistReview?.clinicalNotes || '')
  const [modalMode, setModalMode] = useState<ViewMode>('original')
  const [referral, setReferral] = useState<
    'Routine 12m' | 'Early 3-6m' | 'Laser / Anti-VEGF Specialist Referral' | 'Emergency Referral'
  >(caseItem?.ophthalmologistReview?.referralRecommendation || (caseItem?.status === 'Referable' ? 'Laser / Anti-VEGF Specialist Referral' : 'Routine 12m'))
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
  const isReviewed = caseItem.caseStatus === 'REVIEWED' || caseItem.priority === 'Reviewed' || !!caseItem.ophthalmologistReview

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
    <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="case-title">
      <div className="review-card" style={{ maxWidth: '540px' }}>
        <button className="close-modal" onClick={onClose} aria-label="Close case detail">
          <X />
        </button>
        <div className="section-label teal-label">Case Details · {caseItem.id}</div>
        <h3 id="case-title">Clinical Screening Report</h3>
        <p>Comprehensive fundus case report, AI triage, and specialist endorsement.</p>

        {/* PATIENT & CASE OVERVIEW GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', marginBottom: '14px' }}>
          <div>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1c354b', aspectRatio: '1' }}>
              <img src={activeImgSrc} alt={caseItem.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {(caseItem.gradcamHeatmapSrc || caseItem.gradcamOverlaySrc) && (
              <div className="mode-tabs" style={{ marginTop: '8px', padding: '2px' }} role="tablist" aria-label="Modal view mode">
                <button
                  type="button"
                  className={modalMode === 'original' ? 'active' : ''}
                  onClick={() => setModalMode('original')}
                  style={{ fontSize: '10.5px', padding: '4px 8px' }}
                >
                  Original
                </button>
                <button
                  type="button"
                  className={modalMode === 'gradcam' ? 'active' : ''}
                  onClick={() => setModalMode('gradcam')}
                  style={{ fontSize: '10.5px', padding: '4px 8px' }}
                >
                  Grad-CAM
                </button>
                <button
                  type="button"
                  className={modalMode === 'overlay' ? 'active' : ''}
                  onClick={() => setModalMode('overlay')}
                  style={{ fontSize: '10.5px', padding: '4px 8px' }}
                >
                  Overlay
                </button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: '#dde6ec' }}>
            <div>
              <span style={{ color: '#8198ac', display: 'block', fontSize: '10px' }}>AI PREDICTION</span>
              <strong style={{ fontSize: '15px', color: '#ffffff' }}>
                {caseItem.level} {caseItem.drClassName ? `(${caseItem.drClassName})` : ''}
              </strong>
            </div>
            <div>
              <span style={{ color: '#8198ac', display: 'block', fontSize: '10px' }}>CONFIDENCE</span>
              <strong>{caseItem.confidence}</strong>
            </div>
            <div>
              <span style={{ color: '#8198ac', display: 'block', fontSize: '10px' }}>CLINICAL STATUS</span>
              <span className={caseItem.status === 'Referable' ? 'priority-text' : 'status-text'}>
                {caseItem.status === 'Referable' ? 'REFERABLE DR' : 'NON-REFERABLE'}
              </span>
            </div>
            <div>
              <span style={{ color: '#8198ac', display: 'block', fontSize: '10px' }}>REVIEW QUEUE STATUS</span>
              <span style={{ color: isReviewed ? 'var(--teal)' : 'var(--amber)', fontWeight: 700 }}>
                {isReviewed ? '✓ Reviewed & Finalized' : 'Pending Ophthalmologist Review'}
              </span>
            </div>
          </div>
        </div>

        {/* PATIENT & SCREENER METADATA (IF PRESENT) */}
        {(caseItem.patient || caseItem.screener) && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#081423', border: '1px solid #1a364d', marginBottom: '16px', fontSize: '11px', color: '#a0b6c8' }}>
            {caseItem.patient && (
              <div style={{ marginBottom: caseItem.screener ? '6px' : '0' }}>
                <strong style={{ color: '#ffffff' }}>Patient:</strong> {caseItem.patient.name || 'Patient'}
                {caseItem.patient.age ? ` (${caseItem.patient.age}y, ${caseItem.patient.gender || 'M'})` : ''}
                {caseItem.patient.diabetesYears ? ` · DM: ${caseItem.patient.diabetesYears} yrs` : ''}
                {caseItem.patient.eye ? ` · Eye: ${caseItem.patient.eye}` : ''}
                {caseItem.patient.abhaId ? ` · ABHA: ${caseItem.patient.abhaId}` : ''}
              </div>
            )}
            {caseItem.screener && (
              <div style={{ fontSize: '10.5px', color: '#829bb0' }}>
                <strong style={{ color: '#d0e0ed' }}>Field Screener:</strong> {caseItem.screener.name}
                {caseItem.screener.centerName ? ` (${caseItem.screener.centerName})` : ''}
              </div>
            )}
          </div>
        )}

        {/* IF OPHTHALMOLOGIST: SHOW EDITABLE ASSESSMENT & SIGN-OFF FORM */}
        {isOphthalmologist ? (
          <div>
            <div className="section-label" style={{ marginTop: '10px', color: 'var(--violet)' }}>
              Specialist Clinical Assessment
            </div>
            <label>
              Ophthalmologist Assessment (DR Level)
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value) as DRClass)}
              >
                <option value="0">Level 0 · No DR</option>
                <option value="1">Level 1 · Mild DR</option>
                <option value="2">Level 2 · Moderate DR</option>
                <option value="3">Level 3 · Severe DR</option>
                <option value="4">Level 4 · Proliferative DR</option>
              </select>
            </label>

            <label>
              Referral &amp; Follow-up Protocol
              <select
                value={referral}
                onChange={(e) => setReferral(e.target.value as any)}
              >
                <option value="Routine 12m">Routine 12-Month Field Rescreening (No / Mild DR)</option>
                <option value="Early 3-6m">Early 3–6 Month Monitoring (Mild / Moderate DR)</option>
                <option value="Laser / Anti-VEGF Specialist Referral">Laser Photocoagulation / Anti-VEGF Specialist Referral</option>
                <option value="Emergency Referral">Emergency Vitreo-Retinal Surgical Referral</option>
              </select>
            </label>

            <label>
              Clinical Notes &amp; Recommendations
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document vascular findings, maculopathy, follow-up schedule, or referral instructions"
              />
            </label>

            <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: '#081423', border: '1px solid #1a364d', fontSize: '11px', color: '#9bb1c4' }}>
              <span style={{ color: '#ffffff', fontWeight: 600, display: 'block' }}>
                Signing Specialist:
              </span>
              <span>{user.name} · {user.medicalCouncilRegNo || 'NMC Verified'} ({user.hospitalAffiliation || 'Regional Institute of Ophthalmology'})</span>
            </div>

            <button
              type="button"
              className="button button-teal full"
              style={{ marginTop: '18px' }}
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? 'Saving assessment...' : 'Submit Final Review & Sign-Off'} <Check size={15} />
            </button>
          </div>
        ) : (
          /* IF TECHNICIAN / NON-OPHTHALMOLOGIST: READ-ONLY VIEW (NO SIGN-OFF FORM) */
          <div style={{ marginTop: '14px' }}>
            {caseItem.ophthalmologistReview ? (
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(56, 217, 197, 0.08)', border: '1px solid rgba(56, 217, 197, 0.25)', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--teal)', fontWeight: 700, marginBottom: '6px' }}>
                  <BadgeCheck size={15} /> Verified Specialist Review
                </div>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>
                  Endorsed: Level {caseItem.ophthalmologistReview.finalDRLevel} · {caseItem.ophthalmologistReview.referralRecommendation || 'Routine follow-up'}
                </div>
                <p style={{ margin: '8px 0 6px', color: '#c4d8ea', fontSize: '11.5px', lineHeight: 1.5 }}>
                  &ldquo;{caseItem.ophthalmologistReview.clinicalNotes}&rdquo;
                </p>
                <div style={{ fontSize: '10.5px', color: '#85a0b5', borderTop: '1px solid #1c3d52', paddingTop: '6px', marginTop: '6px' }}>
                  Reviewed by <strong>{caseItem.ophthalmologistReview.reviewerName}</strong> ({caseItem.ophthalmologistReview.reviewerRegNo || 'NMC Specialist'}) · {caseItem.ophthalmologistReview.hospitalAffiliation || 'Eye Hospital'}
                </div>
              </div>
            ) : (
              <div style={{ padding: '14px', borderRadius: '12px', background: '#081423', border: '1px solid #1a364d', color: '#9bb1c4', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={24} color="var(--amber)" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff', display: 'block', fontSize: '12px' }}>Pending Ophthalmologist Review</strong>
                  <span>This screening case has been logged and is awaiting clinical verification by a registered ophthalmologist.</span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="button button-outline full"
              style={{ marginTop: '18px' }}
              onClick={onClose}
            >
              Close Case Report
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SignInModal({
  open,
  onClose,
  user,
  onLogin,
  onLogout,
}: {
  open: boolean
  onClose: () => void
  user: UserProfile | null
  onLogin: (userData: UserProfile) => void
  onLogout: () => void
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [role, setRole] = useState<UserRole>('Ophthalmologist')
  
  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('dr.sharma@ruralhealth.gov.in')
  const [loginPassword, setLoginPassword] = useState('password123')
  
  // Sign Up inputs
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPhone, setSignupPhone] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  
  // Technician specific fields
  const [operatorId, setOperatorId] = useState('')
  const [centerName, setCenterName] = useState('')
  const [district, setDistrict] = useState('')

  // Ophthalmologist specific fields
  const [medicalCouncilRegNo, setMedicalCouncilRegNo] = useState('')
  const [hospitalAffiliation, setHospitalAffiliation] = useState('')
  const [subSpecialty, setSubSpecialty] = useState('Vitreo-Retina & Diabetic Eye Care')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    setErrorMsg('')
    setSuccessMsg('')
  }, [mode, role, open])

  if (!open) return null

  const handleQuickFillTechnician = () => {
    setRole('Technician')
    setLoginEmail('anjali.devi@ruralhealth.gov.in')
    setLoginPassword('password123')
  }

  const handleQuickFillOphthalmologist = () => {
    setRole('Ophthalmologist')
    setLoginEmail('dr.sharma@ruralhealth.gov.in')
    setLoginPassword('password123')
  }

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword,
          role,
        }),
      })

      const data = await res.json()
      if (data.success && data.user) {
        onLogin(data.user)
        onClose()
      } else {
        setErrorMsg(data.error || 'Login failed. Please check credentials.')
      }
    } catch (err) {
      // Fallback local auth for resilience
      const fallbackUser: UserProfile =
        role === 'Ophthalmologist'
          ? {
              id: 'usr-ophth-01',
              name: 'Dr. Rajesh Sharma, MS',
              email: loginEmail,
              role: 'Ophthalmologist',
              medicalCouncilRegNo: 'NMC-OPH-88421',
              hospitalAffiliation: 'Regional Institute of Ophthalmology / GMCH',
              subSpecialty: 'Vitreo-Retina & Diabetic Eye Disease',
              createdAt: new Date().toISOString(),
            }
          : {
              id: 'usr-tech-01',
              name: 'Anjali Devi',
              email: loginEmail,
              role: 'Technician',
              operatorId: 'TECH-AS-401',
              centerName: 'Sonitpur Rural Vision Centre / PHC',
              district: 'Sonitpur, Assam',
              createdAt: new Date().toISOString(),
            }
      onLogin(fallbackUser)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMsg('Please fill in all required name, email, and password fields.')
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (role === 'Ophthalmologist' && !medicalCouncilRegNo.trim()) {
      setErrorMsg('Please enter your Medical Council Registration Number (NMC / State Council).')
      return
    }

    if (role === 'Technician' && !centerName.trim()) {
      setErrorMsg('Please enter your Primary Health Centre or Vision Centre name.')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        action: 'register',
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        phone: signupPhone,
        role,
      }

      if (role === 'Technician') {
        payload.operatorId = operatorId || `TECH-${Math.floor(1000 + Math.random() * 9000)}`
        payload.centerName = centerName
        payload.district = district
      } else {
        payload.medicalCouncilRegNo = medicalCouncilRegNo
        payload.hospitalAffiliation = hospitalAffiliation || 'District Eye Hospital'
        payload.subSpecialty = subSpecialty
        payload.designation = 'Consultant Ophthalmologist'
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success && data.user) {
        setSuccessMsg('Registration successful! Logging in...')
        setTimeout(() => {
          onLogin(data.user)
          onClose()
        }, 600)
      } else {
        setErrorMsg(data.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      // Local fallback registration
      const newLocalUser: UserProfile = {
        id: `usr-${role === 'Technician' ? 'tech' : 'ophth'}-${Date.now()}`,
        name: signupName,
        email: signupEmail,
        role,
        phone: signupPhone,
        operatorId: role === 'Technician' ? operatorId || 'TECH-AS-881' : undefined,
        centerName: role === 'Technician' ? centerName || 'Primary Health Centre' : undefined,
        district: role === 'Technician' ? district : undefined,
        medicalCouncilRegNo: role === 'Ophthalmologist' ? medicalCouncilRegNo : undefined,
        hospitalAffiliation: role === 'Ophthalmologist' ? hospitalAffiliation || 'District Hospital' : undefined,
        subSpecialty: role === 'Ophthalmologist' ? subSpecialty : undefined,
        createdAt: new Date().toISOString(),
      }
      onLogin(newLocalUser)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="signin-title">
      <div className="review-card">
        <button className="close-modal" onClick={onClose} aria-label="Close dialog">
          <X />
        </button>

        {user ? (
          /* PROFILE VIEW WHEN LOGGED IN */
          <div>
            <div className="section-label teal-label">Authorized Clinician Session</div>
            <h3 id="signin-title">{user.name}</h3>
            <p>Active portal session with role-based clinical permissions.</p>

            <div style={{ padding: '18px', borderRadius: '14px', background: '#071221', border: '1px solid #1c3852', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#8198ac', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CLINICAL CREDENTIALS
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    background: user.role === 'Ophthalmologist' ? 'rgba(139, 124, 255, 0.18)' : 'rgba(56, 217, 197, 0.15)',
                    color: user.role === 'Ophthalmologist' ? 'var(--violet)' : 'var(--teal)',
                    border: user.role === 'Ophthalmologist' ? '1px solid rgba(139, 124, 255, 0.35)' : '1px solid rgba(56, 217, 197, 0.35)',
                    fontWeight: 700,
                  }}
                >
                  {user.role}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#d8e5f2' }}>
                <div>
                  <strong style={{ color: '#ffffff' }}>Email:</strong> {user.email}
                </div>
                {user.role === 'Ophthalmologist' && (
                  <>
                    <div>
                      <strong style={{ color: '#ffffff' }}>Medical Reg No:</strong> {user.medicalCouncilRegNo || 'NMC-OPH-88421'}
                    </div>
                    <div>
                      <strong style={{ color: '#ffffff' }}>Affiliation:</strong> {user.hospitalAffiliation || 'Regional Eye Care Center'}
                    </div>
                    {user.subSpecialty && (
                      <div>
                        <strong style={{ color: '#ffffff' }}>Specialty:</strong> {user.subSpecialty}
                      </div>
                    )}
                  </>
                )}

                {user.role === 'Technician' && (
                  <>
                    <div>
                      <strong style={{ color: '#ffffff' }}>Operator ID:</strong> {user.operatorId || 'TECH-AS-401'}
                    </div>
                    <div>
                      <strong style={{ color: '#ffffff' }}>Health Centre:</strong> {user.centerName || 'Sonitpur Vision Centre'}
                    </div>
                    {user.district && (
                      <div>
                        <strong style={{ color: '#ffffff' }}>District:</strong> {user.district}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #162f45', fontSize: '11px', color: '#88a0b5' }}>
                <strong style={{ color: 'var(--teal)', display: 'block', marginBottom: '4px' }}>Active Privileges:</strong>
                {user.role === 'Ophthalmologist' ? (
                  <span>✓ Diagnostic verification &nbsp;✓ DR Grading Override &nbsp;✓ Referral Sign-Off</span>
                ) : (
                  <span>✓ Fundus Camera Capture &nbsp;✓ Instant AI Triage &nbsp;✓ Patient Intake Logging</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="button button-outline full"
                onClick={() => {
                  onLogout()
                }}
              >
                <LogOut size={14} /> Sign out of Portal
              </button>
              <button
                type="button"
                className="button button-teal full"
                onClick={onClose}
              >
                Close Profile
              </button>
            </div>
          </div>
        ) : (
          /* AUTH TABS: SIGN IN VS SIGN UP */
          <div>
            <div className="section-label teal-label">Clinical Authentication</div>
            <h3 id="signin-title">Netrika Portal</h3>
            <p>Access retinal screening triage, diagnostic review queues, and tele-ophthalmology workflows.</p>

            <div className="auth-mode-tabs">
              <button
                type="button"
                className={`auth-mode-tab ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => setMode('signin')}
              >
                <LogIn size={13} /> Sign In
              </button>
              <button
                type="button"
                className={`auth-mode-tab ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                <UserPlus size={13} /> Register (Sign Up)
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 107, 107, 0.12)', border: '1px solid rgba(255, 107, 107, 0.3)', color: '#ff9494', fontSize: '11.5px', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(56, 217, 197, 0.12)', border: '1px solid rgba(56, 217, 197, 0.3)', color: 'var(--teal)', fontSize: '11.5px', marginBottom: '14px' }}>
                {successMsg}
              </div>
            )}

            {/* ROLE SELECTOR CARDS */}
            <div className="auth-role-grid">
              <div
                className={`auth-role-card ${role === 'Technician' ? 'active' : ''}`}
                onClick={() => setRole('Technician')}
              >
                <strong>
                  <ScanLine size={14} color={role === 'Technician' ? 'var(--teal)' : '#8198ac'} />
                  Vision Technician
                </strong>
                <span>Field screener, PHC operator &amp; patient intake</span>
              </div>
              <div
                className={`auth-role-card ${role === 'Ophthalmologist' ? 'active' : ''}`}
                onClick={() => setRole('Ophthalmologist')}
              >
                <strong>
                  <Stethoscope size={14} color={role === 'Ophthalmologist' ? 'var(--violet)' : '#8198ac'} />
                  Ophthalmologist
                </strong>
                <span>Retina specialist, diagnostic review &amp; sign-off</span>
              </div>
            </div>

            {mode === 'signin' ? (
              /* SIGN IN FORM */
              <form onSubmit={handleSignInSubmit}>
                <label>
                  Official Health Email / Clinician ID
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. clinician@ruralhealth.gov.in"
                    required
                  />
                </label>
                <label>
                  Password / Security PIN
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="button button-teal full"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : `Sign in as ${role}`} <ArrowRight size={15} />
                </button>

                {/* 1-CLICK DEMO FILL BUTTONS */}
                <div className="auth-preset-bar">
                  <span className="auth-preset-title">Instant 1-Click Testing Credentials</span>
                  <div className="auth-preset-btns">
                    <button
                      type="button"
                      className="auth-preset-btn"
                      onClick={handleQuickFillTechnician}
                    >
                      <ScanLine size={12} color="var(--teal)" /> Demo Screener (Anjali Devi · PHC)
                    </button>
                    <button
                      type="button"
                      className="auth-preset-btn"
                      onClick={handleQuickFillOphthalmologist}
                    >
                      <Stethoscope size={12} color="var(--violet)" /> Demo Doctor (Dr. Sharma · NMC #88421)
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#7991a4' }}>
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    style={{ background: 'transparent', border: 0, color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Register new account
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN UP / REGISTRATION FORM */
              <form onSubmit={handleSignUpSubmit}>
                <label>
                  {role === 'Ophthalmologist' ? 'Clinician Full Name & Degree' : 'Technician / Screener Full Name'}
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={role === 'Ophthalmologist' ? 'e.g. Dr. Rajesh Sharma, MS' : 'e.g. Anjali Devi'}
                    required
                  />
                </label>

                {/* ROLE-SPECIFIC REGISTRATION FIELDS */}
                {role === 'Technician' ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label>
                        Operator / Screener ID
                        <input
                          type="text"
                          value={operatorId}
                          onChange={(e) => setOperatorId(e.target.value)}
                          placeholder="e.g. TECH-AS-401"
                        />
                      </label>
                      <label>
                        District / State
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Sonitpur, Assam"
                        />
                      </label>
                    </div>
                    <label>
                      Primary Health Centre (PHC) / Vision Centre Name
                      <input
                        type="text"
                        value={centerName}
                        onChange={(e) => setCenterName(e.target.value)}
                        placeholder="e.g. Sonitpur Rural Vision Centre / PHC"
                        required
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label>
                        Medical Council Reg. No. (NMC/State)
                        <input
                          type="text"
                          value={medicalCouncilRegNo}
                          onChange={(e) => setMedicalCouncilRegNo(e.target.value)}
                          placeholder="e.g. NMC-OPH-88421"
                          required
                        />
                      </label>
                      <label>
                        Sub-Specialty / Dept
                        <input
                          type="text"
                          value={subSpecialty}
                          onChange={(e) => setSubSpecialty(e.target.value)}
                          placeholder="e.g. Vitreo-Retina"
                        />
                      </label>
                    </div>
                    <label>
                      Affiliated Hospital / Medical College / Eye Institute
                      <input
                        type="text"
                        value={hospitalAffiliation}
                        onChange={(e) => setHospitalAffiliation(e.target.value)}
                        placeholder="e.g. Regional Institute of Ophthalmology, GMCH"
                        required
                      />
                    </label>
                  </>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label>
                    Official Email
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. user@ruralhealth.gov.in"
                      required
                    />
                  </label>
                  <label>
                    Contact / Mobile No.
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 94350 00000"
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <label>
                    Password
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                    />
                  </label>
                  <label>
                    Confirm Password
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="button button-teal full"
                  disabled={loading}
                  style={{ marginTop: '20px' }}
                >
                  {loading ? 'Registering...' : `Register & Create ${role} Account`} <Check size={15} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: '#7991a4' }}>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    style={{ background: 'transparent', border: 0, color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Sign in to existing account
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Dashboard({
  refreshKey,
  onSelectCase,
}: {
  refreshKey?: number
  onSelectCase?: (c: CaseRecord) => void
}) {
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
    },
  ])

  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'referable'>('all')

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

  const displayedCases = cases.filter((c) => {
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

  return (
    <section className="dashboard wrap" id="reports">
      <div>
        <div className="section-label">At a glance</div>
        <h2>Screening overview &amp; reports</h2>
      </div>
      <div className="dashboard-stats">
        <div>
          <strong>{stats.screenedToday}</strong>
          <span>Screened today</span>
        </div>
        <div>
          <strong>{stats.referableCases}</strong>
          <span>Referable cases</span>
        </div>
        <div>
          <strong>{stats.pendingReview}</strong>
          <span>Pending review</span>
        </div>
        <div>
          <strong>{stats.ungradable}</strong>
          <span>Ungradable</span>
        </div>
      </div>
      <div className="cases-card" id="cases">
        <div className="cases-head">
          <div>
            <h3>Cases awaiting review</h3>
            <p>Prioritized for ophthalmologist review · Click any case to view report &amp; assessment</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`button small ${filter === 'all' ? 'button-teal' : 'button-dark'}`}
              onClick={() => setFilter('all')}
            >
              All cases
            </button>
            <button
              type="button"
              className={`button small ${filter === 'pending' ? 'button-teal' : 'button-dark'}`}
              onClick={() => setFilter('pending')}
            >
              Pending Review
            </button>
            <button
              type="button"
              className={`button small ${filter === 'reviewed' ? 'button-teal' : 'button-dark'}`}
              onClick={() => setFilter('reviewed')}
            >
              Reviewed
            </button>
            <button
              type="button"
              className={`button small ${filter === 'referable' ? 'button-teal' : 'button-dark'}`}
              onClick={() => setFilter('referable')}
            >
              Referable only
            </button>
          </div>
        </div>
        <div className="case-row case-header">
          <span>Case ID &amp; Patient</span>
          <span>AI level</span>
          <span>Confidence</span>
          <span>Status</span>
          <span>Review Status</span>
        </div>
        {displayedCases.map((c) => {
          const isRev = c.caseStatus === 'REVIEWED' || c.priority === 'Reviewed' || c.priority === 'Finalized' || c.priority === 'Completed' || !!c.ophthalmologistReview
          return (
            <div
              className="case-row"
              key={c.id}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectCase && onSelectCase(c)}
              title="Click to view case assessment and report"
            >
              <div>
                <span style={{ fontWeight: 700, color: 'var(--teal)', display: 'block' }}>{c.id}</span>
                <span style={{ fontSize: '11px', color: '#8fb1cc' }}>
                  {c.patient?.name || 'Patient'} ({c.patient?.eye || 'OD'} · {c.patient?.age || '50'}y)
                </span>
              </div>
              <span>{c.level}</span>
              <span>{c.confidence}</span>
              <span className={c.status === 'Referable' ? 'priority-text' : 'status-text'}>{c.status}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: isRev ? 'var(--teal)' : 'var(--amber)',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                {isRev ? (
                  <>
                    <BadgeCheck size={13} /> Reviewed
                  </>
                ) : (
                  <>
                    <span className="live-dot" style={{ width: '5px', height: '5px', background: 'var(--amber)' }} />
                    Pending Review <ChevronRight size={13} />
                  </>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Logo />
        <p>
          Netrika is a research/prototype screening and decision-support system. AI results are not a medical diagnosis and
          must be reviewed by a qualified healthcare professional.
        </p>
        <div className="footer-links">
          <a href="#technology">Technology</a>
          <a href="#reports">Reports</a>
          <a href="#top">
            Back to top <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null)

  // Restore saved session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('netrika_user')
      if (saved) {
        setUser(JSON.parse(saved))
      } else {
        // Default to Technician for screening role by default
        const defaultTechnician: UserProfile = {
          id: 'usr-tech-01',
          name: 'Anjali Devi',
          email: 'anjali.devi@ruralhealth.gov.in',
          role: 'Technician',
          operatorId: 'TECH-AS-401',
          centerName: 'Sonitpur Rural Vision Centre / PHC',
          district: 'Sonitpur, Assam',
          createdAt: new Date().toISOString(),
        }
        setUser(defaultTechnician)
        localStorage.setItem('netrika_user', JSON.stringify(defaultTechnician))
      }
    } catch (e) {
      console.log('Session restore error:', e)
    }
  }, [])

  const handleUserLogin = (u: UserProfile) => {
    setUser(u)
    try {
      localStorage.setItem('netrika_user', JSON.stringify(u))
    } catch (e) {}
  }

  const handleUserLogout = () => {
    setUser(null)
    try {
      localStorage.removeItem('netrika_user')
    } catch (e) {}
  }

  const handleCaseCreated = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <main>
      <Hero onSignInClick={() => setAuthOpen(true)} user={user} />
      <MobileScreeningShowcase />
      <Workflow />
      <ScreeningWorkspace
        onCaseCreated={handleCaseCreated}
        refreshKey={refreshKey}
        user={user}
      />
      <Dashboard
        refreshKey={refreshKey}
        onSelectCase={(c) => setSelectedCase(c)}
      />
      <Footer />

      <SignInModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        user={user}
        onLogin={handleUserLogin}
        onLogout={handleUserLogout}
      />

      <CaseDetailModal
        caseItem={selectedCase}
        onClose={() => setSelectedCase(null)}
        onReviewSubmitted={handleCaseCreated}
        user={user}
      />
    </main>
  )
}


