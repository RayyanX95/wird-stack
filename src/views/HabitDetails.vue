<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
const { getHabitById, deleteHabit, togglePause, currentStreak, longestStreak, dayState } =
  useHabitsStore();

const showDeleteConfirm = ref(false);
const showDeletedModal = ref(false);
const isTogglingPause = ref(false);

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

.history-grid > div + div {
  margin-top: 8px;
}

.btn-row {
  display: flex;
  gap: 12px;
}
</style>
