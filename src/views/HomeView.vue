<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import { PrayerGroup, ProgressRing } from '@/components';
import { useLocale, useNow, usePrayerTimes, CALCULATION_METHOD_IDS } from '@/composables';
import { useHabitsStore } from '@/stores/habits';
import { PRAYERS } from '@/types';
import { gregorianLabel, hijriLabel, timeOfDayGreeting } from '@/utils';

const { t } = useI18n();
const { locale } = useLocale();

const now = useNow(30_000);
const {
  status,
  error,
  schedule,
  nextPrayer,
  countdown,
  timeFor,
  usingFallbackLocation,
  locationLabel,
  requestLocation,
  method,
  setMethod,
} = usePrayerTimes(now, { autoLocate: true });

const { habits, isCompletedToday, isScheduledToday, toggleComplete } = useHabitsStore();

const greeting = computed(() => t(`today.greeting.${timeOfDayGreeting(now.value)}`));

// Recomputed from the ticking clock so a tab left open overnight rolls over
// to the new date instead of showing yesterday's — and from `locale`, so a
// language switch reformats it rather than leaving an English date under
// Arabic copy.
const dateLabel = computed(() => gregorianLabel(now.value, locale.value));
const hijri = computed(() => hijriLabel(now.value, locale.value));

/** Active habits due today — the denominator for everything on this screen. */
const dueToday = computed(() => habits.filter((h) => !h.paused && isScheduledToday(h.id)));

// A true first run (no habits exist anywhere) gets its own onboarding
// message — distinct from "habits exist, just none scheduled today" (every
// habit paused, or all of them run on other days), which shouldn't repeat the
// "create your first habit" pitch to someone who already has habits.
const hasNoHabitsAtAll = computed(() => habits.length === 0);

// A Set rather than calling isCompletedToday() per row: the store scans the
// whole completion log on each call, and this screen would otherwise do that
// once per habit per re-render, of which there is one every clock tick.
const completedIds = computed(
  () => new Set(dueToday.value.filter((h) => isCompletedToday(h.id)).map((h) => h.id)),
);

const doneCount = computed(() => completedIds.value.size);
const allDone = computed(
  () => dueToday.value.length > 0 && doneCount.value === dueToday.value.length,
);

/**
 * Habits grouped under their anchor prayer, in clock order.
 *
 * Falls back to the canonical Fajr→Isha order when times haven't loaded, so
 * the list is never empty or randomly ordered while the network is in flight.
 */
const groups = computed(() => {
  const order = schedule.value.length > 0 ? schedule.value.map((s) => s.prayer) : PRAYERS;
  return order
    .map((prayer) => ({
      prayer,
      time: timeFor(prayer),
      habits: dueToday.value.filter((h) => h.anchorPrayer === prayer),
    }))
    .filter((group) => group.habits.length > 0);
});

/** True once this prayer's time has passed today — dims blocks already behind us. */
const passedPrayers = computed(() => {
  const minutes = now.value.getHours() * 60 + now.value.getMinutes();
  return new Set(schedule.value.filter((s) => s.minutes <= minutes).map((s) => s.prayer));
});

const summary = computed(() => {
  if (dueToday.value.length === 0) return t('today.summaryNone');
  if (allDone.value) return t('today.summaryAllDone');
  return t('today.summaryProgress', { done: doneCount.value, total: dueToday.value.length });
});
</script>

