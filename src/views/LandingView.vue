<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import GeometryCanvas from '@/components/GeometryCanvas.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import LocaleToggle from '@/components/LocaleToggle.vue';
import { useLocale, useNow, usePrayerTimes } from '@/composables';
import { useHabitsStore } from '@/stores/habits';
import { vReveal } from '@/directives/reveal';

const { t } = useI18n();
const { isRtlLocale } = useLocale();

// The hero card shows the visitor's *own* next prayer, not a screenshot of
// someone else's. It's the fastest way to make the premise concrete: the app
// already knows something useful about your day before you sign up for
// anything.
const now = useNow(30_000);
const { nextPrayer, countdown, status, usingFallbackLocation, locationLabel, requestLocation } =
  usePrayerTimes(now);

const { habits } = useHabitsStore();
// Anyone with data already has an account in all but name — send them onward
// rather than pitching them the product they're using.
const isReturning = computed(() => habits.length > 0);

// "Onward" points the way the reader is already going.
const ctaArrow = computed(() =>
  isRtlLocale.value ? 'lucide:arrow-left' : 'lucide:arrow-right',
);

// Icon plus the key pair for its copy — the strings themselves live in the
// locale files, so adding a language doesn't mean touching this list.
const STEPS = [
  { icon: 'lucide:anchor', key: 'anchor' },
  { icon: 'lucide:feather', key: 'shrink' },
  { icon: 'lucide:git-commit-horizontal', key: 'chain' },
];

const FEATURES = [
  { icon: 'lucide:map-pin', key: 'times' },
  { icon: 'lucide:calendar-check', key: 'schedule' },
  { icon: 'lucide:trending-up', key: 'stats' },
  { icon: 'lucide:pause', key: 'pause' },
  { icon: 'lucide:moon-star', key: 'theme' },
  { icon: 'lucide:lock', key: 'privacy' },
];
</script>

