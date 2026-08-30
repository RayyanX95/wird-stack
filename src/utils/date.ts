import type { WeekDay } from '@/types';
import { WEEKDAY_ORDER_SUN_FIRST } from '@/types';

export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Date.getDay() is 0-indexed starting Sunday, hence the Sun-first order here
// (distinct from WEEKDAY_DISPLAY_ORDER, which is Mon-first for UI lists).
export function weekDayOf(date: Date): WeekDay {
  return WEEKDAY_ORDER_SUN_FIRST[date.getDay()] as WeekDay;
}

export function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay()); // back up to Sunday
  return start;
}
