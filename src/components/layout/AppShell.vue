<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script>

<template>
  <div class="shell">
    <AppSidebar />
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
}
</style>
