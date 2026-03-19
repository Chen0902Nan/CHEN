import { useEffect, useEffectEvent, useState } from 'react'
import './App.css'

const stageModes = [
  {
    id: 'chrome',
    label: 'Chrome',
    eyebrow: 'Mirror authority',
    title: 'Cold mirror. Warm signal.',
    description:
      'Liquid silver surfaces, razor-serif copy, and a stage light that turns the whole page into a launch poster instead of another bland product site.',
    tags: ['liquid metal', 'editorial tension', 'signal orange'],
    pulse: '09',
    callout: 'Mirror drive engaged',
  },
  {
    id: 'ember',
    label: 'Ember',
    eyebrow: 'Incendiary tempo',
    title: 'Industrial heat under blackout glass.',
    description:
      'The same composition pushed through burnt copper, furnace glow, and late-night energy, like the teaser for a machine only shown after dark.',
    tags: ['copper burn', 'after-hours energy', 'furnace glow'],
    pulse: '17',
    callout: 'Heat signature rising',
  },
  {
    id: 'signal',
    label: 'Signal',
    eyebrow: 'Broadcast shock',
    title: 'Emergency accents with luxury discipline.',
    description:
      'Sharper warnings, colder highlights, and a more electric atmosphere for moments that need urgency without sliding into chaos.',
    tags: ['broadcast red', 'clean geometry', 'live transmission'],
    pulse: '24',
    callout: 'Transmission line hot',
  },
] as const

const pillars = [
  {
    index: 'A1',
    title: 'Poster-first composition',
    copy: 'The desktop layout behaves like a campaign visual with oversized type, stacked depth, and blocks that intentionally break the grid.',
  },
  {
    index: 'A2',
    title: 'Motion that earns its place',
    copy: 'A drifting spotlight, moving ticker, orbital rings, and floating notes create rhythm without turning the page into a toy.',
  },
  {
    index: 'A3',
    title: 'Responsive without losing attitude',
    copy: 'On small screens the spectacle compresses into a sharp dossier, so the energy survives mobile instead of collapsing into generic cards.',
  },
]

const chapters = [
  {
    index: '01',
    time: '19:00',
    length: '08 min',
    title: 'Front Row Briefing',
    copy: 'An opening frame that feels like a fashion-tech invitation: controlled typography, metallic labels, and a hard-edged first impression.',
  },
  {
    index: '02',
    time: '19:12',
    length: '14 min',
    title: 'Runway Systems',
    copy: 'The main showcase introduces the living color modes, hover reactions, layered glass panels, and the central orbital control piece.',
  },
  {
    index: '03',
    time: '19:28',
    length: '11 min',
    title: 'Artifact Gallery',
    copy: 'A broken-grid composition for the feature story blocks so every module feels designed, not duplicated from a template kit.',
  },
  {
    index: '04',
    time: '19:43',
    length: '05 min',
    title: 'Closing Signal',
    copy: 'The ending section resolves the page with a direct delivery message: this ships as a standalone project and leaves existing work untouched.',
  },
]

const artifacts = [
  {
    layout: 'wide featured',
    label: 'Hero system',
    title: 'A first fold built like a trailer frame.',
    copy: 'Big editorial typography on the left, interactive stage machinery on the right, and enough negative space to make the entire page breathe like a premium campaign.',
    tag: 'Launch impact',
  },
  {
    layout: 'tall',
    label: 'Typeface stack',
    title: 'Expanded grotesk meets knife-edge serif.',
    copy: 'Archivo Expanded brings force, Bodoni Moda delivers elegance, and IBM Plex Mono handles the system language without feeling sterile.',
    tag: 'Typographic contrast',
  },
  {
    layout: '',
    label: 'Lighting rig',
    title: 'Pointer-reactive spotlight.',
    copy: 'The background subtly follows the cursor to create a moving pool of light across the page without needing heavy JavaScript.',
    tag: 'Live atmosphere',
  },
  {
    layout: 'wide',
    label: 'Asymmetry',
    title: 'Broken-grid cards instead of cloned components.',
    copy: 'The detail area uses uneven spans, layered glow, and differentiated visual weight so each story block feels composed by hand.',
    tag: 'Layout personality',
  },
  {
    layout: '',
    label: 'Delivery',
    title: '0 legacy files touched.',
    copy: 'Everything here lives in its own Vite project folder, so your existing workspace stays exactly where it was.',
    tag: 'Safe integration',
  },
]

