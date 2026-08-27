<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useHabitsStore } from '@/stores/habits';

const route = useRouter();
const { habits, isCompletedToday, currentStreak } = useHabitsStore();
</script>

<template>
  <div class="habits-page">
    <header class="habits-header">
      <div>
        <h1 class="text-title margin-bottom">Habits</h1>
        <span class="text-subtitle">Active + paused</span>
      </div>
      <RouterLink to="/habits/new" class="btn primary">+ New habit</RouterLink>
    </header>

    <div class="habit-list">
      <div
        v-for="habit in habits"
        :key="habit.id"
        class="habit-row"
        :class="{ paused: habit.paused }"
        @click="route.push(`/habits/${habit.id}`)"
      >
        <div class="habit-check" :class="{ on: isCompletedToday(habit.id) }">
          <span v-if="isCompletedToday(habit.id)">✓</span>
        </div>
        <div class="habit-body">
          <div class="habit-title">{{ habit.title }}</div>
          <div class="habit-meta">
            After {{ habit.anchorPrayer }} · {{ habit.minimalVersion }}
            <template v-if="habit.paused"> · Paused</template>
          </div>
        </div>
        <span v-if="!habit.paused && currentStreak(habit.id) > 0" class="pill streak"
          >{{ currentStreak(habit.id) }}-day</span
        >
        <span v-else-if="!habit.paused" class="pill risk">At risk</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.habits-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.habits-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.margin-bottom {
  margin-bottom: 6px;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.habit-row {
  cursor: pointer;
}
</style>
