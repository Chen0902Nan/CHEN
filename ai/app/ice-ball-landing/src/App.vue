<script setup>
const metrics = [
  { value: '1 upload', label: 'to kick off a full campaign pack' },
  { value: '4 styles', label: 'from editorial realism to bold poster art' },
  { value: 'Same day', label: 'turnaround for launch-ready visuals' },
]

const features = [
  {
    tag: 'Creative Control',
    title: 'Direct the visual language without opening a design tool.',
    text: 'Choose style, kit details, number, and player role in one simple flow while keeping every output on-brand.',
  },
  {
    tag: 'Fast Delivery',
    title: 'Go from upload to publishable assets in minutes.',
    text: 'IceBall AI compresses the slowest parts of content production so teams can launch campaigns while momentum is hot.',
  },
  {
    tag: 'Brand Consistency',
    title: 'Keep every drop polished across social, web, and sponsor decks.',
    text: 'Use one source photo to produce a coordinated family of visuals instead of stitching together mismatched edits.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Upload a player portrait',
    text: 'Start with a single image from a phone, camera roll, or media-day archive.',
  },
  {
    step: '02',
    title: 'Set identity and style',
    text: 'Dial in jersey number, color, position, dominant hand, and art direction for the campaign.',
  },
  {
    step: '03',
    title: 'Ship the creative pack',
    text: 'Download social-ready visuals for roster reveals, season promos, and sponsor-friendly storytelling.',
  },
]

const useCases = [
  {
    title: 'Roster reveals',
    text: 'Create a cohesive player-introduction series that feels bigger than a standard template drop.',
  },
  {
    title: 'Youth programs',
    text: 'Give developing athletes something dramatic, fun, and shareable without booking another photo shoot.',
  },
  {
    title: 'Creator campaigns',
    text: 'Package athlete visuals into thumbnails, posters, and social sequences that still feel custom.',
  },
]

const audiences = ['Clubs', 'Leagues', 'Academies', 'Creators']
</script>

