'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  FileCheck2,
  FileImage,
  Menu,
  Play,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
  X,
} from 'lucide-react'

type ScanState = 'ready' | 'analyzing' | 'complete'
type ViewMode = 'original' | 'gradcam' | 'overlay'

const evidence = [
  { name: 'Possible microaneurysms', confidence: '92%', tone: 'teal' },
  { name: 'Possible hemorrhagic regions', confidence: '86%', tone: 'violet' },
  { name: 'Possible exudative regions', confidence: '78%', tone: 'amber' },
  { name: 'Other retinal abnormalities', confidence: '64%', tone: 'coral' },
]

function RetinaVisual({ mode = 'original', compact = false, src = '/netrika-fundus.png' }: { mode?: ViewMode; compact?: boolean; src?: string }) {
  return (
    <div className={`fundus ${mode} ${compact ? 'compact' : ''}`} role="img" aria-label={`${mode} retinal image visualization`}>
      <img src={src} alt="Retinal fundus image" />
      <div className="fundus-vignette" />
      {mode !== 'original' && <div className="heatmap" />}
      {mode === 'overlay' && <div className="overlay-tint" />}
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
      <span className="logo-mark">
        <Eye size={17} />
      </span>
      <span>Netrika</span>
    </a>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <Logo />
      <nav className={open ? 'nav-links open' : 'nav-links'}>
        <a href="#workflow" onClick={() => setOpen(false)}>Screening</a>
        <a href="#workflow" onClick={() => setOpen(false)}>Cases</a>
        <a href="#report" onClick={() => setOpen(false)}>Reports</a>
        <a href="#technology" onClick={() => setOpen(false)}>Technology</a>
      </nav>
      <div className="nav-actions">
        <a className="nav-login" href="#workflow">Sign in</a>
        <a className="button button-teal small" href="#workflow">
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

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const fundusRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLAnchorElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Autoplay deferred or prevented by browser:', err)
      })
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
      <Navbar />
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
            <a className="button button-teal" href="#workflow">
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

  useEffect(() => {
    let animationFrameId: number
    let isHovering = false
    let isDragging = false
    let startX = 0
    let startY = 0

    let targetRotYLeft = 0
    let targetRotXLeft = 0
    let targetRotYRight = 0
    let targetRotXRight = 0

    let currentRotYLeft = 0
    let currentRotXLeft = 0
    let currentRotYRight = 0
    let currentRotXRight = 0

    const isMobile = window.innerWidth <= 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderLoop = () => {
      // Silky-smooth linear interpolation (lerp) for 360-degree interactive rotation
      currentRotYLeft += (targetRotYLeft - currentRotYLeft) * 0.08
      currentRotXLeft += (targetRotXLeft - currentRotXLeft) * 0.08
      currentRotYRight += (targetRotYRight - currentRotYRight) * 0.08
      currentRotXRight += (targetRotXRight - currentRotXRight) * 0.08

      if (phoneLeftBoxRef.current) {
        phoneLeftBoxRef.current.style.transform = prefersReducedMotion
          ? 'rotateX(0deg) rotateY(0deg)'
          : `rotateX(${currentRotXLeft}deg) rotateY(${currentRotYLeft}deg)`
      }

      if (phoneRightBoxRef.current) {
        phoneRightBoxRef.current.style.transform = prefersReducedMotion
          ? 'rotateX(0deg) rotateY(0deg)'
          : `rotateX(${currentRotXRight}deg) rotateY(${currentRotYRight}deg)`
      }

      animationFrameId = requestAnimationFrame(renderLoop)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || prefersReducedMotion) return
      if (!stageRef.current) return

      const rect = stageRef.current.getBoundingClientRect()
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (isInside || isDragging) {
        isHovering = true
        const relativeX = e.clientX - rect.left - rect.width / 2
        const relativeY = e.clientY - rect.top - rect.height / 2

        if (isDragging) {
          const deltaX = e.clientX - startX
          const deltaY = e.clientY - startY
          targetRotYLeft += deltaX * 0.8
          targetRotXLeft -= deltaY * 0.5
          targetRotYRight += deltaX * 0.8
          targetRotXRight -= deltaY * 0.5
          startX = e.clientX
          startY = e.clientY
        } else {
          // Full 360-degree cursor rotation mapping across 3D stage
          const normX = relativeX / (rect.width / 2)
          const normY = relativeY / (rect.height / 2)
          targetRotYLeft = normX * 180
          targetRotXLeft = -normY * 35
          targetRotYRight = normX * 180 + 10
          targetRotXRight = -normY * 35
        }
      } else if (isHovering && !isDragging) {
        isHovering = false
        // Smooth return to straight initial position (0deg X, 0deg Y)
        targetRotYLeft = 0
        targetRotXLeft = 0
        targetRotYRight = 0
        targetRotXRight = 0
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (isMobile || !stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        isDragging = true
        startX = e.clientX
        startY = e.clientY
      }
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })

    animationFrameId = requestAnimationFrame(renderLoop)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
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
            <Sparkles size={14} /> Move cursor or drag to rotate 3D phones 360°
          </div>
        </div>

        <div ref={stageRef} className="phones-3d-stage">
          <div className="phone-glow-bg" />

          {/* PHONE 1 — DIABETIC RETINOPATHY SCORE */}
          <div className="phone-wrapper phone-left">
            <div ref={phoneLeftBoxRef} className="phone-3d-box">
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
                      <img src="/live-analysis-fundus.jpg" alt="Retinal fundus scan preview" />
                      <div className="scan-pulse" />
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      3 microaneurysms detected in peripheral quadrant
                    </div>
                  </div>

                  <button className="phone-btn">
                    View Clinical Report <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* BACK FACE (White Glass & Pro Camera Visor - Matching Reference Image) */}
              <div className="phone-face phone-back">
                <div className="phone-camera-module">
                  <div className="pro-lens lens-one">
                    <span className="lens-aperture" />
                  </div>
                  <div className="pro-lens lens-two">
                    <span className="lens-aperture" />
                  </div>
                  <div className="pro-lens lens-three">
                    <span className="lens-aperture" />
                  </div>
                  <div className="sensor-cluster">
                    <span className="flash-dot" />
                    <span className="lidar-dot" />
                  </div>
                </div>
                <div className="phone-back-emblem">
                  <Eye size={32} />
                  <span>NETRIKA</span>
                </div>
              </div>

              {/* METALLIC EDGES */}
              <div className="phone-face phone-edge-left">
                <div className="side-btn button-vol-up" />
                <div className="side-btn button-vol-down" />
              </div>
              <div className="phone-face phone-edge-right">
                <div className="side-btn button-power" />
              </div>
              <div className="phone-face phone-edge-top" />
              <div className="phone-face phone-edge-bottom">
                <span className="speaker-grill" />
                <span className="usbc-port" />
                <span className="speaker-grill" />
              </div>
            </div>
          </div>

          {/* PHONE 2 — HEALTH / ANALYTICS TRENDS */}
          <div className="phone-wrapper phone-right">
            <div ref={phoneRightBoxRef} className="phone-3d-box">
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

              {/* BACK FACE (White Glass & Pro Camera Visor - Matching Reference Image) */}
              <div className="phone-face phone-back">
                <div className="phone-camera-module">
                  <div className="pro-lens lens-one">
                    <span className="lens-aperture" />
                  </div>
                  <div className="pro-lens lens-two">
                    <span className="lens-aperture" />
                  </div>
                  <div className="pro-lens lens-three">
                    <span className="lens-aperture" />
                  </div>
                  <div className="sensor-cluster">
                    <span className="flash-dot" />
                    <span className="lidar-dot" />
                  </div>
                </div>
                <div className="phone-back-emblem">
                  <Eye size={32} />
                  <span>NETRIKA</span>
                </div>
              </div>

              {/* METALLIC EDGES */}
              <div className="phone-face phone-edge-left">
                <div className="side-btn button-vol-up" />
                <div className="side-btn button-vol-down" />
              </div>
              <div className="phone-face phone-edge-right">
                <div className="side-btn button-power" />
              </div>
              <div className="phone-face phone-edge-top" />
              <div className="phone-face phone-edge-bottom">
                <span className="speaker-grill" />
                <span className="usbc-port" />
                <span className="speaker-grill" />
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

