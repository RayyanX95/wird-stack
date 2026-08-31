<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useTheme } from '@/composables';

const { preference, resolved, cycleTheme } = useTheme();

// Three states, one button: the icon shows what you'd *get*, the label says
// what's set. "System" gets its own icon so it never reads as a stuck toggle.
const ICONS = {
  system: 'lucide:monitor',
  light: 'lucide:sun',
  dark: 'lucide:moon',
} as const;

const icon = computed(() => ICONS[preference.value]);
const label = computed(
  () =>
    `Theme: ${preference.value}${preference.value === 'system' ? ` (${resolved.value})` : ''}. Click to change.`,
);
</script>

<template>
  <button type="button" class="icon-btn theme-toggle" :title="label" :aria-label="label" @click="cycleTheme">
    <!-- Keyed so Vue swaps the element rather than patching it, which is what
         gives the transition something to animate between. -->
    <Transition name="swap" mode="out-in">
      <Icon :key="icon" :icon="icon" />
    </Transition>
  </button>
</template>

<style scoped>
.theme-toggle {
  flex-shrink: 0;
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}
.swap-enter-from {
  opacity: 0;
  transform: rotate(-40deg) scale(0.7);
}
.swap-leave-to {
  opacity: 0;
  transform: rotate(40deg) scale(0.7);
}
</style>
