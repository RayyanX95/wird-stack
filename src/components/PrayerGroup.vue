<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { HabitItem, Prayer } from '@/types';
import HabitRow from './HabitRow.vue';

/**
 * The habits stacked onto one prayer, as a single block.
 *
 * Today groups by prayer rather than listing habits flat because that's the
 * mental model the app is selling: you don't do "four habits today," you do
 * "the thing after Fajr, then the thing after Dhuhr."
 *
 * `isNext` is decided by the parent from the real clock and is true for
 * exactly one block — the accent treatment means "this is the one coming up,"
 * so more than one of them would mean nothing at all.
 */
defineProps<{
  prayer: Prayer;
  time: string;
  habits: HabitItem[];
  isNext: boolean;
  isPassed: boolean;
  completedIds: Set<string>;
  countdown?: string;
}>();

const emit = defineEmits<{ toggle: [id: string] }>();
</script>

<template>
  <section
    class="prayer-block"
    :class="{ next: isNext, passed: isPassed && !isNext }"
    :aria-label="`Habits after ${prayer}`"
  >
    <div class="prayer-block-head">
      <h2 class="prayer-name">
        <Icon v-if="isNext" icon="lucide:arrow-right" aria-hidden="true" />
        {{ prayer }}
        <span v-if="isNext" class="next-tag">Next up</span>
      </h2>
      <span class="prayer-time">
        {{ time }}
        <template v-if="isNext && countdown"> · in {{ countdown }}</template>
      </span>
    </div>

    <div class="prayer-rows">
      <HabitRow
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
        :completed="completedIds.has(habit.id)"
        :meta="habit.minimalVersion"
        variant="action"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.next-tag {
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  background: var(--accent);
  color: var(--accent-contrast);
}
</style>
