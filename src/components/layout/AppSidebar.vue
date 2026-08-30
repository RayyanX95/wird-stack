<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand">
      <!-- The sun's path across a day, marked with the five daily prayers — the
           anchors every habit in this app is stacked onto. Mirrors
           public/favicon.svg; keep the two in sync. -->
      <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--accent)" />
        <path
          d="M6 19.5 A 10 10 0 0 1 26 19.5"
          fill="none"
          stroke="#fff"
          stroke-opacity="0.4"
          stroke-width="2"
        />
        <circle cx="6" cy="19.5" r="2.2" fill="#fff" />
        <circle cx="8.93" cy="12.43" r="2.2" fill="#fff" />
        <circle cx="16" cy="9.5" r="3.6" fill="#fff" />
        <circle cx="23.07" cy="12.43" r="2.2" fill="#fff" />
        <circle cx="26" cy="19.5" r="2.2" fill="#fff" />
        <path
          d="M4.5 24.5 H27.5"
          stroke="#fff"
          stroke-opacity="0.85"
          stroke-width="2"
          stroke-linecap="round"
        />
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
