<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { HabitRow } from '@/components';
import { useHabitsStore } from '@/stores/habits';
import type { HabitItem } from '@/types';
import { WEEKDAY_DISPLAY_ORDER } from '@/types';

const { habits, isCompletedToday, isScheduledToday, currentStreak, isNewHabit, toggleComplete } =
  useHabitsStore();

type Filter = 'all' | 'active' | 'paused';
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
];

const filter = ref<Filter>('all');

/**
 * The single status pill on the right of a row, in priority order.
 *
 * Off-schedule rows deliberately do *not* get their own pill: the calendar
 * marker and the "runs Mon, Wed, Fri" meta line already say it twice, so the
 * slot is better spent on the streak than on a third copy of the same fact.
 */
function statusOf(habitId: string, paused: boolean) {
  if (paused) return { text: 'Paused', cls: 'new' };
  const streak = currentStreak(habitId);
  // A streak long enough to be worth protecting gets the pulsing dot.
  if (streak > 0) return { text: `${streak}-day`, cls: streak >= 7 ? 'streak hot' : 'streak' };
  if (isNewHabit(habitId)) return { text: 'New', cls: 'new' };
  return { text: 'At risk', cls: 'risk' };
}

/**
 * The row's second line. A habit that can't be ticked today shows the days it
 * *does* run on instead of its minimal version — that's the information the
 * user is missing at that moment. Every-day habits never hit this branch, so
 * the list is always a genuine subset worth reading.
 */
function metaFor(habit: HabitItem, scheduledToday: boolean): string | undefined {
  if (scheduledToday || habit.paused) return undefined;
  const days = WEEKDAY_DISPLAY_ORDER.filter((d) => habit.days.includes(d));
  return `After ${habit.anchorPrayer} · runs ${days.join(', ')}`;
}

// Status and completion are resolved once per habit here rather than called
// from the template. Both walk the completion log, and a template expression
// re-runs on every render — `statusOf` alone was being evaluated three times
// per row (pill class, pill text, and again on any re-render).
const rows = computed(() =>
  habits
    .filter((h) => {
      if (filter.value === 'active') return !h.paused;
      if (filter.value === 'paused') return h.paused;
      return true;
    })
    .map((habit) => {
      const scheduledToday = isScheduledToday(habit.id);
      return {
        habit,
        scheduledToday,
        completed: isCompletedToday(habit.id),
        status: statusOf(habit.id, habit.paused),
        meta: metaFor(habit, scheduledToday),
      };
    }),
);

const pausedCount = computed(() => habits.filter((h) => h.paused).length);
</script>

<template>
  <div class="view">
    <header class="page-header">
      <div>
        <h1 class="text-title margin-bottom">Habits</h1>
        <p class="text-subtitle count">
          {{ habits.length }} total<span v-if="pausedCount"> · {{ pausedCount }} paused</span>
        </p>
      </div>
      <RouterLink to="/habits/new" class="btn primary new-btn">
        <Icon icon="lucide:plus" aria-hidden="true" />
        New habit
      </RouterLink>
    </header>

    <div v-if="habits.length > 0" class="segmented" role="group" aria-label="Filter habits">
      <button
        v-for="f in FILTERS"
        :key="f.id"
        type="button"
        :aria-pressed="filter === f.id"
        @click="filter = f.id"
      >
        {{ f.label }}
      </button>
    </div>

    <div v-if="habits.length === 0" class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:list-plus" /></div>
      <h2 class="text-title margin-bottom">No habits yet</h2>
      <p class="text-subtitle">
        Pick a prayer you already pray and attach something small to it — one verse is a real habit.
      </p>
      <RouterLink to="/habits/new" class="btn primary">Create your first habit</RouterLink>
    </div>

    <p v-else-if="rows.length === 0" class="text-subtitle empty-filter">
      No {{ filter }} habits.
    </p>

    <!-- TransitionGroup so deleting or filtering animates the remaining rows into
         place instead of snapping them. -->
    <TransitionGroup v-else name="list" tag="div" class="habit-list">
      <HabitRow
        v-for="(row, i) in rows"
        :key="row.habit.id"
        class="rise"
        :style="{ '--i': Math.min(i, 8) }"
        :habit="row.habit"
        :completed="row.completed"
        :scheduled-today="row.scheduledToday"
        :meta="row.meta"
        variant="status"
        @toggle="toggleComplete"
      >
        <template #trailing>
          <span class="pill" :class="row.status.cls">{{ row.status.text }}</span>
        </template>
      </HabitRow>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.count {
  margin: 0;
}

.new-btn {
  flex-shrink: 0;
}

.habit-list {
  /* Positioned, because leaving rows are taken out of flow with
     `position: absolute` and would otherwise anchor to the page. */
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.empty-filter {
  padding: var(--space-8) 0;
  text-align: center;
}

.list-move {
  transition: transform var(--transition-slow);
}
.list-leave-active {
  transition:
    opacity var(--transition),
    transform var(--transition);
  position: absolute;
  left: 0;
  right: 0;
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
</style>
