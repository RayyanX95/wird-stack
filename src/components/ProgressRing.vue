<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

/**
 * A circular completion meter for the day.
 *
 * SVG rather than canvas: it's one shape, it scales without a devicePixelRatio
 * dance, and the "fill" is a single stroke-dashoffset that CSS can transition
 * — so the ring visibly closes when a habit is checked off, which is the whole
 * reason it's here rather than a percentage in text.
 *
 * At 100% the count is replaced by a check: a full gold ring around "2/2" is
 * ambiguous at a glance (it reads as an empty donut), whereas a tick is not.
 */
const props = withDefaults(
  defineProps<{ value: number; total: number; size?: number; label?: string }>(),
  { size: 72 },
);

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const fraction = computed(() => (props.total === 0 ? 0 : props.value / props.total));
const offset = computed(() => CIRCUMFERENCE * (1 - fraction.value));
const complete = computed(() => props.total > 0 && props.value >= props.total);
</script>

<template>
  <div
    class="ring"
    :class="{ complete }"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="label ?? t('today.ringLabel', { value, total })"
  >
    <svg viewBox="0 0 100 100">
      <circle class="ring-track" cx="50" cy="50" :r="RADIUS" />
      <circle
        class="ring-fill"
        cx="50"
        cy="50"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="offset"
      />
    </svg>

    <div class="ring-label" aria-hidden="true">
      <Icon v-if="complete" icon="lucide:check" class="ring-check" />
      <!-- The numerals are baseline-aligned to each other inside this span,
           while the span itself is centred by the parent. Putting
           `align-items: baseline` on the parent instead pins the whole flex
           line to the top of the circle. -->
      <span v-else class="ring-count">
        <span class="ring-value mono">{{ value }}</span>
        <span class="ring-total mono">/{{ total }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  flex-shrink: 0;
}

svg {
  width: 100%;
  height: 100%;
  /* Start the arc at 12 o'clock instead of 3. */
  transform: rotate(-90deg);
  overflow: visible;
}

.ring-track {
  fill: none;
  stroke: var(--surface-alt);
  stroke-width: 9;
}

.ring-fill {
  fill: none;
  stroke: var(--accent);
  stroke-width: 9;
  stroke-linecap: round;
  transition:
    stroke-dashoffset 640ms var(--ease),
    stroke var(--transition);
}

.ring.complete .ring-fill {
  stroke: var(--gold);
  filter: drop-shadow(0 0 5px rgba(var(--gold-rgb), 0.45));
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* A fraction is a formula, not a sentence: "1/2" stays "1/2" in Arabic, so
   this one box opts out of the page's direction. Without it the flex row
   reverses and 1 of 2 renders as "2/1". */
.ring-count {
  display: flex;
  align-items: baseline;
  gap: 1px;
  direction: ltr;
}

.ring-value {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  line-height: 1;
}

.ring-total {
  font-size: var(--text-xs);
  color: var(--text-faint);
  line-height: 1;
}

.ring-check {
  font-size: var(--text-xl);
  color: var(--gold);
  animation: check-in 420ms var(--ease-spring) both;
}

@keyframes check-in {
  from {
    opacity: 0;
    transform: scale(0.4) rotate(-25deg);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
