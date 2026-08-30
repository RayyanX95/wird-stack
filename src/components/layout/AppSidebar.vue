<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand">
      <!-- The eight-point khatim star with a check cut out of it. The star is
           two identical squares, one rotated 45 degrees — in Islamic geometry,
           order built from a single shape repeated; also the Rub el Hizb, which
           divides the Qur'an into equal portions for regular daily recitation.
           Structure through repetition, which is what habit-building is. The
           check is what makes it this app's mark: a habit kept.

           Deliberately tied to the idea, not the name: the app may be renamed,
           so no letterform or wordmark.

           The check is filled polygons plus three circles faking round caps,
           NOT a stroked path — the same artwork generates public/favicon.ico
           via ImageMagick, which silently drops stroked paths. Keep the two
           squares on one circumradius or the star goes lopsided.

           Mirrors public/favicon.svg; keep the two in sync. -->
      <svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--accent)" />

        <polygon points="7.51,7.51 24.49,7.51 24.49,24.49 7.51,24.49" fill="#fff" />
        <polygon points="16,4 28,16 16,28 4,16" fill="#fff" />

        <polygon points="9.77,18.03 13.17,21.43 16.43,18.17 13.03,14.77" fill="var(--accent)" />
        <polygon points="16.56,21.28 22.76,13.88 19.24,10.92 13.04,18.32" fill="var(--accent)" />
        <circle cx="11.4" cy="16.4" r="2.3" fill="var(--accent)" />
        <circle cx="14.8" cy="19.8" r="2.3" fill="var(--accent)" />
        <circle cx="21" cy="12.4" r="2.3" fill="var(--accent)" />
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
