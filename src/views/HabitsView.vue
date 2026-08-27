<script setup lang="ts">
import { mockHabits } from '@/mocks/habits'
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
        v-for="todo in mockHabits"
        :key="todo.id"
        class="habit-row"
        :class="{ paused: todo.paused }"
      >
        <div class="habit-check" :class="{ on: todo.isCompleted }">
          <span v-if="todo.isCompleted">✓</span>
        </div>
        <div class="habit-body">
          <div class="habit-title">{{ todo.title }}</div>
          <div class="habit-meta">
            After {{ todo.anchorPrayer }} · {{ todo.minimalVersion }}
            <template v-if="todo.paused"> · Paused</template>
          </div>
        </div>
        <span v-if="!todo.paused && todo.streak > 0" class="pill streak"
          >{{ todo.streak }}-day</span
        >
        <span v-else-if="!todo.paused" class="pill risk">At risk</span>
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
</style>
