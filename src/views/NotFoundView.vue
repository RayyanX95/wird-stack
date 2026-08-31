<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>

<template>
  <div class="view">
    <div class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:compass" /></div>
      <h1 class="text-title margin-bottom">This page doesn’t exist</h1>
      <p class="text-subtitle">
        The link may be out of date, or the habit it pointed to has since been deleted.
      </p>
      <RouterLink to="/today" class="btn primary">Go to Today</RouterLink>
    </div>
  </div>
</template>
