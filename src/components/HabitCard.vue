<script setup lang="ts">
import type { HabitItem, WeekDay } from '@/types';
import { useRouter } from 'vue-router';

const props = defineProps<{
  time: string;
  todo: HabitItem;
  completed: boolean;
}>();

const emit = defineEmits<{ toggle: [id: string] }>();

const ALL_DAYS: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isDaily = (days: WeekDay[]) => days.length === ALL_DAYS.length;

const router = useRouter();

const meta = props.todo.days
  ? isDaily(props.todo.days)
    ? props.todo.minimalVersion
    : `${props.todo.minimalVersion} · ${props.todo.days.join(', ')}`
  : props.todo.minimalVersion;
</script>

<template>
  <!-- highlighted border is conditional on the habit still being open for today -->
  <div
    class="prayer-block"
    :class="{ next: !completed }"
    @click="router.push(`/habits/${todo.id}`)"
  >
    <div class="prayer-block-head">
      <span class="prayer-name">
        {{ todo.anchorPrayer }} — {{ completed ? 'Done' : 'Next up' }}
      </span>
      <span class="prayer-time mono">{{ time }}</span>
    </div>

    <div class="prayer-rows">
      <div class="habit-row">
        <button
          class="habit-check"
          :class="{ on: completed }"
          :aria-label="completed ? 'Mark incomplete' : 'Mark complete'"
          @click.stop="emit('toggle', todo.id)"
        >
          <span v-if="completed">✓</span>
        </button>
        <div class="habit-body">
          <div class="habit-title">{{ todo.title }}</div>
          <div class="habit-meta">{{ meta }}</div>
        </div>
        <!-- two todo-row variants, conditional on completion -->
        <button v-if="!completed" class="habit-action" @click.stop="emit('toggle', todo.id)">
          Mark done
        </button>
      </div>
    </div>
  </div>
</template>
