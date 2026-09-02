<script setup lang="ts">
// The mark's geometry lives in one place — see src/assets/logo.svg for what it
// means and the constraints on changing it. Inlined rather than used as an
// <img> so it inherits the page's rendering, and imported rather than copied so
// the sidebar and the favicon can't drift apart.
//
// That file is mostly documentation (~2.9KB of comment around ~0.6KB of
// markup), so strip comments before injecting it — otherwise the whole essay
// lands in the DOM on every render.
import logoRaw from '@/assets/logo.svg?raw';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ThemeToggle from '../ThemeToggle.vue';
import LocaleToggle from '../LocaleToggle.vue';

const logoSvg = logoRaw.replace(/<!--[\s\S]*?-->/g, '').trim();

const route = useRoute();
const { t } = useI18n();

// One nav definition renders twice — as the desktop rail and as the mobile tab
// bar — so the two can't fall out of sync. `labelKey` rather than a literal so
// the same definition serves both locales.
const NAV = [
  { to: '/today', labelKey: 'nav.today', icon: 'lucide:sun' },
  { to: '/habits', labelKey: 'nav.habits', icon: 'lucide:list-checks' },
  { to: '/stats', labelKey: 'nav.stats', icon: 'lucide:bar-chart-3' },
];

// /habits/new, /habits/:id, and /habits/:id/edit are their own top-level route
// records (not children of /habits), so vue-router's built-in
// router-link-active never fires for them — the Habits tab has to be marked
// active by path prefix instead.
function isNavActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`);
}
</script>

<template>
  <!-- Desktop rail. Hidden below the tab-bar breakpoint. -->
  <aside class="sidebar">
    <RouterLink to="/" class="brand">
      <span class="brand-mark" aria-hidden="true" v-html="logoSvg" />
      WirdStack
    </RouterLink>

    <nav class="nav" :aria-label="t('nav.main')">
      <RouterLink
        v-for="item in NAV"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ 'router-link-active': isNavActive(item.to) }"
      >
        <Icon :icon="item.icon" class="nav-icon" aria-hidden="true" />
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>

    <div class="rail-foot">
      <RouterLink to="/habits/new" class="btn primary new-btn">
        <Icon icon="lucide:plus" aria-hidden="true" />
        {{ t('nav.newHabit') }}
      </RouterLink>
      <div class="rail-toggles">
        <ThemeToggle />
        <LocaleToggle />
      </div>
    </div>
  </aside>

  <!-- Mobile chrome: a slim top bar for identity, a bottom tab bar for reach.
       Both are display:none above the breakpoint. -->
  <header class="topbar">
    <RouterLink to="/" class="brand">
      <span class="brand-mark" aria-hidden="true" v-html="logoSvg" />
      WirdStack
    </RouterLink>
    <div class="topbar-actions">
      <ThemeToggle />
      <LocaleToggle />
    </div>
  </header>

  <nav class="tabbar" :aria-label="t('nav.main')">
    <RouterLink
      v-for="item in NAV"
      :key="item.to"
      :to="item.to"
      class="tab-item"
      :class="{ 'router-link-active': isNavActive(item.to) }"
    >
      <Icon :icon="item.icon" class="tab-icon" aria-hidden="true" />
      <span>{{ t(item.labelKey) }}</span>
    </RouterLink>
    <RouterLink to="/habits/new" class="tab-item tab-new">
      <Icon icon="lucide:plus" class="tab-icon" aria-hidden="true" />
      <span>{{ t('nav.new') }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex: 0 0 var(--sidebar-w);
  height: 100dvh;
  background: linear-gradient(180deg, var(--surface-alt), var(--bg));
  /* Logical, so the rail's edge lands against the content column in both
     directions rather than on the outside of the window in Arabic. */
  border-inline-end: 1px solid var(--border);
  box-shadow: 6px 0 24px -20px rgba(var(--text-rgb), 0.5);
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* box-shadow has no logical form — the offset has to be mirrored by hand. */
:global([dir='rtl']) .sidebar {
  box-shadow: -6px 0 24px -20px rgba(var(--text-rgb), 0.5);
}

.brand {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-lg);
  color: var(--text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-1);
}

/* The source SVG is square-cornered so it works as a favicon; the rounding for
   in-app use is applied here, which needs overflow:hidden to clip the artwork. */
.brand-mark {
  display: block;
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 4px var(--accent-soft);
  flex-shrink: 0;
  transition: transform var(--transition);
}
.brand:hover .brand-mark {
  transform: rotate(-6deg) scale(1.05);
}

/* :deep, because v-html content isn't touched by scoped-style attributes. */
.brand-mark :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-muted);
  padding: 10px var(--space-3);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.nav-icon {
  font-size: var(--text-lg);
  flex-shrink: 0;
  opacity: 0.75;
}

.nav-item:hover {
  background: var(--surface);
  color: var(--text);
}

.nav-item.router-link-active {
  background: var(--surface);
  color: var(--accent-on-soft);
  font-weight: 600;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px rgba(var(--accent-rgb), 0.12);
}
.nav-item.router-link-active .nav-icon {
  opacity: 1;
  color: var(--accent);
}

/* The active marker sits in the rail's own padding, on whichever side the
   text starts — logical inset and logical corner radii, so it reads as a tab
   growing out of the edge in both directions. */
.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  inset-inline-start: calc(-1 * var(--space-4));
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  border-start-end-radius: 3px;
  border-end-end-radius: 3px;
  background: var(--accent);
}

/* Two rows, not one: "New habit" and its Arabic counterpart "وِرد جديد" are
   different lengths, and squeezing either one down to fit beside two icon
   buttons is what was wrapping the label onto two lines. Stacking gives the
   button the full rail width to work with in both languages. */
.rail-foot {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.rail-toggles {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.new-btn {
  width: 100%;
  font-size: var(--text-sm);
}

/* Mobile chrome is off by default and switched on at the breakpoint. */
.topbar,
.tabbar {
  display: none;
}

@media (max-width: 720px) {
  .sidebar {
    display: none;
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    background: var(--surface-blur);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: var(--z-tabbar);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* The safe-area inset keeps the bar clear of the iOS home indicator. */
    padding-bottom: env(safe-area-inset-bottom, 0);
    background: var(--surface-blur);
    backdrop-filter: blur(14px);
    border-top: 1px solid var(--border);
  }

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: var(--tabbar-h);
    text-decoration: none;
    color: var(--text-faint);
    font-size: var(--text-2xs);
    font-weight: 600;
    transition: color var(--transition-fast);
  }

  .tab-icon {
    font-size: var(--text-xl);
    transition: transform var(--transition);
  }

  .tab-item.router-link-active {
    color: var(--accent);
  }
  .tab-item.router-link-active .tab-icon {
    transform: translateY(-2px);
  }

  .tab-new {
    color: var(--accent);
  }
}
</style>
