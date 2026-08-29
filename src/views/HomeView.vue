<script setup lang="ts">
import { TodoCard } from '@/components'
import { useHabitsStore } from '@/stores/habits'
import type { Prayer } from '@/types'

const { habits, isCompletedToday, isScheduledToday, toggleComplete } = useHabitsStore()

const PRAYER_TIMES: Record<Prayer, string> = {
  Fajr: '05:14',
  Dhuhr: '12:38',
  Asr: '15:52',
  Maghrib: '18:41',
  Isha: '20:02',
}
</script>

<template>
  <header class="header">
    <div>
      <h1 class="text-title margin-bottom">Assalamu alaikum</h1>
      <span class="text-subtitle">3 of 4 habits stacked so far today</span>
    </div>

    <div class="next-flag">
      <span class="text-label margin-bottom">Next up</span>
      <span class="text-eyebrow">Dhuhr · 42m</span>
    </div>
  </header>

  <main class="todo-list">
    <TodoCard
      v-for="todo in habits.filter((h) => !h.paused && isScheduledToday(h.id))"
      :key="todo.id"
      :time="PRAYER_TIMES[todo.anchorPrayer]"
      :todo="todo"
      :completed="isCompletedToday(todo.id)"
      @toggle="toggleComplete"
    />
  </main>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 32px;
  padding-bottom: 20px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--border);
}

.next-flag {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 2px;
}

.margin-bottom {
  margin-bottom: 6px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
