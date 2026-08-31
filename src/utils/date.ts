import type { WeekDay } from '@/types';
import { WEEKDAY_ORDER_SUN_FIRST } from '@/types';

/**
 * A date's calendar day in the *user's* timezone, as 'YYYY-MM-DD'.
 *
 * Deliberately not `toISOString().slice(0, 10)`: that converts to UTC first,
 * so for anyone west of Greenwich an evening check-in lands on tomorrow's date
 * (and for anyone east, an early-morning one lands on yesterday's). Since this
 * string is the key the whole completion log — and therefore every streak — is
 * built on, it has to mean the day the user is actually living in.
 */
export function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses a 'YYYY-MM-DD' key back into a local-midnight Date — the inverse of toIso. */
export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
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

/** Greeting keyed to the time of day — the Today view's first line. */
export function timeOfDayGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'A blessed night';
  if (h < 12) return 'A blessed morning';
  if (h < 17) return 'A blessed afternoon';
  return 'A blessed evening';
}

/** e.g. "Sunday, 30 August" — the everyday date, weekday first. */
export function gregorianLabel(date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

/**
 * The Hijri date, e.g. "17 Rabiʻ I 1448".
 *
 * Uses the Umm al-Qura variant — the civil calendar Saudi Arabia keeps and the
 * one most Islamic apps show — rather than the tabular `islamic` calendar,
 * which can differ by a day. Built from `formatToParts` because the canned
 * locale patterns put the year in awkward places and append "AH", which is
 * redundant next to a Gregorian date.
 *
 * Wrapped in a try/catch: the Islamic calendars are part of the full ICU data
 * set, and a browser built without it throws on the locale rather than falling
 * back. A missing Hijri line is a fine degradation; a crashed header is not.
 */
export function hijriLabel(date = new Date()): string | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(date);

    const find = (type: string) => parts.find((p) => p.type === type)?.value;
    const day = find('day');
    const month = find('month');
    const year = find('year');
    if (!day || !month || !year) return null;

    return `${day} ${month} ${year}`;
  } catch {
    return null;
  }
}
