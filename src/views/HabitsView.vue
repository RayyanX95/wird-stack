<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { HabitRow } from '@/components';
import { useLocale } from '@/composables';
import { useHabitsStore } from '@/stores/habits';
import type { HabitItem } from '@/types';
import { WEEKDAY_DISPLAY_ORDER } from '@/types';

const { t } = useI18n();
const { locale } = useLocale();
const { habits, isCompletedToday, isScheduledToday, currentStreak, isNewHabit, toggleComplete } =
  useHabitsStore();

type Filter = 'all' | 'active' | 'paused';
const FILTERS: Filter[] = ['all', 'active', 'paused'];

const filter = ref<Filter>('all');

/**
 * The single status pill on the right of a row, in priority order.
 *
 * Off-schedule rows deliberately do *not* get their own pill: the calendar
 * marker and the "runs Mon, Wed, Fri" meta line already say it twice, so the
 * slot is better spent on the streak than on a third copy of the same fact.
 */
function statusOf(habitId: string, paused: boolean) {
  if (paused) return { text: t('habits.status.paused'), cls: 'new' };
  const streak = currentStreak(habitId);
  // A streak long enough to be worth protecting gets the pulsing dot.
  if (streak > 0) {
    return {
      text: t('habits.status.streakDays', { count: streak }),
      cls: streak >= 7 ? 'streak hot' : 'streak',
    };
  }
  if (isNewHabit(habitId)) return { text: t('habits.status.new'), cls: 'new' };
  return { text: t('habits.status.atRisk'), cls: 'risk' };
}

/**
 * The row's second line. A habit that can't be ticked today shows the days it
 * *does* run on instead of its minimal version — that's the information the
 * user is missing at that moment. Every-day habits never hit this branch, so
 * the list is always a genuine subset worth reading.
 */
// Intl.ListFormat rather than join(', '): the separator and the final
// conjunction are part of the language, not punctuation we get to pick —
// English wants "Mon, Wed and Fri", Arabic wants "الاثنين والأربعاء والجمعة"
// with no commas at all.
const listFormatter = computed(
  () => new Intl.ListFormat(locale.value, { style: 'long', type: 'conjunction' }),
);

function metaFor(habit: HabitItem, scheduledToday: boolean): string | undefined {
  if (scheduledToday || habit.paused) return undefined;
  const days = WEEKDAY_DISPLAY_ORDER.filter((d) => habit.days.includes(d)).map((d) =>
    t(`weekdays.long.${d}`),
  );
  return t('habits.runsOn', {
    prayer: t(`prayers.${habit.anchorPrayer}`),
    days: listFormatter.value.format(days),
  });
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
        <h1 class="text-title margin-bottom">{{ t('habits.title') }}</h1>
        <p class="text-subtitle count">
          {{ t('habits.total', { count: habits.length }) }}
          <span v-if="pausedCount"> · {{ t('habits.pausedCount', { count: pausedCount }) }}</span>
        </p>
      </div>
      <RouterLink to="/habits/new" class="btn primary new-btn">
        <Icon icon="lucide:plus" aria-hidden="true" />
        {{ t('nav.newHabit') }}
      </RouterLink>
    </header>

    <div
      v-if="habits.length > 0"
      class="segmented"
      role="group"
      :aria-label="t('habits.filterLabel')"
    >
      <button
        v-for="f in FILTERS"
        :key="f"
        type="button"
        :aria-pressed="filter === f"
        @click="filter = f"
      >
        {{ t(`habits.filters.${f}`) }}
      </button>
    </div>

    <div v-if="habits.length === 0" class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:list-plus" /></div>
      <h2 class="text-title margin-bottom">{{ t('habits.noHabitsTitle') }}</h2>
      <p class="text-subtitle">{{ t('habits.noHabitsBody') }}</p>
      <RouterLink to="/habits/new" class="btn primary">{{ t('habits.createFirst') }}</RouterLink>
    </div>

    <!-- One key per filter rather than interpolating the filter name into a
         sentence: "No paused habits" and "لا توجد عادات موقوفة" put the
         adjective in different places and inflect it differently. -->
    <p v-else-if="rows.length === 0" class="text-subtitle empty-filter">
      {{ t(`habits.empty${filter.charAt(0).toUpperCase()}${filter.slice(1)}`) }}
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
/* Rows slide out toward the leading edge — which is the other side in Arabic. */
.list-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
:global([dir='rtl']) .list-leave-to {
  transform: translateX(16px);
}
</style>