<template>
  <div class="view">
    <header class="today-header">
      <div class="today-intro">
        <h1 class="text-title">{{ greeting }}</h1>
        <p class="today-date text-caption">
          {{ dateLabel
          }}<template v-if="hijri">
            · <span class="hijri">{{ hijri }}</span></template
          >
        </p>
        <p class="text-subtitle summary">{{ summary }}</p>
      </div>

      <!-- Progress and the next prayer are one card, not two loose clusters:
           they answer the same question ("where am I in the day?") and reading
           them as separate widgets was the main thing wrong with this header. -->
      <!-- Guarded as a whole: with nothing due and no times loaded yet, both
           halves are empty and the card would render as a bare box. -->
      <div
        v-if="dueToday.length > 0 || nextPrayer"
        class="day-status"
        :class="{ complete: allDone }"
      >
        <ProgressRing v-if="dueToday.length > 0" :value="doneCount" :total="dueToday.length" />

        <div v-if="dueToday.length > 0 && nextPrayer" class="status-divider" aria-hidden="true" />

        <div v-if="nextPrayer" class="next-prayer">
          <span class="text-label">
            {{ nextPrayer.isTomorrow ? t('today.tomorrow') : t('today.nextPrayer') }}
          </span>
          <span class="np-name">{{ t(`prayers.${nextPrayer.prayer}`) }}</span>
          <span class="np-meta">
            <span class="np-countdown mono">{{ t('today.inTime', { time: countdown }) }}</span>
            <span class="np-time mono">{{ nextPrayer.time }}</span>
          </span>
        </div>
      </div>
    </header>

    <!-- Only shown when the times on screen aren't actually the user's — a
         standing banner nobody can dismiss would be worse than useless. -->
    <div v-if="usingFallbackLocation && status === 'ready'" class="notice">
      <Icon icon="lucide:map-pin" aria-hidden="true" />
      <span class="text-meta">
        {{ t('today.fallbackLocation', { location: locationLabel }) }}
      </span>
      <button type="button" class="btn ghost notice-btn" @click="requestLocation">
        {{ t('today.useMyLocation') }}
      </button>
    </div>

    <div v-if="status === 'error'" class="notice warn">
      <Icon icon="lucide:cloud-off" aria-hidden="true" />
      <span class="text-meta">{{ error ?? t('today.timesUnavailable') }}</span>
    </div>

    <div v-if="hasNoHabitsAtAll" class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:sparkles" /></div>
      <h2 class="text-title margin-bottom">{{ t('today.firstRunTitle') }}</h2>
      <p class="text-subtitle">{{ t('today.firstRunBody') }}</p>
      <RouterLink to="/habits/new" class="btn primary">{{ t('today.createFirst') }}</RouterLink>
    </div>

    <div v-else-if="dueToday.length === 0" class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:sunrise" /></div>
      <h2 class="text-title margin-bottom">{{ t('today.emptyTitle') }}</h2>
      <p class="text-subtitle">{{ t('today.emptyBody') }}</p>
      <RouterLink to="/habits/new" class="btn primary">{{ t('today.addAnother') }}</RouterLink>
    </div>

    <div v-else class="groups">
      <PrayerGroup
        v-for="(group, i) in groups"
        :key="group.prayer"
        class="rise"
        :style="{ '--i': i }"
        :prayer="group.prayer"
        :time="group.time"
        :habits="group.habits"
        :is-next="nextPrayer?.prayer === group.prayer && !nextPrayer.isTomorrow"
        :is-passed="passedPrayers.has(group.prayer)"
        :completed-ids="completedIds"
        :countdown="countdown"
        @toggle="toggleComplete"
      />
    </div>

    <!-- Location and calculation method are both settings someone sets once and
         rarely revisits — kept in one <details> so neither costs anything
         visually until someone goes looking for it. The fallback notice above
         already surfaces the location prompt when it matters (times aren't the
         user's own); this is the same control, just reachable any time someone
         travels or wants a fresh fix rather than only when on the fallback city. -->
    <details class="method-picker">
      <summary class="text-caption">{{ t('today.settingsPicker') }}</summary>

      <div class="location-row">
        <Icon icon="lucide:map-pin" aria-hidden="true" />
        <span class="text-meta">{{ locationLabel }}</span>
        <button
          type="button"
          class="btn ghost notice-btn"
          :disabled="status === 'locating'"
          @click="requestLocation"
        >
          <Icon icon="lucide:refresh-cw" aria-hidden="true" />
          {{ status === 'locating' ? t('today.locating') : t('today.refreshLocation') }}
        </button>
      </div>

      <div class="method-options">
        <button
          v-for="id in CALCULATION_METHOD_IDS"
          :key="id"
          type="button"
          class="method-option"
          :class="{ selected: method === id }"
          @click="setMethod(id)"
        >
          {{ t(`prayerTimes.methods.${id}`) }}
        </button>
      </div>
    </details>
  </div>
</template>

<style scoped lang="scss">
.today-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
}

.today-intro {
  min-width: 0;
}

.today-date {
  margin: var(--space-1) 0 var(--space-3);
  letter-spacing: 0.01em;
}

.hijri {
  color: var(--accent);
  font-weight: 600;
}

.summary {
  margin: 0;
}

/* The status card. */
.day-status {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  /* Logical padding — the ring sits on the leading edge and wants the tighter
     inset, which is the left one in English and the right one in Arabic. */
  padding-block: var(--space-3);
  padding-inline: var(--space-4) var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition:
    background-color var(--transition),
    border-color var(--transition),
    box-shadow var(--transition);
}

/* Everything done — the one moment in the app worth celebrating. */
.day-status.complete {
  background: linear-gradient(165deg, var(--gold-soft), var(--surface));
  border-color: rgba(var(--gold-rgb), 0.35);
  box-shadow:
    0 2px 6px rgba(var(--gold-rgb), 0.12),
    0 14px 28px -16px rgba(var(--gold-rgb), 0.4);
}

.status-divider {
  align-self: stretch;
  width: 1px;
  margin: var(--space-1) 0;
  background: var(--border);
}

.next-prayer {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.np-name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text);
  line-height: 1.15;
}

.np-meta {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.np-countdown {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--accent);
}

.np-time {
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.notice {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--info-soft);
  border: 1px solid rgba(var(--info-rgb), 0.28);
  color: var(--info);
}
.notice.warn {
  background: var(--warn-soft);
  border-color: rgba(var(--warn-rgb), 0.28);
  color: var(--warn);
}
.notice .text-meta {
  flex: 1;
  min-width: 0;
  color: inherit;
}
.notice-btn {
  min-height: 32px;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.method-picker {
  margin-top: var(--space-4);
}

.location-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  color: var(--text-muted);
}
.location-row .text-meta {
  flex: 1;
}
.method-picker summary {
  cursor: pointer;
  color: var(--text-faint);
  width: fit-content;
}
.method-picker summary:hover {
  color: var(--accent);
}

.method-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.method-option {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast),
    background-color var(--transition-fast);
}
.method-option:hover {
  border-color: var(--accent);
  color: var(--text);
}
.method-option.selected {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent-on-soft);
  font-weight: 600;
}

@media (max-width: 720px) {
  .today-header {
    gap: var(--space-4);
  }
  /* The card goes full width under the greeting rather than squeezing beside it. */
  .day-status {
    width: 100%;
    justify-content: flex-start;
    gap: var(--space-5);
  }
}
</style>
