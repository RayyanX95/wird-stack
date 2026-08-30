<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useHabitsStore } from '@/stores/habits';

const route = useRouter();
const { habits, isCompletedToday, currentStreak, isNewHabit, toggleComplete } = useHabitsStore();
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
        <button
          class="habit-check"
          :class="{ on: isCompletedToday(habit.id) }"
          :disabled="habit.paused"
          :aria-label="
            habit.paused
              ? 'Paused — resume to track completion'
              : isCompletedToday(habit.id)
                ? 'Mark incomplete'
                : 'Mark complete'
          "
          :title="habit.paused ? 'Resume this habit to check it off' : undefined"
          @click.stop="toggleComplete(habit.id)"
        >
          <span v-if="isCompletedToday(habit.id)">✓</span>
        </button>
        <div class="habit-body">
          <div class="habit-title">{{ habit.title }}</div>
          <div class="habit-meta">After {{ habit.anchorPrayer }} · {{ habit.minimalVersion }}</div>
        </div>
        <span v-if="habit.paused" class="pill new">Paused</span>
        <span v-else-if="currentStreak(habit.id) > 0" class="pill streak"
          >{{ currentStreak(habit.id) }}-day</span
        >
        <span v-else-if="isNewHabit(habit.id)" class="pill new">New</span>
        <span v-else class="pill risk">At risk</span>
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

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.habit-row {
  cursor: pointer;
}

.habit-check:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.habit-check:disabled:hover {
  border-color: var(--border-strong);
  transform: none;
}
</style>