<template>
  <div class="landing">
    <header class="landing-nav">
      <RouterLink to="/" class="brand">
        <span class="brand-dot" aria-hidden="true" />
        WirdStack
      </RouterLink>
      <nav class="landing-nav-links">
        <a href="#how" class="nav-link">{{ t('landing.howItWorks') }}</a>
        <a href="#features" class="nav-link">{{ t('landing.features') }}</a>
        <ThemeToggle />
        <LocaleToggle />
        <RouterLink to="/today" class="btn primary">
          {{ isReturning ? t('landing.openApp') : t('landing.startFree') }}
        </RouterLink>
      </nav>
    </header>

    <section class="hero">
      <GeometryCanvas :density="104" />

      <div class="hero-inner">
        <p class="hero-eyebrow rise" style="--i: 0">
          <Icon icon="lucide:sparkles" aria-hidden="true" />
          {{ t('landing.eyebrow') }}
        </p>

        <h1 class="text-display rise" style="--i: 1">
          {{ t('landing.headlineLead') }}<br />
          {{ t('landing.headlineRest') }} <em>{{ t('landing.headlineEmphasis') }}</em
          >.
        </h1>

        <p class="hero-lede rise text-body" style="--i: 2">{{ t('landing.lede') }}</p>

        <div class="hero-cta rise" style="--i: 3">
          <RouterLink to="/today" class="btn primary lg">
            {{ isReturning ? t('landing.ctaReturning') : t('landing.ctaFirst') }}
            <Icon :icon="ctaArrow" aria-hidden="true" />
          </RouterLink>
          <a href="#how" class="btn ghost lg">{{ t('landing.seeHow') }}</a>
        </div>

        <p class="hero-note rise text-caption" style="--i: 4">{{ t('landing.note') }}</p>

        <!-- Live, not a mockup. -->
        <div class="hero-card rise" style="--i: 5">
          <div class="hero-card-head">
            <span class="text-label">{{ t('landing.cardHead') }}</span>
            <span class="live-dot" aria-hidden="true" />
          </div>

          <template v-if="status === 'ready' && nextPrayer">
            <div class="hero-card-main">
              <span class="hero-prayer">{{ t(`prayers.${nextPrayer.prayer}`) }}</span>
              <span class="hero-time mono">{{ nextPrayer.time }}</span>
            </div>
            <p class="text-meta">
              {{ t('today.inTime', { time: countdown })
              }}{{ nextPrayer.isTomorrow ? ` · ${t('landing.cardTomorrow')}` : '' }} ·
              <button
                v-if="usingFallbackLocation"
                type="button"
                class="link-btn"
                @click="requestLocation"
              >
                {{ t('landing.cardFallback', { location: locationLabel }) }}
              </button>
              <span v-else>{{ locationLabel }}</span>
            </p>
          </template>

          <template v-else-if="status === 'error'">
            <p class="text-meta">{{ t('landing.cardOffline') }}</p>
          </template>

          <template v-else>
            <div class="hero-card-main">
              <span class="skeleton skeleton-lg" />
              <span class="skeleton skeleton-sm" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <section id="how" class="section">
      <div class="section-head">
        <p class="text-eyebrow" v-reveal>{{ t('landing.methodEyebrow') }}</p>
        <h2 class="text-headline" v-reveal="1">{{ t('landing.methodHeadline') }}</h2>
      </div>

      <ol class="steps">
        <li v-for="(step, i) in STEPS" :key="step.key" v-reveal="i" class="step">
          <span class="step-number mono">{{ String(i + 1).padStart(2, '0') }}</span>
          <Icon :icon="step.icon" class="step-icon" aria-hidden="true" />
          <h3 class="step-title">{{ t(`landing.steps.${step.key}Title`) }}</h3>
          <p class="text-meta">{{ t(`landing.steps.${step.key}Body`) }}</p>
        </li>
      </ol>
    </section>

    <section class="quote-section" v-reveal>
      <blockquote class="quote">
        <p class="quote-text">“{{ t('landing.quote') }}”</p>
        <footer class="quote-source text-caption">{{ t('landing.quoteSource') }}</footer>
      </blockquote>
    </section>

    <section id="features" class="section">
      <div class="section-head">
        <p class="text-eyebrow" v-reveal>{{ t('landing.featuresEyebrow') }}</p>
        <h2 class="text-headline" v-reveal="1">{{ t('landing.featuresHeadline') }}</h2>
      </div>

      <div class="feature-grid">
        <article
          v-for="(feature, i) in FEATURES"
          :key="feature.key"
          v-reveal="i % 3"
          class="feature-card"
        >
          <span class="feature-icon"><Icon :icon="feature.icon" aria-hidden="true" /></span>
          <h3 class="feature-title">{{ t(`landing.features_.${feature.key}Title`) }}</h3>
          <p class="text-meta">{{ t(`landing.features_.${feature.key}Body`) }}</p>
        </article>
      </div>
    </section>

    <section class="closer" v-reveal>
      <h2 class="text-headline">{{ t('landing.closerTitle') }}</h2>
      <p class="text-body closer-lede">{{ t('landing.closerBody') }}</p>
      <RouterLink to="/today" class="btn primary lg">
        {{ t('landing.openApp') }}
        <Icon :icon="ctaArrow" aria-hidden="true" />
      </RouterLink>
    </section>

    <footer class="landing-footer">
      <span class="text-caption">{{ t('landing.footer') }}</span>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.landing {
  --pad-x: clamp(20px, 5vw, 56px);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* ---------- Nav ---------- */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--pad-x);
  background: var(--surface-blur);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.brand-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
  transform: rotate(45deg);
}

.landing-nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.nav-link:hover {
  color: var(--accent);
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(56px, 11vh, 120px) var(--pad-x) clamp(64px, 12vh, 128px);
  display: flex;
  justify-content: center;
}

.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-5);
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  color: var(--accent-on-soft);
  border: 1px solid rgba(var(--accent-rgb), 0.25);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0;
}

.text-display :deep(em),
.text-display em {
  font-style: italic;
  color: var(--accent);
}

