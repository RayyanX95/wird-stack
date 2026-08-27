import type { Completion } from '@/types'

// Seed completion log for the mock habits — generated relative to "today" so
// the streaks below stay correct no matter when the app is run.

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function isoDaysAgo(n: number): string {
  return iso(daysAgo(n))
}

// Last `count` occurrences of a given weekday (0 = Sun ... 6 = Sat), walking
// backward from today — for habits scheduled on specific days only.
function lastWeekdays(weekday: number, count: number): string[] {
  const dates: string[] = []
  const cursor = new Date()
  while (dates.length < count) {
    if (cursor.getDay() === weekday) dates.push(iso(cursor))
    cursor.setDate(cursor.getDate() - 1)
  }
  return dates
}

function makeCompletions(habitId: string, dates: string[]): Completion[] {
  return dates.map((date) => ({
    id: crypto.randomUUID(),
    habitId,
    date,
    completedAt: `${date}T06:00:00.000Z`,
  }))
}

export const mockCompletions: Completion[] = [
  // Read Qur'an — daily. Current streak: today + 11 days back = 12.
  // A gap at day 12 back, then a run of 21 more days = a 21-day "longest streak" further back.
  ...makeCompletions(
    '1',
    [...Array.from({ length: 12 }, (_, i) => i), ...Array.from({ length: 21 }, (_, i) => i + 13)].map(
      isoDaysAgo,
    ),
  ),

  // Dhikr — daily, not done yet today. 8-day streak ending yesterday.
  ...makeCompletions(
    '2',
    Array.from({ length: 8 }, (_, i) => i + 1).map(isoDaysAgo),
  ),

  // Fast Mondays — the last 3 Mondays.
  ...makeCompletions('3', lastWeekdays(1, 3)),

  // Sadaqah Friday — paused, no history yet.
  ...makeCompletions('4', []),
]
