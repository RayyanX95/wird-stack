<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand">
      <!-- The five daily prayers as points along the arc of a day — the anchors
           every habit in this app is stacked onto. Dot sizes swell toward the
           midday zenith, which is what makes the row read as a curve with
           rhythm rather than as scattered nodes.

           Dot radii are balanced against the arc radius on purpose — enlarging
           them closes the gaps and the mark collapses into a cluster of blobs.
           Keep clear arc visible between every pair.

           There is deliberately no horizon/ground line; one was tried in every
           position and always read as a slider track or underline. Don't add it
           back. Mirrors public/favicon.svg; keep the two in sync. -->
      <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <path
          d="M5 22.05 A 11 11 0 0 1 27 22.05"
          fill="none"
          stroke="#fff"
          stroke-opacity="0.5"
          stroke-width="2.2"
        />
        <circle cx="5" cy="22.05" r="1.9" fill="#fff" />
        <circle cx="8.22" cy="14.27" r="2.3" fill="#fff" />
        <circle cx="16" cy="11.05" r="3" fill="#fff" />
        <circle cx="23.78" cy="14.27" r="2.3" fill="#fff" />
        <circle cx="27" cy="22.05" r="1.9" fill="#fff" />
      </svg>
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

.brand-mark {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  box-shadow: 0 0 0 4px var(--accent-soft);
  flex-shrink: 0;
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
