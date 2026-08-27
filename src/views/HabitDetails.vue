<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHabitsStore } from '@/stores/habits';
import type { WeekDay } from '@/types';

const DAYS: { label: string; value: WeekDay }[] = [
  { label: 'M', value: 'Mon' },
  { label: 'T', value: 'Tue' },
  { label: 'W', value: 'Wed' },
  { label: 'T', value: 'Thu' },
  { label: 'F', value: 'Fri' },
  { label: 'S', value: 'Sat' },
  { label: 'S', value: 'Sun' },
];

const route = useRoute();
const { getHabitById, currentStreak, longestStreak, dayState } = useHabitsStore();

const habitId = computed(() => route.params.id as string);
const habit = computed(() => getHabitById(habitId.value));

// Last 14 calendar days, oldest first, each resolved to its real state
// (done / missed / not-scheduled) via the store — not static example data.
const historyDays = computed(() => {
  if (!habit.value) return [];
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      date: iso,
      label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      state: dayState(habitId.value, iso),
    });
  }
  return days;
});

const historyWeeks = computed(() => [
  historyDays.value.slice(0, 7),
  historyDays.value.slice(7, 14),
]);

const scheduledDays = computed(() => DAYS.filter((day) => habit.value?.days.includes(day.value)));
</script>

<template>
  <div class="habit-details-page">
    <RouterLink to="/habits" class="back-link">Back to habits</RouterLink>

    <template v-if="habit">
      <header class="page-header">
        <h1 class="text-title margin-bottom">{{ habit.title }}</h1>
        <span class="text-subtitle"
          >After {{ habit.anchorPrayer }} · {{ habit.minimalVersion }}</span
        >
      </header>

      <div class="stat-cards">
        <div class="stat-card" :class="{ streak: currentStreak(habit.id) > 0 }">
          <div class="stat-value">{{ currentStreak(habit.id) }}</div>
          <div class="stat-label">Current streak</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ Math.max(longestStreak(habit.id), currentStreak(habit.id)) }}
          </div>
          <div class="stat-label">Longest streak</div>
        </div>
      </div>

      <div class="field">
        <div class="field-label">Set in Days</div>
        <div class="day-pills">
          <span v-for="day in scheduledDays" :key="day.value" class="day-pill selected">
            {{ day.value }}
          </span>
        </div>
      </div>

      <div>
        <div class="text-label margin-bottom">Last 14 days</div>
        <div class="history-grid">
          <div v-for="(week, wi) in historyWeeks" :key="wi">
            <div class="history-dow">
              <span v-for="d in week" :key="d.date">{{ d.label }}</span>
            </div>
            <div class="history-week">
              <div
                v-for="d in week"
                :key="d.date"
                class="history-cell"
                :class="{ on: d.state === 'done', missed: d.state === 'missed' }"
                :title="d.date"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="btn-row">
        <button type="button" class="btn ghost">Pause</button>
        <button type="button" class="btn ghost">Edit</button>
        <button type="button" class="btn danger">Delete</button>
      </div>
    </template>

    <p v-else class="text-subtitle">Habit not found.</p>
  </div>
</template>

<style scoped lang="scss">
.habit-details-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 420px;
}

.page-header {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.margin-bottom {
  margin-bottom: 6px;
}

.history-grid > div + div {
  margin-top: 8px;
}

.btn-row {
  display: flex;
  gap: 12px;
}
</style>