.hero-lede {
  max-width: 56ch;
  color: var(--text-muted);
  margin: 0;
}

.hero-cta {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
}

.hero-note {
  margin: 0;
}

/* The live prayer-time card. */
.hero-card {
  width: 100%;
  max-width: 380px;
  margin-top: var(--space-6);
  padding: var(--space-5);
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.hero-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: live-pulse 2.2s ease-in-out infinite;
}
@keyframes live-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.55);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(var(--accent-rgb), 0);
  }
}

.hero-card-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.hero-prayer {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--text);
}

.hero-time {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--accent);
}

.link-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--accent);
  text-decoration: underline;
  cursor: pointer;
}

.skeleton {
  display: block;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--surface-alt) 25%,
    var(--border) 50%,
    var(--surface-alt) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
.skeleton-lg {
  width: 40%;
  height: 26px;
}
.skeleton-sm {
  width: 25%;
  height: 20px;
}
@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

/* ---------- Sections ---------- */
.section {
  padding: clamp(56px, 9vh, 104px) var(--pad-x);
  max-width: calc(var(--measure-wide) + var(--pad-x) * 2);
  width: 100%;
  margin: 0 auto;
}

.section-head {
  margin-bottom: var(--space-10);
  max-width: 46ch;
}
.section-head .text-eyebrow {
  margin: 0 0 var(--space-2);
}

.steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-5);
}

.step {
  position: relative;
  padding: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--transition),
    box-shadow var(--transition),
    border-color var(--transition);
}
.step:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
  border-color: rgba(var(--accent-rgb), 0.3);
}

.step-number {
  position: absolute;
  top: var(--space-5);
  right: var(--space-5);
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.step-icon {
  font-size: var(--text-2xl);
  color: var(--accent);
  margin-bottom: var(--space-3);
  display: block;
}

.step-title,
.feature-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  margin: 0 0 var(--space-2);
  color: var(--text);
}

/* ---------- Quote ---------- */
.quote-section {
  padding: clamp(40px, 7vh, 80px) var(--pad-x);
  display: flex;
  justify-content: center;
}

.quote {
  max-width: 640px;
  margin: 0;
  padding: var(--space-10) var(--space-8);
  text-align: center;
  background: linear-gradient(165deg, var(--accent-soft), transparent);
  border: 1px solid rgba(var(--accent-rgb), 0.22);
  border-radius: var(--radius-xl);
}

/* The one place that uses the scripture face: this is a hadith, and in Arabic
   it should arrive in naskh the way it would in print, not in the Kufi the
   app's own headings are set in. In English the stack falls through to
   Fraunces, so the Latin rendering is unchanged. Naskh carries more of its
   weight below the baseline than Kufi, hence the looser line-height. */
.quote-text {
  font-family: var(--font-naskh);
  font-size: var(--text-xl);
  line-height: 1.7;
  color: var(--text);
  margin: 0 0 var(--space-4);
}

.quote-source {
  color: var(--accent-on-soft);
}

/* ---------- Features ---------- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-4);
}

.feature-card {
  padding: var(--space-6);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition:
    transform var(--transition),
    border-color var(--transition),
    box-shadow var(--transition);
}
.feature-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  color: var(--accent);
  font-size: var(--text-xl);
  margin-bottom: var(--space-4);
}

/* ---------- Closer ---------- */
.closer {
  padding: clamp(64px, 11vh, 128px) var(--pad-x);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.closer-lede {
  max-width: 44ch;
  color: var(--text-muted);
  margin: 0;
}

.landing-footer {
  padding: var(--space-8) var(--pad-x) var(--space-10);
  text-align: center;
  border-top: 1px solid var(--border);
}

@media (max-width: 720px) {
  /* The in-page anchors are the first thing to go — the CTA and the theme
     toggle are what a phone visitor actually needs in the bar. */
  .landing-nav-links .nav-link {
    display: none;
  }
  .hero-cta {
    width: 100%;
    flex-direction: column;
  }
  .quote {
    padding: var(--space-8) var(--space-5);
  }
}
</style>
