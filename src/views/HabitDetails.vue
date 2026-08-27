<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHabitsStore } from '@/stores/habits';

const route = useRoute();
const { getHabitById } = useHabitsStore();

const habit = computed(() => getHabitById(route.params.id as string));

// No completion history is modeled yet — these are static examples matching
// the wireframe, not derived from real data.
const historyDow = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const historyWeeks = [
  [true, true, true, false, true, true, true],
  [true, true, false, true, true, true, true],
];
</script>

<template>
  <div class="habit-details-page">
    <RouterLink to="/habits" class="back-link">Back to habits</RouterLink>

    <template v-if="habit">
      <header class="page-header">
        <h1 class="text-title margin-bottom">{{ habit.title }}</h1>
        <span class="text-subtitle">After {{ habit.anchorPrayer }} · {{ habit.minimalVersion }}</span>
      </header>

      <div class="stat-cards">
        <div class="stat-card streak">
          <div class="stat-value">{{ habit.streak }}</div>
          <div class="stat-label">Current streak</div>
        </div>
        <div class="stat-card">
          <!-- longest streak isn't tracked in the data model yet — mirrors current for now -->
          <div class="stat-value">{{ habit.streak }}</div>
          <div class="stat-label">Longest streak</div>
        </div>
      </div>

      <div>
        <div class="text-label margin-bottom">Last 14 days</div>
        <div class="history-grid">
          <div class="history-dow">
            <span v-for="(d, i) in historyDow" :key="i">{{ d }}</span>
          </div>
          <div v-for="(week, wi) in historyWeeks" :key="wi" class="history-week">
            <div v-for="(done, di) in week" :key="di" class="history-cell" :class="{ on: done }" />
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

.btn-row {
  display: flex;
  gap: 12px;
}
</style>
