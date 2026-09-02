<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { useHabitsStore } from '@/stores/habits';
import { useLocale } from '@/composables';
import { WEEKDAY_DISPLAY_ORDER, WEEKDAY_ORDER_SUN_FIRST } from '@/types';
import { intlLocale, isolate, startOfWeek, toIso } from '@/utils';
import { ModalComponent } from '@/components';

const { t } = useI18n();
const { locale, isRtlLocale } = useLocale();
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

const habitId = computed(() => route.params.id as string);
const habit = computed(() => getHabitById(habitId.value));

const todayIso = toIso(new Date());

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
    const iso = toIso(d);
    const isFuture = iso > todayIso;
    days.push({
      date: iso,
      dayNumber: d.getDate(),
      // Keyed off the weekday value rather than Intl's narrow name so the
      // Arabic column headers are the ح/ن/ث set the locale file defines,
      // not Intl's own (which repeats "ا" for three different days).
      dowLabel: t(`weekdays.short.${WEEKDAY_ORDER_SUN_FIRST[d.getDay()]}`),
      isToday: iso === todayIso,
      state: isFuture ? 'upcoming' : dayState(habitId.value, iso),
    });
  }
  return days;
});

const weekRangeLabel = computed(() => {
  if (weekDays.value.length === 0) return '';
  const format = (iso: string) =>
    new Date(iso).toLocaleDateString(intlLocale(locale.value), {
      month: 'short',
      day: 'numeric',
    });
  if (weekOffset.value === 0) return t('habitDetails.thisWeek');
  // The earlier date leads in both directions; in RTL that means it belongs
  // on the right, which is what swapping the operands around the dash does.
  const [from, to] = [weekDays.value[0]!.date, weekDays.value[6]!.date];
  return isRtlLocale.value
    ? `${format(to)} – ${format(from)}`
    : `${format(from)} – ${format(to)}`;
});