const metrics = [
  {
    value: '0',
    label: 'Original files touched',
    copy: 'The whole experiment sits in a separate project directory.',
  },
  {
    value: '3',
    label: 'Live stage modes',
    copy: 'Chrome, Ember, and Signal all reuse the same structure with different emotional temperature.',
  },
  {
    value: '100%',
    label: 'Responsive composition',
    copy: 'The layout adapts cleanly across desktop and mobile without flattening the concept.',
  },
  {
    value: '1',
    label: 'Standalone Vite app',
    copy: 'Easy to run, easy to extend, and isolated from the rest of your repo.',
  },
]

const marqueeItems = [
  'POST-LUXURY SYSTEMS',
  'EDITORIAL MOTION',
  'LIQUID METAL SURFACES',
  'RUNWAY-GRADE TYPOGRAPHY',
  'ZERO TEMPLATE ENERGY',
  'RESPONSIVE BY DESIGN',
]

function App() {
  const [activeMode, setActiveMode] = useState<(typeof stageModes)[number]['id']>(
    stageModes[0].id,
  )

  const currentMode =
    stageModes.find((mode) => mode.id === activeMode) ?? stageModes[0]

  const syncPointerLight = useEffectEvent((event: PointerEvent) => {
    document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
    document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
  })

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--pointer-x',
      `${window.innerWidth / 2}px`,
    )
    document.documentElement.style.setProperty(
      '--pointer-y',
      `${window.innerHeight * 0.3}px`,
    )

    const handlePointerMove = (event: PointerEvent) => {
      syncPointerLight(event)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <div className={`app theme-${activeMode}`}>
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="Chrome Noir home">
          <span>CN</span>
          <strong>Chrome Noir</strong>
        </a>

        <nav className="topnav" aria-label="Primary">
          <a href="#manifesto">Manifesto</a>
          <a href="#program">Program</a>
          <a href="#artifacts">Artifacts</a>
          <a href="#contact">Delivery</a>
        </nav>

        <a className="ghost-link" href="#contact">
          Reserve Access
        </a>
      </header>

      <main>
        <section className="hero section-shell" id="top">
          <div className="hero-copy">
            <p className="eyebrow">POST-LUXURY DIGITAL HOUSE / STANDALONE CONCEPT</p>

            <h1 className="hero-title">
              CHROME
              <span>noir</span>
              RUNWAY
            </h1>

            <p className="hero-lede">
              An unapologetically theatrical single-page experience built to feel
              like a launch poster: metallic surfaces, editorial type, moving
              light, and enough attitude to stay far away from the usual AI-site
              template look.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#artifacts">
                Enter the scene
              </a>
              <a className="button secondary" href="#program">
                View chapters
              </a>
            </div>

            <div className="mode-switch">
              <div className="mode-heading">
                <p className="mode-label">Stage modes</p>
                <p className="mode-copy">
                  Switch the lighting rig without losing the composition.
                </p>
              </div>

              <div className="mode-chips" role="tablist" aria-label="Stage modes">
                {stageModes.map((mode) => (
                  <button
                    key={mode.id}
                    className={`mode-chip ${
                      mode.id === activeMode ? 'is-active' : ''
                    }`}
                    type="button"
                    aria-pressed={mode.id === activeMode}
                    onClick={() => setActiveMode(mode.id)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-stage">
            <div className="showcase-panel">
              <div className="panel-top">
                <span>Edition 09 / Shanghai</span>
                <span>{currentMode.eyebrow}</span>
              </div>

              <div className="showcase-grid">
                <div className="orbital-display" aria-hidden="true">
                  <div className="orbital-ring ring-one" />
                  <div className="orbital-ring ring-two" />
                  <div className="orbital-ring ring-three" />
                  <div className="orbital-blip" />
                  <div className="orbital-core">
                    <div>
                      <span>Mode</span>
                      <strong>{currentMode.pulse}</strong>
                    </div>
                  </div>
                </div>

                <div className="showcase-copy">
                  <p className="mini-kicker">{currentMode.eyebrow}</p>
                  <h2>{currentMode.title}</h2>
                  <p className="showcase-text">{currentMode.description}</p>

                  <ul className="tag-row">
                    {currentMode.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="floating-note note-one">
              <span>Signal</span>
              <strong>{currentMode.callout}</strong>
              <p>The visual temperature changes instantly as you switch modes.</p>
            </div>

            <div className="floating-note note-two">
              <span>Delivery</span>
              <strong>Standalone build only.</strong>
              <p>No legacy code touched. Everything lives in a fresh project.</p>
            </div>
          </div>
        </section>

        <section className="marquee-band" aria-label="Ticker">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span aria-hidden={index >= marqueeItems.length} key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="manifesto section-shell" id="manifesto">
          <div className="section-heading">
            <p className="section-kicker">Design Logic</p>
            <h2>This page is trying to be remembered in one glance.</h2>
            <p className="section-note">
              Every decision leans into a single idea: a front page that behaves
              like a campaign visual, not a default product marketing template.
            </p>
          </div>

          <div className="manifesto-grid">
            {pillars.map((pillar) => (
              <article
                key={pillar.index}
                className="manifesto-card"
                data-index={pillar.index}
              >
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.copy}</p>
                </div>
                <div className="manifesto-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="program section-shell" id="program">
          <div className="program-header">
            <div className="section-heading">
              <p className="section-kicker">Program</p>
              <h2>Four deliberate chapters. No filler blocks.</h2>
            </div>

            <p className="section-note">
              The pacing moves from invitation to control panel to artifact
              gallery, then closes by making the delivery constraints crystal
              clear.
            </p>
          </div>

          <div className="program-grid">
            {chapters.map((chapter) => (
              <article key={chapter.index} className="program-card">
                <p className="program-index">{chapter.index}</p>
                <div className="program-meta">
                  <span>{chapter.time}</span>
                  <span>{chapter.length}</span>
                </div>
                <h3>{chapter.title}</h3>
                <p>{chapter.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="artifacts section-shell" id="artifacts">
          <div className="artifacts-copy">
            <div className="section-heading">
              <p className="section-kicker">Artifacts</p>
              <h2>The build details are part of the aesthetic.</h2>
            </div>

            <p className="section-note">
              Visual language, interaction, layout, and delivery choices all
              support the same promise: bold, premium, and clearly intentional.
            </p>
          </div>

          <div className="artifact-grid">
            {artifacts.map((artifact) => (
              <article
                key={`${artifact.label}-${artifact.title}`}
                className={`artifact-card ${artifact.layout}`.trim()}
              >
                <div className="artifact-meta">
                  <span>{artifact.label}</span>
                  <span>{artifact.tag}</span>
                </div>

                <div>
                  <h3>{artifact.title}</h3>
                  <p>{artifact.copy}</p>
                </div>

                <span className="artifact-pill">{artifact.tag}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="metrics section-shell">
          <div className="metric-grid">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.label}</p>
                <p className="metric-copy">{metric.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section-shell" id="contact">
          <div className="contact-panel">
            <div>
              <p className="section-kicker">Standalone Delivery</p>
              <h2>Built as a fresh project, so your existing code stays intact.</h2>
            </div>

            <div className="contact-actions">
              <p>
                This concept is packaged as its own React + Vite app inside
                <code> chrome-noir-showcase </code>
                so we can push the visuals hard without touching any of your
                current work.
              </p>

              <div className="command-chip">
                <span>Run locally</span>
                <code>npm run dev</code>
              </div>

              <div className="hero-actions">
                <a className="button primary" href="#top">
                  Back to hero
                </a>
                <a className="button secondary" href="#manifesto">
                  Review design
                </a>
              </div>
            </div>
          </div>

          <footer className="footer">
            <p>Chrome Noir concept landing page. React, Vite, responsive motion.</p>
            <p>Made as a separate project folder with zero interference to legacy work.</p>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
