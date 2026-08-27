<script setup lang="ts">
import type { HabitItem, WeekDay } from '@/types'

const props = defineProps<{
  time: string
  todo: HabitItem
}>()

const emit = defineEmits<{ toggle: [id: string] }>()

const ALL_DAYS: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const isDaily = (days: WeekDay[]) => days.length === ALL_DAYS.length

const meta = props.todo.days
  ? isDaily(props.todo.days)
    ? props.todo.minimalVersion
    : `${props.todo.minimalVersion} · ${props.todo.days.join(', ')}`
  : props.todo.minimalVersion
</script>

<template>
  <!-- highlighted border is conditional on todo.status === 'next' via the .next class -->
  <div class="prayer-block" :class="{ next: todo.status === 'next' }">
    <div class="prayer-block-head">
      <span class="prayer-name">
        {{ todo.anchorPrayer }} — {{ todo.status === 'passed' ? 'Passed' : 'Next up' }}
      </span>
      <span class="prayer-time mono">{{ time }}</span>
    </div>

    <div class="prayer-rows">
      <div class="habit-row">
        <button
          class="habit-check"
          :class="{ on: todo.status === 'passed' }"
          :aria-label="todo.status === 'passed' ? 'Mark incomplete' : 'Mark complete'"
          @click="emit('toggle', todo.id)"
        >
          <span v-if="todo.status === 'passed'">✓</span>
        </button>
        <div class="habit-body">
          <div class="habit-title">{{ todo.title }}</div>
          <div class="habit-meta">{{ meta }}</div>
        </div>
        <!-- two todo-row variants, conditional on status -->
        <button v-if="todo.status === 'next'" class="habit-action" @click="emit('toggle', todo.id)">
          Mark done
        </button>
      </div>
    </div>
  </div>
</template>
