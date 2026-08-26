<script setup lang="ts"></script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand">Sabr</RouterLink>
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
  background: var(--surface-alt);
  border-right: 1px solid var(--border);
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 17px;
  color: var(--accent);
  text-decoration: none;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-item {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-muted);
  padding: 9px 11px;
  border-radius: var(--radius-sm);
  text-decoration: none;
}

.nav-item:hover {
  background: var(--surface);
}

.nav-item.router-link-exact-active {
  background: var(--accent-soft);
  color: var(--accent-hover);
  font-weight: 600;
}
</style>
