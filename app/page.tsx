'use client'

import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Eye,
  FileCheck2,
  FileImage,
  Gauge,
  HeartPulse,
  Info,
  Layers3,
  Menu,
  Microscope,
  MoveRight,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react'

type ScanState = 'ready' | 'analyzing' | 'complete'
type ViewMode = 'original' | 'heatmap' | 'vessels'

const steps = [
  { icon: UploadCloud, title: 'Capture', copy: 'Upload a clear retinal image in seconds.' },
  { icon: BrainCircuit, title: 'Understand', copy: 'Our model checks anatomy and visual signals.' },
  { icon: Stethoscope, title: 'Act', copy: 'Share a confident next step with your care team.' },
]

const evidence = [
  ['Microaneurysm pattern', 'Strong signal', 'coral'],
  ['Vessel geometry', 'Within range', 'mint'],
  ['Image quality', 'Excellent', 'blue'],
]

function RetinalImage({ mode }: { mode: ViewMode }) {
  return (
    <div className={`retina-art ${mode}`} aria-label={`${mode} retinal scan visualization`} role="img">
      <div className="retina-glow" />
      <div className="retina-disc" />
      <div className="vessel vessel-a" />
      <div className="vessel vessel-b" />
      <div className="vessel vessel-c" />
      <div className="vessel vessel-d" />
      <div className="retina-speck speck-a" />
      <div className="retina-speck speck-b" />
      <div className="scan-ring" />
      {mode === 'heatmap' && <div className="heat-zone zone-a" />}
      {mode === 'heatmap' && <div className="heat-zone zone-b" />}
      {mode === 'vessels' && <div className="vessel-overlay" />}
      <div className="scan-corner corner-one" />
      <div className="scan-corner corner-two" />
      <div className="scan-corner corner-three" />
      <div className="scan-corner corner-four" />
    </div>
  )
}

function AppHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="RetinaCare home">
        <span className="brand-mark"><Eye size={19} strokeWidth={2.5} /></span>
        <span>Retina<span>Care</span><sup>AI</sup></span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#screening">Screening</a>
        <a href="#evidence">Evidence</a>
      </nav>
      <div className="header-actions">
        <button className="text-button" type="button">Sign in</button>
        <a className="button button-dark" href="#screening">Try screening <ArrowRight size={16} /></a>
      </div>
      <button className="menu-button" aria-label="Open navigation" type="button"><Menu /></button>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero section-shell" id="top">
      <div className="hero-copy reveal-up">
        <div className="eyebrow"><span className="pulse-dot" /> A clearer picture of eye health</div>
        <h1>See the signs<br /><em>before they grow.</em></h1>
        <p className="hero-lede">RetinaCare AI helps care teams screen retinal images with clarity, speed, and a little more confidence.</p>
        <div className="hero-actions">
          <a className="button button-coral" href="#screening">Start a screening <ArrowRight size={17} /></a>
          <a className="watch-link" href="#how-it-works"><span className="play-button"><Play size={13} fill="currentColor" /></span> See how it works</a>
        </div>
        <div className="privacy-note"><ShieldCheck size={17} /> Your images stay private and secure.</div>
      </div>
      <div className="hero-visual reveal-float" aria-hidden="true">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-card card-image">
          <div className="mini-label"><span className="status-dot" /> Live view</div>
          <RetinalImage mode="original" />
          <div className="image-meta"><span>Retinal scan</span><strong>OD · 45°</strong></div>
        </div>
        <div className="hero-card card-result">
          <div className="result-top"><span className="check-badge"><Check size={15} /></span><span>AI SCREENING</span><span className="result-time">08:42</span></div>
          <strong>Referable DR</strong>
          <div className="result-line"><span className="result-pill">Mild</span><span>Confidence</span><b>94%</b></div>
          <div className="confidence-track"><span /></div>
        </div>
        <div className="floating-chip chip-pulse"><HeartPulse size={16} /> Early signal found</div>
        <div className="floating-chip chip-spark"><Sparkles size={15} /> Explainable</div>
      </div>
    </section>
  )
}

function TrustStrip() {
  return <section className="trust-strip"><div className="section-shell trust-inner"><span>Designed for the moments that matter</span><div className="trust-items"><span><Zap size={15} /> Fast</span><span><Gauge size={15} /> Precise</span><span><ShieldCheck size={15} /> Private</span></div></div></section>
}

function HowItWorks() {
  return <section className="how-section section-shell" id="how-it-works"><div className="section-intro"><div className="eyebrow purple"><Sparkles size={15} /> A calmer workflow</div><h2>Less guessing.<br /><em>More seeing.</em></h2><p>Built to fit into the way your team already works, from first image to informed conversation.</p></div><div className="steps-grid">{steps.map((step, index) => { const Icon = step.icon; return <div className="step-card" key={step.title}><div className={`step-number number-${index}`}>0{index + 1}</div><div className="step-icon"><Icon size={23} /></div><h3>{step.title}</h3><p>{step.copy}</p><MoveRight className="step-arrow" size={20} /></div> })}</div></section>
}

