<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useHabitsStore } from '@/stores/habits';
import type { WeekDay } from '@/types';
import { LoadingOverlay, ModalComponent } from '@/components';

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
const router = useRouter();
const {
  getHabitById,
  deleteHabit,
  togglePause,
  toggleComplete,
  currentStreak,
  longestStreak,
  dayState,
} = useHabitsStore();

const showDeleteConfirm = ref(false);
const showDeletedModal = ref(false);
const isTogglingPause = ref(false);

const habitId = computed(() => route.params.id as string);
const habit = computed(() => getHabitById(habitId.value));

const todayIso = new Date().toISOString().slice(0, 10);

function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay()); // back up to Sunday
  return start;
}

// 0 = the week containing today, negative = weeks back in time. Users can
// go back indefinitely but never forward past the current week.
const weekOffset = ref(0);
const canGoToNextWeek = computed(() => weekOffset.value < 0);

const goToPreviousWeek = () => {
  weekOffset.value -= 1;
};

const goToNextWeek = () => {
  if (canGoToNextWeek.value) weekOffset.value += 1;
};

// Standard calendar week, Sunday–Saturday, resolved day-by-day to its real
// state via the store — not static example data. Days after today are
// "upcoming": they can't be scheduled/missed/done yet, regardless of what
// dayState() would otherwise say about that weekday.
const weekDays = computed(() => {
  if (!habit.value) return [];

  const weekStart = startOfWeek(new Date());
  weekStart.setDate(weekStart.getDate() + weekOffset.value * 7);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const isFuture = iso > todayIso;
    days.push({
      date: iso,
      dayNumber: d.getDate(),
      dowLabel: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: iso === todayIso,
      state: isFuture ? 'upcoming' : dayState(habitId.value, iso),
    });
  }
  return days;
});

const weekRangeLabel = computed(() => {
  if (weekDays.value.length === 0) return '';
  const format = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return weekOffset.value === 0
    ? 'This week'
    : `${format(weekDays.value[0]!.date)} – ${format(weekDays.value[6]!.date)}`;
});

// fake delay — there's no real API call yet, this just gives the loading
// overlay something to show before the toggle lands in the store.
const onTogglePause = async () => {
  if (!habit.value) return;
  isTogglingPause.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  togglePause(habit.value.id);
  isTogglingPause.value = false;
};

const onDelete = () => {
  showDeleteConfirm.value = true;
};

const onConfirmDelete = () => {
  if (!habit.value) return;
  deleteHabit(habit.value.id);
  showDeleteConfirm.value = false;
  showDeletedModal.value = true;
};

// Navigate back to the list whenever the "deleted" confirmation closes,
// however it closes (Close button, X, escape, overlay click).
watch(showDeletedModal, (isOpen) => {
  if (!isOpen) router.push('/habits');
});

const scheduledDays = computed(() => DAYS.filter((day) => habit.value?.days.includes(day.value)));
</script>

<template>
  <div class="habit-details-page">
    <RouterLink to="/habits" class="back-link">Back to habits</RouterLink>

    <LoadingOverlay :show="isTogglingPause" label="Saving…" />

    <ModalComponent
      v-model:open="showDeleteConfirm"
      title="Delete habit?"
      :message="`This will permanently delete '${habit?.title}' and its completion history. This can't be undone.`"
      close-btn-label="Cancel"
      success-btn-label="Delete"
      variant="error"
      @success="onConfirmDelete"
    />

    <ModalComponent
      v-model:open="showDeletedModal"
      title="Deleted"
      message="The habit has been deleted."
      close-btn-label="Close"
      variant="info"
    />

    <template v-if="habit">
      <header class="page-header">
        <h1 class="text-title margin-bottom">
          {{ habit.title }}
          <span v-if="habit.paused" class="pill new">Paused</span>
        </h1>
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
        <div class="history-header">
          <button
            type="button"
            class="week-nav"
            aria-label="Previous week"
            @click="goToPreviousWeek"
          >
            <Icon icon="lucide:chevron-left" />
          </button>
          <span class="text-label">{{ weekRangeLabel }}</span>
          <button
            type="button"
            class="week-nav"
            aria-label="Next week"
            :disabled="!canGoToNextWeek"
            @click="goToNextWeek"
          >
            <Icon icon="lucide:chevron-right" />
          </button>
        </div>

        <div class="history-dow">
          <span v-for="d in weekDays" :key="d.date">{{ d.dowLabel }}</span>
        </div>
        <div class="history-week">
          <button
            v-for="d in weekDays"
            :key="d.date"
            type="button"
            class="history-cell"
            :class="{
              on: d.state === 'done',
              missed: d.state === 'missed',
              'not-scheduled': d.state === 'not-scheduled',
              upcoming: d.state === 'upcoming',
              today: d.isToday,
            }"
            :disabled="d.state === 'not-scheduled' || d.state === 'upcoming' || habit.paused"
            :title="d.date"
            :aria-label="
              d.state === 'not-scheduled'
                ? `${d.date} — not scheduled`
                : d.state === 'upcoming'
                  ? `${d.date} — upcoming`
                  : `${d.date} — ${d.state === 'done' ? 'completed, click to unmark' : 'missed, click to mark done'}`
            "
            @click="toggleComplete(habit.id, d.date)"
          >
            <span v-if="d.state !== 'done'" class="day-number">{{ d.dayNumber }}</span>
          </button>
        </div>
      </div>

      <div class="btn-row">
        <button
          type="button"
          class="btn ghost"
          :disabled="isTogglingPause"
          @click="onTogglePause"
        >
          {{ habit.paused ? 'Resume' : 'Pause' }}
        </button>
        <button type="button" class="btn ghost" @click="router.push(`${habit.id}/edit`)">
          Edit
        </button>
        <button type="button" class="btn danger" @click="onDelete">Delete</button>
      </div>
    </template>

    <p v-else-if="!showDeletedModal" class="text-subtitle">Habit not found.</p>
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

.history-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 8px;
}

.history-header .text-label {
  min-width: 96px;
  text-align: center;
}

.week-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}
.week-nav:hover:not(:disabled) {
  background: var(--surface-alt);
}
.week-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.day-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}
.history-cell.missed .day-number {
  color: var(--warn);
}
.history-cell.not-scheduled .day-number,
.history-cell.upcoming .day-number {
  color: var(--text-faint);
}

.history-cell.upcoming {
  background: var(--surface);
  border-style: dashed;
}

.history-cell.today {
  box-shadow: 0 0 0 2px var(--accent);
}

.btn-row {
  display: flex;
  gap: 12px;
}
</style>
