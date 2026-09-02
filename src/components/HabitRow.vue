<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import type { HabitItem } from '@/types';
import { isolate } from '@/utils';

const { t } = useI18n();

/**
 * One habit as a row. Used by both Today and the Habits list so the two can't
 * drift apart visually.
 *
 * Accessibility note on the structure: the row needs to be *both* a link to
 * the habit's detail page and to contain a check-off button, and a <button>
 * inside an <a> is invalid HTML that keyboards and screen readers handle
 * badly. So this uses the "stretched link" pattern — the title is a real
 * RouterLink whose ::after pseudo-element covers the whole row, and the
 * interactive controls sit above it on the z-axis. One tab stop for the link,
 * one for the button, no click handler on a div.
 */
const props = withDefaults(
  defineProps<{
    habit: HabitItem;
    completed: boolean;
    /** Shown on the right; Today shows an action, the list shows a status pill. */
    variant?: 'action' | 'status';
    meta?: string;
    /**
     * Whether the habit is on today's schedule. Today only ever renders habits
     * that are, but the Habits list shows all of them — and ticking one off on
     * a day it isn't scheduled writes a completion that `dayState` reports as
     * `not-scheduled`, so stats ignore it and streaks skip it. The tick would
     * look on and count for nothing, so the control is disabled instead.
     */
    scheduledToday?: boolean;
  }>(),
  { scheduledToday: true },
);

const emit = defineEmits<{ toggle: [id: string] }>();

const metaLine = computed(
  () =>
    props.meta ??
    t('habits.afterPrayer', {
      prayer: t(`prayers.${props.habit.anchorPrayer}`),
      // User text: isolated so "1 verse" doesn't render as "verse 1" in Arabic.
      minimal: isolate(props.habit.minimalVersion),
    }),
);

/** Not actionable today — for either reason. */
const inert = computed(() => props.habit.paused || !props.scheduledToday);

/**
 * Off-schedule rows render a marker instead of a disabled checkbox.
 *
 * A disabled control says "you may do this, but not now"; the truth here is
 * that today simply isn't one of this habit's days, which a calendar glyph
 * states outright where a dashed empty circle only hints at it. Paused keeps
 * the disabled button, because pausing *is* a state you toggle back.
 *
 * A calendar rather than a clock on purpose: a clock reads as "later today",
 * and the habit isn't due later today — it's due another day.
 */
const showMarker = computed(() => !props.habit.paused && !props.scheduledToday);

const checkLabel = computed(() => {
  const title = props.habit.title;
  if (props.habit.paused) return t('habits.pausedRowLabel', { title });
  if (!props.scheduledToday) return t('habits.notScheduledRowLabel', { title });
  return props.completed ? t('habits.markAsNotDone', { title }) : t('habits.markAsDone', { title });
});

/** Native tooltip explaining why the control is dead, since a dashed ring alone doesn't say. */
const checkTitle = computed(() => {
  if (props.habit.paused) return t('habits.resumeToCheck');
  if (!props.scheduledToday) return t('habits.notScheduledToday');
  return undefined;
});
</script>

<template>
  <div class="habit-row" :class="{ paused: habit.paused, done: completed }">
    <!-- Not a <button>: there is nothing to press, so it is a status image
         rather than a control a keyboard user has to skip past. -->
    <span
      v-if="showMarker"
      class="habit-marker"
      role="img"
      :title="checkTitle"
      :aria-label="checkLabel"
    >
      <Icon icon="lucide:calendar-days" aria-hidden="true" />
    </span>

    <button
      v-else
      type="button"
      class="habit-check"
      :class="{ on: completed }"
      :disabled="inert"
      :title="checkTitle"
      :aria-pressed="completed"
      :aria-label="checkLabel"
      @click="emit('toggle', habit.id)"
    >
      <Icon v-if="completed" icon="lucide:check" aria-hidden="true" />
    </button>

    <!-- <bdi> on both lines: each holds either user text of unknown direction
         or a sentence containing some, and bdi picks the direction from the
         content while isolating it from the row around it. -->
    <div class="habit-body">
      <RouterLink :to="`/habits/${habit.id}`" class="habit-title stretched">
        <bdi>{{ habit.title }}</bdi>
      </RouterLink>
      <div class="habit-meta"><bdi>{{ metaLine }}</bdi></div>
    </div>

    <slot name="trailing">
      <button
        v-if="variant === 'action' && !inert && !completed"
        type="button"
        class="habit-action"
        @click="emit('toggle', habit.id)"
      >
        {{ t('habits.markDone') }}
      </button>
    </slot>
  </div>
</template>

<style scoped>
.habit-row {
  position: relative;
}

/* Above the stretched link's overlay, so they stay independently clickable. */
.habit-check,
.habit-marker,
.habit-action {
  position: relative;
  z-index: 1;
}

/* Same, for whatever the parent passes into the trailing slot — :slotted()
   has to be its own rule, it isn't valid inside a selector list. */
:slotted(*) {
  position: relative;
  z-index: 1;
}

.stretched {
  color: inherit;
  text-decoration: none;
  display: block;
}
.stretched::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.stretched:hover {
  color: var(--accent);
}
/* The link's own focus ring would be a thin box around the text; move it to
   the whole row so keyboard users can see what they're about to open. */
.stretched:focus-visible {
  outline: none;
}
.habit-row:has(.stretched:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
