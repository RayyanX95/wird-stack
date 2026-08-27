<script setup lang="ts">
import { ProgressIndicator, ProgressRoot, VisuallyHidden } from 'reka-ui'

withDefaults(defineProps<{ show: boolean; label?: string }>(), {
  label: 'Loading',
})
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div v-if="show" class="loading-overlay" role="status">
        <VisuallyHidden>{{ label }}</VisuallyHidden>
        <div class="loading-card">
          <ProgressRoot :model-value="null" class="progress-root">
            <ProgressIndicator class="progress-indicator" />
          </ProgressRoot>
          <span class="loading-label" aria-hidden="true">{{ label }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--text-rgb), 0.35);
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 32px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.loading-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.progress-root {
  position: relative;
  width: 140px;
  height: 6px;
  overflow: hidden;
  border-radius: 100px;
  background: var(--surface-alt);
}

.progress-indicator {
  position: absolute;
  inset: 0;
  width: 40%;
  border-radius: 100px;
  background: linear-gradient(155deg, var(--accent), var(--accent-hover));
}

.progress-indicator[data-state='indeterminate'] {
  animation: indeterminate-slide 1.1s var(--ease) infinite;
}

@keyframes indeterminate-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(350%);
  }
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity var(--transition);
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .progress-indicator[data-state='indeterminate'] {
    animation: none;
    width: 100%;
  }
}
</style>
