export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export const PRAYERS: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Index-aligned with Date.getDay() (0 = Sunday) — for looking up a weekday by
// its numeric index. See utils/date.ts#weekDayOf.
export const WEEKDAY_ORDER_SUN_FIRST: WeekDay[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

// Mon-first — how weekdays are listed in the UI (day pickers, weekly charts).
export const WEEKDAY_DISPLAY_ORDER: WeekDay[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

// Weekday labels (both long and one-glyph forms) live in the locale files
// under `weekdays.*`, keyed by the same values as WeekDay — a label is
// language, and this module is data.

export interface AddHabitPayload {
  title: string;
  anchorPrayer: Prayer;
  minimalVersion: string;
  days: WeekDay[];
}

// Persisted habit entity — shaped the way a backend table would store it.
// Deliberately carries no derived fields (streak, isCompleted, status):
// those depend on "now" and on the Completion log, so they'd go stale the
// moment stored. They're computed on demand instead — see stores/habits.ts.
export interface HabitItem extends AddHabitPayload {
  id: string;
  createdAt: string;
  paused: boolean;
}

// One row per habit per day it was completed — what a backend would store
// in a `completions` table, keyed by (habitId, date). This log is the only
// source of truth; streak/longest-streak/calendar state are all derived
// from it, never stored themselves.
export interface Completion {
  id: string;
  habitId: string;
  date: string; // ISO date 'YYYY-MM-DD'
  completedAt: string; // ISO timestamp
}

// Derived, not persisted — what one calendar cell renders as for a given
// habit + date. "missed" and "not-scheduled" are kept distinct on purpose:
// a day the habit was never scheduled on shouldn't read as a missed one.
export type HabitDayState = 'done' | 'missed' | 'not-scheduled';