<template>
  <div class="page-shell">
    <header class="topbar reveal">
      <a class="brand" href="#hero">
        <span class="brand-mark">IA</span>
        <span>IceBall AI</span>
      </a>

      <nav class="nav">
        <a href="#features">Features</a>
        <a href="#workflow">Workflow</a>
        <a href="#stories">Use Cases</a>
        <a href="#cta">Access</a>
      </nav>

      <a class="ghost-link" href="#cta">Request Access</a>
    </header>

    <main>
      <section id="hero" class="hero reveal">
        <div class="hero-copy">
          <p class="eyebrow">AI portrait studio for sports brands and modern teams</p>
          <h1>Turn one player photo into a full campaign of athlete visuals.</h1>
          <p class="hero-text">
            IceBall AI helps teams, leagues, and creators generate premium portraits,
            social assets, and launch graphics without another expensive production day.
          </p>

          <div class="hero-actions">
            <a class="primary-button" href="#cta">Start your first drop</a>
            <a class="secondary-button" href="#workflow">See the workflow</a>
          </div>

          <ul class="hero-points">
            <li>Upload once and generate multiple art directions</li>
            <li>Control uniform details, number, role, and overall mood</li>
            <li>Export polished visuals built for modern sports storytelling</li>
          </ul>

          <div class="stats">
            <article
              v-for="metric in metrics"
              :key="metric.label"
              class="stat-card"
            >
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </article>
          </div>
        </div>

        <div class="hero-visual">
          <div class="orb orb-orange"></div>
          <div class="orb orb-blue"></div>
          <div class="orb orb-green"></div>

          <div class="dashboard-card">
            <div class="dashboard-top">
              <span class="pill">Campaign Session</span>
              <span class="score">4 outputs queued</span>
            </div>

            <div class="preview-grid">
              <article class="preview-card">
                <span class="preview-label">Source</span>
                <div class="portrait portrait-source"></div>
                <div class="mini-meta">
                  <span>Player portrait</span>
                  <span>single upload</span>
                </div>
              </article>

              <article class="preview-card preview-card-accent">
                <span class="preview-label">Generated</span>
                <div class="portrait portrait-generated"></div>
                <div class="mini-meta">
                  <span>Poster treatment</span>
                  <span>launch-ready</span>
                </div>
              </article>
            </div>

            <div class="control-board">
              <div class="control-chip">
                <span>Uniform</span>
                <strong>#10 Away Navy</strong>
              </div>
              <div class="control-chip">
                <span>Role</span>
                <strong>Forward</strong>
              </div>
              <div class="control-chip">
                <span>Style</span>
                <strong>Editorial Realism</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="audience-band reveal">
        <p class="band-label">Designed for</p>
        <div class="audience-list">
          <span v-for="audience in audiences" :key="audience">{{ audience }}</span>
        </div>
      </section>

      <section id="features" class="content-section">
        <div class="section-heading reveal">
          <p class="eyebrow">What makes it different</p>
          <h2>Brand-consistent creative without slow production cycles.</h2>
          <p>
            Built for teams that want bold visuals fast, while still keeping creative
            direction under control.
          </p>
        </div>

        <div class="feature-grid">
          <article
            v-for="(feature, index) in features"
            :key="feature.title"
            class="feature-card reveal"
            :style="{ '--delay': `${index * 120}ms` }"
          >
            <p class="card-tag">{{ feature.tag }}</p>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </article>
        </div>
      </section>

      <section id="workflow" class="content-section workflow-section">
        <div class="section-heading reveal">
          <p class="eyebrow">Workflow</p>
          <h2>A simple three-step system for high-impact athlete content.</h2>
          <p>
            The experience stays lightweight for marketers, creators, and coaches who
            need visuals without learning a complex creative stack.
          </p>
        </div>

        <div class="workflow-grid">
          <article
            v-for="(step, index) in steps"
            :key="step.step"
            class="workflow-card reveal"
            :style="{ '--delay': `${index * 140}ms` }"
          >
            <span class="step-index">{{ step.step }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </article>
        </div>
      </section>

      <section id="stories" class="content-section story-section">
        <div class="story-layout">
          <div class="story-copy reveal">
            <p class="eyebrow">Use Cases</p>
            <h2>Made for moments when teams need visual energy immediately.</h2>
            <p>
              Whether you are launching a season, highlighting athletes, or creating a
              shareable community moment, the product is built to help creative teams
              move with confidence.
            </p>

            <div class="use-case-list">
              <article
                v-for="(useCase, index) in useCases"
                :key="useCase.title"
                class="use-case-card reveal"
                :style="{ '--delay': `${index * 120}ms` }"
              >
                <h3>{{ useCase.title }}</h3>
                <p>{{ useCase.text }}</p>
              </article>
            </div>
          </div>

          <aside class="quote-card reveal">
            <p class="quote">
              "IceBall AI gives small teams a way to look like they hired an entire
              campaign studio."
            </p>
            <div class="quote-meta">
              <strong>Creative operations</strong>
              <span>for sports-first launches and fan engagement</span>
            </div>
            <div class="quote-strip">
              <span>Social-first sizing</span>
              <span>Fast art direction</span>
              <span>Shareable outputs</span>
            </div>
          </aside>
        </div>
      </section>

      <section id="cta" class="content-section cta-section reveal">
        <div class="cta-card">
          <div class="cta-copy">
            <p class="eyebrow">Launch faster</p>
            <h2>Build your next athlete campaign with IceBall AI.</h2>
            <p>
              Generate hero art, roster drops, sponsor-ready visuals, and fan-shareable
              portraits from a single upload flow.
            </p>
          </div>

          <div class="cta-actions">
            <a class="primary-button" href="mailto:hello@iceball.ai">Request early access</a>
            <a class="secondary-button" href="#hero">View product preview</a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <span>IceBall AI</span>
      <span>AI visuals for teams, leagues, and creators.</span>
    </footer>
  </div>
</template>

<style scoped>
.page-shell {
  position: relative;
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 24px 0 48px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  margin-top: 8px;
  background: rgba(250, 249, 245, 0.78);
  border: 1px solid rgba(20, 20, 19, 0.08);
  border-radius: 999px;
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 40px rgba(20, 20, 19, 0.06);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: 0.04em;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--accent-orange), var(--accent-blue));
  color: var(--color-light);
  font-size: 0.9rem;
}

.nav {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  color: var(--color-muted);
}

.nav a,
.ghost-link {
  position: relative;
  transition: color 180ms ease;
}

.nav a:hover,
.ghost-link:hover {
  color: var(--color-dark);
}

