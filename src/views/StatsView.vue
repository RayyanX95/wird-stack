<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useHabitsStore } from '@/stores/habits';
import type { Prayer } from '@/types';
import { PRAYERS, WEEKDAY_DISPLAY_ORDER } from '@/types';
import { fromIso, toIso, weekDayOf } from '@/utils';

const router = useRouter();
const { habits, completions, currentStreak, isNewHabit, dayState } = useHabitsStore();

const MIN_COMPLETIONS_TO_SHOW_STATS = 3;
const TREND_DAYS = 30;

// This-month-to-date, oldest first.
const monthDates = computed(() => {
  const today = new Date();
  const dates: string[] = [];
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
  while (cursor <= today) {
    dates.push(toIso(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
});

/** The last 30 days including today, oldest first — for the activity strip. */
const trendDates = computed(() => {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (TREND_DAYS - 1));
  for (let i = 0; i < TREND_DAYS; i++) {
    dates.push(toIso(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
});

const activeHabits = computed(() => habits.filter((h) => !h.paused));
const pausedCount = computed(() => habits.length - activeHabits.value.length);

const hasEnoughData = computed(() => completions.length >= MIN_COMPLETIONS_TO_SHOW_STATS);

// Pools done/missed counts (scheduled occurrences only — "not-scheduled" days
// never enter the denominator) across a set of habits and dates.
function pooledRate(habitIds: string[], dates: string[]): { done: number; missed: number } {
  let done = 0;
  let missed = 0;
  for (const habitId of habitIds) {
    for (const date of dates) {
      const state = dayState(habitId, date);
      if (state === 'done') done++;
      else if (state === 'missed') missed++;
    }
  }
  return { done, missed };
}

function ratePercent(done: number, missed: number): number | null {
  const total = done + missed;
  if (total === 0) return null;
  return Math.round((done / total) * 100);
}

const activeHabitIds = computed(() => activeHabits.value.map((h) => h.id));

const overallRate = computed(() => {
  const { done, missed } = pooledRate(activeHabitIds.value, monthDates.value);
  return ratePercent(done, missed) ?? 0;
});

// One bar per weekday, normalized by how many *scheduled* habit-occurrences
// fell on that weekday this month — not by raw calendar-day count, so a
// Monday-only habit doesn't get diluted by every other habit's schedule.
//
// `rate` is null, not 0, when nothing was ever scheduled on that weekday: an
// empty column and a 0% column mean completely different things, and drawing
// them the same way was actively misleading.
const weeklyRates = computed(() =>
  WEEKDAY_DISPLAY_ORDER.map((weekDay) => {
    const datesForDay = monthDates.value.filter((iso) => weekDayOf(fromIso(iso)) === weekDay);
    const { done, missed } = pooledRate(activeHabitIds.value, datesForDay);
    return { label: weekDay, rate: ratePercent(done, missed), scheduled: done + missed };
  }),
);

// Pooled (not averaged) so one low-volume habit can't dominate a prayer's rate.
const prayerRates = computed(() => {
  const present = PRAYERS.filter((p) => activeHabits.value.some((h) => h.anchorPrayer === p));
  return present
    .map((prayer) => {
      const ids = activeHabits.value.filter((h) => h.anchorPrayer === prayer).map((h) => h.id);
      const { done, missed } = pooledRate(ids, monthDates.value);
      const rate = ratePercent(done, missed);
      return rate === null ? null : { prayer, rate };
    })
    .filter((entry): entry is { prayer: Prayer; rate: number } => entry !== null);
});

const showPrayerComparison = computed(() => prayerRates.value.length >= 2);
const bestPrayer = computed(() =>
  showPrayerComparison.value
    ? prayerRates.value.reduce((a, b) => (b.rate > a.rate ? b : a)).prayer
    : null,
);
const worstPrayer = computed(() =>
  showPrayerComparison.value
    ? prayerRates.value.reduce((a, b) => (b.rate < a.rate ? b : a)).prayer
    : null,
);

/** Per-day completion ratio for the last 30 days — drives the activity strip. */
const trend = computed(() =>
  trendDates.value.map((iso) => {
    const { done, missed } = pooledRate(activeHabitIds.value, [iso]);
    const total = done + missed;
    return { date: iso, ratio: total === 0 ? null : done / total, done, total };
  }),
);

// Same "at risk" definition already used on the habits list: not paused,
// no current streak, and past the grace period for being a brand-new habit.
const atRiskCount = computed(
  () => activeHabits.value.filter((h) => currentStreak(h.id) === 0 && !isNewHabit(h.id)).length,
);

const bestStreak = computed(() =>
  activeHabits.value.reduce((max, h) => Math.max(max, currentStreak(h.id)), 0),
);

const monthLabel = computed(() =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
);

function intensityClass(ratio: number | null): string {
  if (ratio === null) return 'none';
  if (ratio === 0) return 'l0';
  if (ratio < 0.5) return 'l1';
  if (ratio < 1) return 'l2';
  return 'l3';
}

function shortDate(iso: string): string {
  return fromIso(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
</script>

<template>
  <div class="view">
    <header class="page-header">
      <div>
        <h1 class="text-title margin-bottom">Stats</h1>
        <p class="text-subtitle range">{{ monthLabel }} · to date</p>
      </div>
    </header>

    <div v-if="!hasEnoughData" class="empty-state">
      <div class="empty-icon"><Icon icon="lucide:bar-chart-3" /></div>
      <h2 class="text-title margin-bottom">Not enough data yet</h2>
      <p class="text-subtitle">
        Log a few check-ins and your completion rates, weekday patterns and prayer breakdown will
        show up here.
      </p>
      <button type="button" class="btn primary" @click="router.push('/today')">Go to Today</button>
    </div>

    <template v-else>
      <!-- Headline numbers -->
      <div class="stat-cards">
        <div class="stat-card rise" style="--i: 0">
          <div class="stat-value">{{ overallRate }}%</div>
          <div class="stat-label">Completion rate</div>
        </div>
        <div class="stat-card streak rise" style="--i: 1">
          <div class="stat-value">{{ bestStreak }}</div>
          <div class="stat-label">Best active streak</div>
        </div>
        <div class="stat-card rise" style="--i: 2">
          <div class="stat-value">{{ atRiskCount }}</div>
          <div class="stat-label">At risk</div>
        </div>
        <div class="stat-card rise" style="--i: 3">
          <div class="stat-value">{{ activeHabits.length }}</div>
          <div class="stat-label">Active habits</div>
        </div>
      </div>

      <!-- Weekday chart. Fixed 0–100% scale with gridlines: the old version
           normalized each bar against the tallest one, so a bad week and a
           perfect week drew identically. -->
      <section class="panel rise" style="--i: 4">
        <div class="panel-head">
          <h2 class="text-label">Completion by weekday</h2>
          <span class="text-caption">% of scheduled habits done</span>
        </div>

        <div class="chart">
          <!-- The axis is a sibling of the plot and shares its height, so the
               tick labels line up with the gridlines by construction rather
               than by hand-tuned padding. -->
          <div class="chart-axis" aria-hidden="true">
            <span>100%</span><span>50%</span><span>0%</span>
          </div>

          <div class="chart-body">
            <div class="plot">
              <div class="gridlines" aria-hidden="true">
                <span /><span /><span class="base" />
              </div>

              <div class="bars" role="img" aria-label="Completion rate by weekday">
                <div
                  v-for="d in weeklyRates"
                  :key="d.label"
                  class="bar-col"
                  :style="{ '--h': d.rate ?? 0 }"
                >
                  <span class="bar-value" :class="{ dim: d.rate === null }">
                    {{ d.rate === null ? '–' : `${d.rate}%` }}
                  </span>
                  <div
                    class="bar-fill"
                    :class="{
                      high: (d.rate ?? 0) >= 70,
                      low: d.rate !== null && d.rate < 40,
                      empty: d.rate === null,
                    }"
                  />
                </div>
              </div>
            </div>

            <div class="bar-labels" aria-hidden="true">
              <span v-for="d in weeklyRates" :key="d.label" class="text-caption">{{ d.label }}</span>
            </div>
          </div>
        </div>

        <!-- The chart is decorative to a screen reader; this is the actual data. -->
        <ul class="sr-only">
          <li v-for="d in weeklyRates" :key="d.label">
            {{ d.label }}:
            {{ d.rate === null ? 'nothing scheduled' : `${d.rate}% of ${d.scheduled} scheduled` }}
          </li>
        </ul>
      </section>

      <!-- Last 30 days -->
      <section class="panel rise" style="--i: 5">
        <div class="panel-head">
          <h2 class="text-label">Last 30 days</h2>
          <div class="legend text-caption" aria-hidden="true">
            <span>Less</span>
            <span class="swatch l0" /><span class="swatch l1" /><span class="swatch l2" /><span
              class="swatch l3"
            />
            <span>More</span>
          </div>
        </div>

        <div class="strip">
          <span
            v-for="day in trend"
            :key="day.date"
            class="strip-cell"
            :class="intensityClass(day.ratio)"
            :title="
              day.ratio === null
                ? `${shortDate(day.date)} — nothing scheduled`
                : `${shortDate(day.date)} — ${day.done} of ${day.total} done`
            "
          />
        </div>
      </section>

      <!-- Every prayer, not just the two extremes: seeing the whole ranking is
           what tells you where to actually put the effort. -->
      <section v-if="showPrayerComparison" class="panel rise" style="--i: 6">
        <div class="panel-head">
          <h2 class="text-label">By anchor prayer</h2>
        </div>

        <ul class="prayer-list">
          <li v-for="p in prayerRates" :key="p.prayer" class="prayer-row">
            <span class="prayer-label">
              {{ p.prayer }}
              <span v-if="p.prayer === bestPrayer" class="pill done">Strongest</span>
              <span v-else-if="p.prayer === worstPrayer" class="pill risk">Weakest</span>
            </span>
            <div class="prayer-track">
              <div
                class="prayer-fill"
                :class="{ weak: p.prayer === worstPrayer }"
                :style="{ width: `${p.rate}%` }"
              />
            </div>
            <span class="prayer-value mono">{{ p.rate }}%</span>
          </li>
        </ul>

        <p class="text-caption panel-note">
          <Icon icon="lucide:lightbulb" aria-hidden="true" />
          {{ worstPrayer }} is where habits slip most — try shrinking that one until it is trivial.
        </p>
      </section>

      <p v-if="pausedCount > 0" class="text-caption paused-note">
        {{ pausedCount }} paused habit{{ pausedCount > 1 ? 's' : '' }} excluded from these stats.
      </p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.range {
  margin: 0;
}

.panel {
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
}

.panel-note {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: var(--space-4) 0 0;
}

/* ---------- Weekday chart ----------
 * Fixed 0–100% scale. Bar heights are a percentage of the plot box, and the
 * value label rides on top of its own bar via the same --h custom property,
 * so nothing needs to be kept in sync by hand.
 */
.chart {
  display: flex;
  gap: var(--space-3);
  height: 200px;
}

.chart-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* Matches .bar-labels, so the axis spans exactly the plot box. */
  padding-bottom: 22px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--text-faint);
  text-align: right;
}

.chart-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.plot {
  position: relative;
  flex: 1;
  min-height: 0;
}

.gridlines {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.gridlines span {
  height: 1px;
  background: var(--border);
}
.gridlines .base {
  background: var(--border-strong);
}

.bars {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
}

.bar-col {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-value {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 600;
  color: var(--text-muted);
  /* Sits just above its bar, clamped so a 100% bar's label stays in the box. */
  bottom: min(calc(var(--h) * 1% + 6px), calc(100% - 15px));
  transition: bottom var(--transition-slow);
}
.bar-value.dim {
  color: var(--text-faint);
}

.bar-fill {
  width: 100%;
  height: calc(var(--h) * 1%);
  min-height: 3px;
  border-radius: 5px 5px 2px 2px;
  background: var(--accent-soft);
  transform-origin: bottom;
  animation: bar-grow 620ms var(--ease) both;
  transition: height var(--transition-slow);
}
.bar-fill.high {
  background: linear-gradient(180deg, var(--accent), var(--accent-hover));
}
.bar-fill.low {
  background: rgba(var(--warn-rgb), 0.45);
}
/* Nothing was ever scheduled on this weekday — hatched, not a zero bar. */
.bar-fill.empty {
  height: 3px;
  background: repeating-linear-gradient(
    45deg,
    var(--border) 0,
    var(--border) 1.5px,
    transparent 1.5px,
    transparent 5px
  );
}
@keyframes bar-grow {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.bar-labels {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 22px;
}
.bar-labels span {
  flex: 1;
  min-width: 0;
  text-align: center;
}

/* ---------- 30-day strip ---------- */
.strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14px, 1fr));
  gap: 4px;
}

.strip-cell,
.swatch {
  aspect-ratio: 1;
  border-radius: 3px;
  border: 1px solid var(--border);
}

.strip-cell {
  transition: transform var(--transition-fast);
}
.strip-cell:hover {
  transform: scale(1.25);
}

.strip-cell.none,
.swatch.none {
  background: transparent;
  border-style: dashed;
}
.strip-cell.l0,
.swatch.l0 {
  background: var(--surface-alt);
}
.strip-cell.l1,
.swatch.l1 {
  background: rgba(var(--accent-rgb), 0.32);
  border-color: transparent;
}
.strip-cell.l2,
.swatch.l2 {
  background: rgba(var(--accent-rgb), 0.62);
  border-color: transparent;
}
.strip-cell.l3,
.swatch.l3 {
  background: var(--accent);
  border-color: transparent;
}

.legend {
  display: flex;
  align-items: center;
  gap: 4px;
}
.legend .swatch {
  width: 11px;
  height: 11px;
}

/* ---------- Prayer breakdown ---------- */
.prayer-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.prayer-row {
  display: grid;
  grid-template-columns: 130px 1fr 46px;
  align-items: center;
  gap: var(--space-3);
}

.prayer-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
}
.prayer-label .pill {
  font-size: 9px;
  padding: 2px var(--space-2);
}

.prayer-track {
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--surface-alt);
  overflow: hidden;
}

.prayer-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
  transition: width var(--transition-slow);
}
.prayer-fill.weak {
  background: var(--warn);
}

.prayer-value {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  text-align: right;
}

.paused-note {
  text-align: center;
}

@media (max-width: 720px) {
  .prayer-row {
    grid-template-columns: 96px 1fr 40px;
    gap: var(--space-2);
  }
  .prayer-label {
    font-size: var(--text-xs);
    flex-wrap: wrap;
  }
  .chart {
    height: 165px;
  }
}
</style>
