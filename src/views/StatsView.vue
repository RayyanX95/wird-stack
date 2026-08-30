<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useHabitsStore } from '@/stores/habits';
import type { Prayer } from '@/types';
import { WEEKDAY_DISPLAY_ORDER } from '@/types';
import { toIso, weekDayOf } from '@/utils';

const router = useRouter();
const { habits, completions, currentStreak, isNewHabit, dayState } = useHabitsStore();

const MIN_COMPLETIONS_TO_SHOW_STATS = 3;

// This-month-to-date, oldest first.
const monthDates = computed(() => {
  const today = new Date();
  const dates: string[] = [];
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  while (cursor <= today) {
    dates.push(toIso(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
});

const activeHabits = computed(() => habits.filter((h) => !h.paused));
const pausedCount = computed(() => habits.length - activeHabits.value.length);

const hasEnoughData = computed(() => completions.length >= MIN_COMPLETIONS_TO_SHOW_STATS);

// Pools done/missed counts (scheduled occurrences only — "not-scheduled" days
// never enter the denominator) across a set of habits and dates.
function pooledRate(habitIds: string[], dates: string[]): { done: number; missed: number } {
  let done = 0;
  let missed = 0;
  for (const habitId of habitIds) {
    for (const date of dates) {
      const state = dayState(habitId, date);
      if (state === 'done') done++;
      else if (state === 'missed') missed++;
    }
  }
  return { done, missed };
}

function ratePercent(done: number, missed: number): number | null {
  const total = done + missed;
  if (total === 0) return null;
  return Math.round((done / total) * 100);
}

const activeHabitIds = computed(() => activeHabits.value.map((h) => h.id));

const overallRate = computed(() => {
  const { done, missed } = pooledRate(activeHabitIds.value, monthDates.value);
  return ratePercent(done, missed) ?? 0;
});

// One bar per weekday, normalized by how many *scheduled* habit-occurrences
// fell on that weekday this month — not by raw calendar-day count, so a
// Monday-only habit doesn't get diluted by every other habit's schedule.
const weeklyRates = computed(() => {
  return WEEKDAY_DISPLAY_ORDER.map((weekDay) => {
    const datesForDay = monthDates.value.filter((iso) => weekDayOf(new Date(iso)) === weekDay);
    const { done, missed } = pooledRate(activeHabitIds.value, datesForDay);
    return { label: weekDay, rate: ratePercent(done, missed) ?? 0 };
  });
});

const maxWeeklyRate = computed(() => Math.max(...weeklyRates.value.map((d) => d.rate), 1));

// Pooled (not averaged) so one low-volume habit can't dominate a prayer's rate.
const prayerRates = computed(() => {
  const prayers = [...new Set(activeHabits.value.map((h) => h.anchorPrayer))];
  return prayers
    .map((prayer) => {
      const ids = activeHabits.value.filter((h) => h.anchorPrayer === prayer).map((h) => h.id);
      const { done, missed } = pooledRate(ids, monthDates.value);
      const rate = ratePercent(done, missed);
      return rate === null ? null : { prayer, rate };
    })
    .filter((entry): entry is { prayer: Prayer; rate: number } => entry !== null);
});

// Comparing strongest vs. weakest only means something with 2+ prayers in play.
const showPrayerComparison = computed(() => prayerRates.value.length >= 2);
const strongestPrayer = computed(() =>
  showPrayerComparison.value
    ? prayerRates.value.reduce((a, b) => (b.rate > a.rate ? b : a))
    : null,
);
const weakestPrayer = computed(() =>
  showPrayerComparison.value
    ? prayerRates.value.reduce((a, b) => (b.rate < a.rate ? b : a))
    : null,
);

// Same "at risk" definition already used on the habits list: not paused,
// no current streak, and past the grace period for being a brand-new habit.
const atRiskCount = computed(
  () => activeHabits.value.filter((h) => currentStreak(h.id) === 0 && !isNewHabit(h.id)).length,
);
</script>

<template>
  <div class="stats-page">
    <header class="page-header">
      <h1 class="text-title">Stats</h1>
    </header>

    <div v-if="!hasEnoughData" class="empty-state">
      <div class="empty-icon">
        <Icon icon="lucide:bar-chart-3" />
      </div>
      <h2 class="text-title margin-bottom">Not enough data yet</h2>
      <p class="text-subtitle">
        Log a few check-ins and your stats will show up here.
      </p>
      <button type="button" class="btn primary" @click="router.push('/')">Go to Today</button>
    </div>

    <template v-else>
      <div class="overall-row">
        <span class="text-label">Weekly completion rate</span>
        <span class="overall-value">
          <span class="text-eyebrow">Overall</span>
          {{ overallRate }}%
        </span>
      </div>

      <div class="week-chart">
        <div v-for="d in weeklyRates" :key="d.label" class="week-bar-col">
          <div class="week-bar-track">
            <div
              class="week-bar-fill"
              :class="{ high: d.rate >= 70 }"
              :style="{ height: `${(d.rate / maxWeeklyRate) * 100}%` }"
            />
          </div>
          <span class="text-caption">{{ d.label }}</span>
        </div>
      </div>

      <div v-if="showPrayerComparison" class="prayer-cards">
        <button type="button" class="prayer-card" @click="router.push('/habits')">
          <span class="text-label">Strongest — {{ strongestPrayer!.prayer }}</span>
          <span class="prayer-rate good">{{ strongestPrayer!.rate }}%</span>
        </button>
        <button type="button" class="prayer-card" @click="router.push('/habits')">
          <span class="text-label">Weakest — {{ weakestPrayer!.prayer }}</span>
          <span class="prayer-rate bad">{{ weakestPrayer!.rate }}%</span>
        </button>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-value">{{ atRiskCount }}</div>
          <div class="stat-label">At risk</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activeHabits.length }}</div>
          <div class="stat-label">Active habits</div>
        </div>
      </div>

      <p v-if="pausedCount > 0" class="text-caption paused-note">
        {{ pausedCount }} paused habit{{ pausedCount > 1 ? 's' : '' }} excluded from these stats.
      </p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.stats-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 420px;
}

.overall-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.overall-value {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  color: var(--accent);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.week-chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 120px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.week-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  height: 100%;
}

.week-bar-track {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.week-bar-fill {
  width: 100%;
  min-height: 4px;
  border-radius: 4px;
  background: var(--surface-alt);
  transition: height var(--transition-fast);
}
.week-bar-fill.high {
  background: var(--accent);
}

.prayer-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prayer-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast);
  font: inherit;
  text-align: left;
}
.prayer-card:hover {
  border-color: var(--border-strong);
}

.prayer-rate {
  font-family: var(--font-mono);
  font-weight: 600;
}
.prayer-rate.good {
  color: var(--accent);
}
.prayer-rate.bad {
  color: var(--warn);
}

.paused-note {
  text-align: center;
}
</style>