.ghost-link {
  font-family: var(--font-heading);
  font-size: 0.95rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 48px;
  align-items: center;
  padding: 88px 0 56px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.eyebrow {
  margin: 0;
  color: var(--accent-orange);
  font-family: var(--font-heading);
  font-size: 0.86rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero h1,
.section-heading h2,
.cta-copy h2 {
  margin: 0;
  font-size: clamp(3rem, 7vw, 5.4rem);
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.section-heading h2,
.cta-copy h2 {
  font-size: clamp(2.2rem, 4vw, 3.4rem);
}

.hero-text,
.section-heading p,
.cta-copy p,
.story-copy > p:nth-of-type(2) {
  margin: 0;
  max-width: 62ch;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-muted);
}

.hero-actions,
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 24px;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-size: 0.98rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease,
    color 180ms ease;
}

.primary-button {
  background: var(--color-dark);
  color: var(--color-light);
  box-shadow: 0 16px 36px rgba(20, 20, 19, 0.18);
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 40px rgba(20, 20, 19, 0.22);
}

.secondary-button {
  border: 1px solid rgba(20, 20, 19, 0.12);
  background: rgba(250, 249, 245, 0.72);
}

.secondary-button:hover {
  background: rgba(232, 230, 220, 0.92);
  transform: translateY(-1px);
}

.hero-points {
  display: grid;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
  color: var(--color-dark);
}

.hero-points li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
}

.hero-points li::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--accent-green);
  box-shadow: 18px 0 0 rgba(120, 140, 93, 0.2);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 6px;
}

.stat-card,
.feature-card,
.workflow-card,
.use-case-card,
.quote-card,
.cta-card,
.audience-band,
.dashboard-card {
  border: 1px solid rgba(20, 20, 19, 0.08);
  box-shadow: 0 18px 44px rgba(20, 20, 19, 0.08);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(250, 249, 245, 0.76);
}

.stat-card strong {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 700;
}

.stat-card span {
  font-size: 0.96rem;
  color: var(--color-muted);
  line-height: 1.6;
}

.hero-visual {
  position: relative;
  min-height: 660px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(24px);
  opacity: 0.72;
}

.orb-orange {
  top: 6%;
  right: 12%;
  width: 180px;
  height: 180px;
  background: rgba(217, 119, 87, 0.3);
}

.orb-blue {
  bottom: 8%;
  left: 4%;
  width: 220px;
  height: 220px;
  background: rgba(106, 155, 204, 0.26);
}

.orb-green {
  top: 32%;
  left: 8%;
  width: 130px;
  height: 130px;
  background: rgba(120, 140, 93, 0.24);
}

.dashboard-card {
  position: relative;
  width: min(100%, 520px);
  padding: 24px;
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(250, 249, 245, 0.92), rgba(250, 249, 245, 0.74)),
    linear-gradient(135deg, rgba(217, 119, 87, 0.08), rgba(106, 155, 204, 0.08));
  backdrop-filter: blur(16px);
}

.dashboard-top,
.mini-meta,
.quote-meta,
.quote-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.pill,
.score,
.preview-label,
.card-tag,
.step-index {
  font-family: var(--font-heading);
}

.pill,
.score,
.preview-label {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pill {
  color: var(--accent-orange);
}

.score {
  color: var(--color-muted);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 20px;
}

.preview-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.52);
}

.preview-card-accent {
  background:
    linear-gradient(180deg, rgba(20, 20, 19, 0.94), rgba(20, 20, 19, 0.86)),
    var(--color-dark);
  color: var(--color-light);
}

.preview-card-accent .mini-meta {
  color: rgba(250, 249, 245, 0.78);
}

.portrait {
  aspect-ratio: 4 / 5;
  border-radius: 22px;
}

.portrait-source {
  background:
    radial-gradient(circle at 50% 24%, rgba(250, 249, 245, 0.84), rgba(250, 249, 245, 0) 26%),
    linear-gradient(180deg, rgba(176, 174, 165, 0.28), rgba(20, 20, 19, 0.1)),
    linear-gradient(135deg, rgba(232, 230, 220, 0.9), rgba(176, 174, 165, 0.65));
}

.portrait-generated {
  background:
    radial-gradient(circle at 50% 18%, rgba(250, 249, 245, 0.48), rgba(250, 249, 245, 0) 22%),
    linear-gradient(180deg, rgba(217, 119, 87, 0.68), rgba(20, 20, 19, 0.22)),
    linear-gradient(135deg, rgba(106, 155, 204, 0.94), rgba(20, 20, 19, 0.92));
}

.mini-meta {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.control-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.control-chip {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.44);
}

.control-chip span {
  color: var(--color-muted);
  font-size: 0.9rem;
}

.control-chip strong {
  font-family: var(--font-heading);
  font-size: 0.96rem;
}

