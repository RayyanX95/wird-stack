export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

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
