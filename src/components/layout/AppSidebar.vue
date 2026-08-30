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

const logoSvg = logoRaw.replace(/<!--[\s\S]*?-->/g, '').trim();
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand">
      <span class="brand-mark" aria-hidden="true" v-html="logoSvg" />
      Sabr
    </RouterLink>
    <nav class="nav">
      <RouterLink to="/" class="nav-item">Today</RouterLink>
      <RouterLink to="/habits" class="nav-item">Habits</RouterLink>
      <RouterLink to="/stats" class="nav-item">Stats</RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  flex: 0 0 190px;
  background: linear-gradient(180deg, var(--surface-alt), var(--bg));
  border-right: 1px solid var(--border);
  box-shadow: 6px 0 24px -20px rgba(var(--text-rgb), 0.5);
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.brand {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 17px;
  color: var(--text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 4px;
}

/* The source SVG is square-cornered so it works as a favicon; the rounding for
   in-app use is applied here, which needs overflow:hidden to clip the artwork. */
.brand-mark {
  display: block;
  width: 24px;
  height: 24px;
  overflow: hidden;
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 4px var(--accent-soft);
  flex-shrink: 0;
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
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-muted);
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.nav-item:hover {
  background: var(--surface);
  color: var(--text);
}

.nav-item.router-link-exact-active {
  background: var(--surface);
  color: var(--accent-hover);
  font-weight: 600;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px rgba(var(--accent-rgb), 0.12);
}

.nav-item.router-link-exact-active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  border-radius: 0 3px 3px 0;
  background: var(--accent);
}
</style>