.audience-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 28px;
  border-radius: 30px;
  background: rgba(232, 230, 220, 0.58);
}

.band-label {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.audience-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.audience-list span,
.quote-strip span {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(250, 249, 245, 0.82);
  font-family: var(--font-heading);
  font-size: 0.92rem;
}

.content-section {
  padding: 88px 0 0;
}

.section-heading {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 760px;
}

.feature-grid,
.workflow-grid,
.use-case-list {
  display: grid;
  gap: 20px;
  margin-top: 34px;
}

.feature-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.workflow-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.feature-card,
.workflow-card,
.use-case-card {
  padding: 28px;
  border-radius: 28px;
  background: rgba(250, 249, 245, 0.8);
  animation: fade-up 700ms ease both;
  animation-delay: var(--delay, 0ms);
}

.feature-card:nth-child(2),
.workflow-card:nth-child(2),
.use-case-card:nth-child(2) {
  background: rgba(232, 230, 220, 0.76);
}

.feature-card:nth-child(3),
.use-case-card:nth-child(3) {
  background: rgba(250, 249, 245, 0.68);
}

.card-tag,
.step-index {
  display: inline-flex;
  margin-bottom: 22px;
  color: var(--accent-orange);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.feature-card h3,
.workflow-card h3,
.use-case-card h3,
.story-copy h2,
.quote {
  margin: 0 0 12px;
  font-family: var(--font-heading);
}

.feature-card h3,
.workflow-card h3,
.use-case-card h3,
.story-copy h2 {
  font-size: 1.5rem;
  line-height: 1.15;
}

.feature-card p,
.workflow-card p,
.use-case-card p,
.quote-meta span {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.8;
}

.story-section {
  padding-bottom: 88px;
}

.story-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 24px;
  align-items: start;
}

.story-copy {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quote-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  border-radius: 32px;
  background:
    linear-gradient(180deg, rgba(20, 20, 19, 0.96), rgba(20, 20, 19, 0.92)),
    var(--color-dark);
  color: var(--color-light);
}

.quote {
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  line-height: 1.18;
}

.quote-meta {
  align-items: flex-start;
  flex-direction: column;
  color: rgba(250, 249, 245, 0.78);
}

.quote-meta strong {
  font-family: var(--font-heading);
  font-size: 1rem;
  color: var(--color-light);
}

.quote-strip {
  flex-wrap: wrap;
  justify-content: flex-start;
}

.quote-strip span {
  background: rgba(250, 249, 245, 0.08);
  color: rgba(250, 249, 245, 0.82);
}

.cta-section {
  padding-top: 0;
}

.cta-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 36px;
  border-radius: 34px;
  background:
    radial-gradient(circle at top right, rgba(106, 155, 204, 0.22), transparent 34%),
    radial-gradient(circle at bottom left, rgba(217, 119, 87, 0.18), transparent 30%),
    rgba(232, 230, 220, 0.82);
}

.cta-copy {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 720px;
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 32px 0 12px;
  color: var(--color-muted);
  font-size: 0.94rem;
}

.reveal {
  animation: fade-up 720ms ease both;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1080px) {
  .page-shell {
    width: min(100% - 32px, 1200px);
  }

  .hero,
  .story-layout,
  .cta-card {
    grid-template-columns: 1fr;
  }

  .hero {
    gap: 36px;
  }

  .hero-visual {
    min-height: auto;
  }

  .feature-grid,
  .workflow-grid {
    grid-template-columns: 1fr;
  }

  .cta-card {
    display: grid;
  }
}

@media (max-width: 820px) {
  .topbar,
  .audience-band,
  .footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav {
    flex-wrap: wrap;
    gap: 14px;
  }

  .stats,
  .preview-grid,
  .control-board {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 60px;
  }

  .dashboard-card,
  .feature-card,
  .workflow-card,
  .use-case-card,
  .quote-card,
  .cta-card {
    border-radius: 26px;
  }
}

@media (max-width: 520px) {
  .page-shell {
    width: min(100% - 20px, 1200px);
    padding-top: 12px;
  }

  .topbar {
    padding: 16px 18px;
    border-radius: 28px;
  }

  .hero,
  .content-section,
  .story-section {
    padding-top: 54px;
  }

  .cta-card {
    padding: 24px;
  }

  .hero h1,
  .section-heading h2,
  .cta-copy h2,
  .story-copy h2 {
    letter-spacing: -0.04em;
  }
}
</style>