function ScreeningWorkspace() {
  const [scanState, setScanState] = useState<ScanState>('ready')
  const [mode, setMode] = useState<ViewMode>('original')
  const [reviewOpen, setReviewOpen] = useState(false)

  const start = () => {
    setScanState('analyzing')
    window.setTimeout(() => setScanState('complete'), 2200)
  }

  return (
    <section className="workspace-section" id="workflow">
      <div className="wrap">
        <div className="workspace-title">
          <div>
            <div className="section-label teal-label">Netrika workspace</div>
            <h2>New screening</h2>
            <p>Upload a retinal image to begin AI-assisted screening.</p>
          </div>
          <span className="demo-badge">
            <span className="live-dot" /> Demo mode
          </span>
        </div>
        <div className="workspace-grid">
          <aside className="workspace-panel upload-panel">
            <div className="panel-top">
              <span>01 / INPUT</span>
              <CircleHelp size={16} />
            </div>
            <h3>Retinal image</h3>
            <div className="upload-box">
              <div className="upload-icon">
                <FileImage />
              </div>
              <strong>
                {scanState === 'ready'
                  ? 'Upload retinal image'
                  : scanState === 'analyzing'
                  ? 'Reviewing image...'
                  : 'Image received'}
              </strong>
              <p>
                {scanState === 'ready'
                  ? 'Drag and drop a fundus image here or browse from your device.'
                  : scanState === 'analyzing'
                  ? 'Checking quality and visual signals'
                  : 'OD · 45° · 2048 × 2048 px'}
              </p>
              {scanState === 'ready' && (
                <>
                  <button className="button button-outline" onClick={start}>
                    <UploadCloud size={15} /> Browse files
                  </button>
                  <button className="sample-link" onClick={start}>
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
                <div className="complete">
                  <Check size={15} /> Image quality: Gradable
                </div>
              )}
            </div>
            <div className="panel-meta">
              <span>
                <ShieldCheck size={13} /> Secure workflow
              </span>
              <span>JPG · PNG</span>
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
              <RetinaVisual mode={mode} />
              {scanState === 'ready' && (
                <div className="viewer-message">
                  <ScanLine size={24} />
                  <span>Start a screening to analyze this image</span>
                </div>
              )}
            </div>
            <div className="mode-tabs" role="tablist" aria-label="Retinal image view">
              <button className={mode === 'original' ? 'active' : ''} onClick={() => setMode('original')}>
                Original
              </button>
              <button className={mode === 'gradcam' ? 'active' : ''} onClick={() => setMode('gradcam')}>
                Grad-CAM
              </button>
              <button className={mode === 'overlay' ? 'active' : ''} onClick={() => setMode('overlay')}>
                Overlay
              </button>
            </div>
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
            ) : (
              <div className="result-content">
                <div className="result-level">
                  <span>LEVEL 2</span>
                  <strong>Moderate DR</strong>
                  <em>REFERABLE DR</em>
                </div>
                <div className="confidence">
                  <span>AI confidence</span>
                  <strong>94.2%</strong>
                  <div>
                    <i />
                  </div>
                </div>
                <div className="result-disclaimer">AI prediction, not a medical certainty.</div>
                <button className="button button-teal full" onClick={() => setReviewOpen(true)}>
                  Review case <ArrowRight size={15} />
                </button>
              </div>
            )}
          </aside>
        </div>

        {scanState === 'complete' && (
          <div className="evidence-section">
            <div className="evidence-heading">
              <div className="section-label teal-label">Supporting retinal evidence</div>
              <h3>Why did the AI predict this?</h3>
              <p>Highlighted regions indicate areas that contributed most strongly to the model&apos;s prediction.</p>
            </div>
            <div className="evidence-cards">
              {evidence.map((item) => (
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

      {reviewOpen && (
        <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title">
          <div className="review-card">
            <button className="close-modal" onClick={() => setReviewOpen(false)} aria-label="Close review">
              <X />
            </button>
            <div className="section-label teal-label">Clinical review</div>
            <h3 id="review-title">Ophthalmologist assessment</h3>
            <p>AI results support clinical review; the final assessment always belongs to a qualified professional.</p>
            <label>
              Final DR level
              <select defaultValue="2">
                <option value="0">Level 0 · No DR</option>
                <option value="1">Level 1 · Mild</option>
                <option value="2">Level 2 · Moderate</option>
                <option value="3">Level 3 · Severe</option>
                <option value="4">Level 4 · Proliferative</option>
              </select>
            </label>
            <label>
              Clinical notes
              <textarea placeholder="Add observations or follow-up guidance" />
            </label>
            <button className="button button-teal full" onClick={() => setReviewOpen(false)}>
              Submit clinical review <Check size={15} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function Dashboard() {
  const cases = [
    { id: 'NT-1024', level: 'Level 3', confidence: '91.8%', status: 'Referable', priority: 'High priority' },
    { id: 'NT-1023', level: 'Level 1', confidence: '88.4%', status: 'Non-referable', priority: 'Normal review' },
    { id: 'NT-1022', level: 'Level 2', confidence: '94.2%', status: 'Referable', priority: 'Pending' },
  ]

  return (
    <section className="dashboard wrap" id="report">
      <div>
        <div className="section-label">At a glance</div>
        <h2>Screening overview</h2>
      </div>
      <div className="dashboard-stats">
        <div>
          <strong>24</strong>
          <span>Screened today</span>
        </div>
        <div>
          <strong>5</strong>
          <span>Referable cases</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Pending review</span>
        </div>
        <div>
          <strong>2</strong>
          <span>Ungradable</span>
        </div>
      </div>
      <div className="cases-card">
        <div className="cases-head">
          <div>
            <h3>Cases awaiting review</h3>
            <p>Prioritized for ophthalmologist review</p>
          </div>
          <button className="button button-dark small">
            View all <ChevronRight size={15} />
          </button>
        </div>
        <div className="case-row case-header">
          <span>Case ID</span>
          <span>AI level</span>
          <span>Confidence</span>
          <span>Status</span>
          <span>Review</span>
        </div>
        {cases.map((c) => (
          <div className="case-row" key={c.id}>
            <span>{c.id}</span>
            <span>{c.level}</span>
            <span>{c.confidence}</span>
            <span className="status-text">{c.status}</span>
            <span className="priority-text">{c.priority}</span>
          </div>
        ))}
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
          <a href="#workflow">Privacy</a>
          <a href="#top">
            Back to top <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  return (
    <main>
      <Hero />
      <MobileScreeningShowcase />
      <Workflow />
      <ScreeningWorkspace />
      <Dashboard />
      <Footer />
    </main>
  )
}