function ScreeningWorkspace() {
  const [scanState, setScanState] = useState<ScanState>('ready')
  const [viewMode, setViewMode] = useState<ViewMode>('original')
  const [reviewed, setReviewed] = useState(false)

  function startScan() {
    setScanState('analyzing')
    window.setTimeout(() => setScanState('complete'), 2400)
  }

  return <section className="screening-section" id="screening"><div className="section-shell"><div className="workspace-heading"><div><div className="eyebrow coral"><Microscope size={15} /> Screening workspace</div><h2>A second set of eyes,<br /><em>right when you need it.</em></h2></div><div className="live-status"><span className="pulse-dot" /> Demo mode <ChevronDown size={14} /></div></div><div className="workspace"><div className="upload-panel"><div className="panel-head"><div><span className="panel-kicker">01 / INPUT</span><h3>Retinal image</h3></div><button className="icon-button" aria-label="More image options" type="button"><CircleHelp size={18} /></button></div><div className="upload-zone"><div className="upload-icon"><FileImage size={25} /></div><strong>{scanState === 'ready' ? 'Drop an image here' : scanState === 'analyzing' ? 'Reviewing image...' : 'Image reviewed'}</strong><span>{scanState === 'ready' ? 'or choose a sample to explore' : scanState === 'analyzing' ? 'Checking quality and visual signals' : 'OD · 45° · 2048 × 2048 px'}</span>{scanState === 'ready' && <button className="button button-outline" onClick={startScan} type="button">Use sample image <ArrowRight size={15} /></button>}{scanState === 'analyzing' && <div className="analyzing-line"><span /> Analysis in progress</div>}{scanState === 'complete' && <div className="complete-line"><Check size={16} /> Analysis complete</div>}</div><div className="panel-foot"><span><ShieldCheck size={14} /> HIPAA-ready workflow</span><span>JPG, PNG</span></div></div><div className="scan-panel"><div className="panel-head"><div><span className="panel-kicker">02 / ANALYSIS</span><h3>Visual signals</h3></div><div className="scan-badge"><span className="status-dot" /> {scanState === 'analyzing' ? 'Running' : scanState === 'complete' ? 'Complete' : 'Ready'}</div></div><div className="scan-view"><RetinalImage mode={viewMode} />{scanState === 'analyzing' && <div className="scan-sweep" />} {scanState === 'ready' && <div className="scan-overlay-label"><Play size={14} fill="currentColor" /> Start to analyze</div>}</div><div className="view-tabs" role="tablist" aria-label="Image view"><button className={viewMode === 'original' ? 'active' : ''} onClick={() => setViewMode('original')} type="button">Original</button><button className={viewMode === 'heatmap' ? 'active' : ''} onClick={() => setViewMode('heatmap')} type="button" disabled={scanState !== 'complete'}>Heatmap</button><button className={viewMode === 'vessels' ? 'active' : ''} onClick={() => setViewMode('vessels')} type="button" disabled={scanState !== 'complete'}>Vessels</button></div></div><div className={`insight-panel ${scanState === 'complete' ? 'is-complete' : ''}`}><div className="panel-head"><div><span className="panel-kicker">03 / INSIGHT</span><h3>Screening result</h3></div><Info size={18} className="muted-icon" /></div>{scanState !== 'complete' ? <div className="empty-insight"><div className="empty-icon"><Layers3 size={25} /></div><strong>Your result will appear here</strong><span>Run a sample screening to see the AI’s reasoning.</span></div> : <div className="result-content"><div className="big-result"><div className="result-status"><span className="check-badge"><Check size={16} /></span><span>Screening complete</span></div><strong>Referable DR</strong><p>Mild signs detected. Consider a follow-up with an eye care professional.</p></div><div className="metric-row"><div><span>Confidence</span><strong>94%</strong></div><div><span>Image quality</span><strong>Excellent</strong></div></div><button className={`button ${reviewed ? 'button-success' : 'button-dark'} full-button`} onClick={() => setReviewed(true)} type="button">{reviewed ? <><Check size={16} /> Added to review</> : <>Send to clinician review <ArrowRight size={16} /></>}</button></div>}</div></div>{scanState === 'complete' && <div className="evidence-row" id="evidence"><div className="evidence-heading"><Sparkles size={17} /><strong>What informed this result?</strong><span>Model evidence, made human-readable.</span></div>{evidence.map(([name, value, color]) => <div className={`evidence-card ${color}`} key={name}><div className="evidence-bar"><span /><span /><span /></div><strong>{name}</strong><span>{value}</span></div>)}</div>}</div></section>
}

function Footer() {
  return <footer className="footer section-shell"><div className="brand"><span className="brand-mark"><Eye size={19} strokeWidth={2.5} /></span><span>Retina<span>Care</span><sup>AI</sup></span></div><span>Built for a healthier tomorrow.</span><div className="footer-links"><a href="#how-it-works">How it works</a><a href="#screening">Privacy</a><a href="#screening">Contact</a></div></footer>
}

export default function Page() {
  return <main><AppHeader /><Hero /><TrustStrip /><HowItWorks /><ScreeningWorkspace /><Footer /></main>
}