const createdOnLabel = computed(() => {
  if (!habit.value) return '';
  return new Date(habit.value.createdAt).toLocaleDateString(intlLocale(locale.value), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

const onTogglePause = () => {
  if (!habit.value) return;
  togglePause(habit.value.id);
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

const scheduledDays = computed(() =>
  WEEKDAY_DISPLAY_ORDER.filter((day) => habit.value?.days.includes(day)),
);
</script>

<template>
  <div class="view habit-details-page">
    <RouterLink to="/habits" class="back-link">{{ t('habitDetails.backToHabits') }}</RouterLink>

    <ModalComponent
      v-model:open="showDeleteConfirm"
      :title="t('habitDetails.deleteTitle')"
      :message="t('habitDetails.deleteBody', { title: isolate(habit?.title) })"
      :close-btn-label="t('common.cancel')"
      :success-btn-label="t('common.delete')"
      variant="error"
      @success="onConfirmDelete"
    />

    <ModalComponent
      v-model:open="showDeletedModal"
      :title="t('habitDetails.deletedTitle')"
      :message="t('habitDetails.deletedBody')"
      :close-btn-label="t('common.close')"
      variant="info"
    />

    <template v-if="habit">
      <header class="page-header">
        <h1 class="text-title margin-bottom">
          <bdi>{{ habit.title }}</bdi>
          <span v-if="habit.paused" class="pill new">{{ t('habits.status.paused') }}</span>
        </h1>
        <span class="text-subtitle">
          {{
            t('habits.afterPrayer', {
              prayer: t(`prayers.${habit.anchorPrayer}`),
              minimal: isolate(habit.minimalVersion),
            })
          }}
        </span>
        <span class="text-caption created-on">
          {{ t('habitDetails.startedOn', { date: createdOnLabel }) }}
        </span>
      </header>

      <div class="stat-cards">
        <div class="stat-card" :class="{ streak: currentStreak(habit.id) > 0 }">
          <div class="stat-value">{{ currentStreak(habit.id) }}</div>
          <div class="stat-label">{{ t('habitDetails.currentStreak') }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">
            {{ Math.max(longestStreak(habit.id), currentStreak(habit.id)) }}
          </div>
          <div class="stat-label">{{ t('habitDetails.longestStreak') }}</div>
        </div>
      </div>

      <div class="field">
        <div class="field-label">{{ t('habitDetails.scheduledDays') }}</div>
        <div class="day-pills">
          <span v-for="day in scheduledDays" :key="day" class="day-pill selected">
            {{ t(`weekdays.long.${day}`) }}
          </span>
        </div>
      </div>

      <div class="history-panel">
        <div class="history-header">
          <!-- The chevrons follow the reading direction: "back in time" points
               left in English and right in Arabic. Swapping the icons rather
               than the buttons keeps the DOM order (previous, label, next)
               intact for screen readers. -->
          <button
            type="button"
            class="week-nav"
            :aria-label="t('habitDetails.previousWeek')"
            @click="goToPreviousWeek"
          >
            <Icon :icon="isRtlLocale ? 'lucide:chevron-right' : 'lucide:chevron-left'" />
          </button>
          <span class="text-label">{{ weekRangeLabel }}</span>
          <button
            type="button"
            class="week-nav"
            :aria-label="t('habitDetails.nextWeek')"
            :disabled="!canGoToNextWeek"
            @click="goToNextWeek"
          >
            <Icon :icon="isRtlLocale ? 'lucide:chevron-left' : 'lucide:chevron-right'" />
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
                ? t('habitDetails.cellNotScheduled', { date: d.date })
                : d.state === 'upcoming'
                  ? t('habitDetails.cellUpcoming', { date: d.date })
                  : d.state === 'done'
                    ? t('habitDetails.cellDone', { date: d.date })
                    : t('habitDetails.cellMissed', { date: d.date })
            "
            @click="toggleComplete(habit.id, d.date)"
          >
            <span v-if="d.state !== 'done'" class="day-number">{{ d.dayNumber }}</span>
          </button>
        </div>

        <div class="legend-row text-caption">
          <span class="legend-item">
            <span class="legend-key done" aria-hidden="true" /> {{ t('common.done') }}
          </span>
          <span class="legend-item">
            <span class="legend-key missed" aria-hidden="true" /> {{ t('common.missed') }}
          </span>
          <span class="legend-item">
            <span class="legend-key off" aria-hidden="true" /> {{ t('common.notScheduled') }}
          </span>
        </div>
      </div>

      <div class="btn-row">
        <button type="button" class="btn ghost" @click="onTogglePause">
          <Icon :icon="habit.paused ? 'lucide:play' : 'lucide:pause'" aria-hidden="true" />
          {{ habit.paused ? t('common.resume') : t('common.pause') }}
        </button>
        <RouterLink :to="`/habits/${habit.id}/edit`" class="btn ghost">
          <Icon icon="lucide:pencil" aria-hidden="true" />
          {{ t('common.edit') }}
        </RouterLink>
        <button type="button" class="btn danger" @click="onDelete">
          <Icon icon="lucide:trash-2" aria-hidden="true" />
          {{ t('common.delete') }}
        </button>
      </div>
    </template>

    <p v-else-if="!showDeletedModal" class="text-subtitle">{{ t('habitDetails.notFound') }}</p>
  </div>
</template>

<style scoped lang="scss">
.habit-details-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.created-on {
  display: block;
  margin-top: var(--space-1);
}

/* The calendar and its controls read as one unit, not three stacked widgets. */
.history-panel {
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
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
  gap: var(--space-3);
  flex-wrap: wrap;
}

.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.legend-key {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid var(--border);
}
.legend-key.done {
  background: var(--accent);
  border-color: var(--accent);
}
.legend-key.missed {
  background: var(--warn-soft);
  border-color: rgba(var(--warn-rgb), 0.35);
}
.legend-key.off {
  background: var(--surface-alt);
  border-style: dashed;
}
</style>
