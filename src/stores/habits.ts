import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { mockCompletions, mockHabits } from '@/mocks';
import type { AddHabitPayload, HabitDayState, HabitItem, WeekDay } from '@/types';

const WEEKDAYS: WeekDay[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function weekDayOf(date: Date): WeekDay {
  return WEEKDAYS[date.getDay()] as WeekDay;
}

export const useHabitsStore = defineStore('habits', () => {
  const habits = reactive(mockHabits);
  const completions = reactive(mockCompletions);

  const onAddHabit = (payload: AddHabitPayload) => {
    const newHabit: HabitItem = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      paused: false,
    };
    habits.push(newHabit);
  };

  const deleteHabit = (habitId: string) => {
    const index = habits.findIndex((h) => h.id === habitId);
    if (index >= 0) habits.splice(index, 1);

    for (let i = completions.length - 1; i >= 0; i--) {
      if (completions[i]?.habitId === habitId) completions.splice(i, 1);
    }
  };

  const getHabitById = (id: string) => {
    if (!id) return null;

    return habits.find((h) => h.id === id) ?? null;
  };

  const isCompletedOn = (habitId: string, date: string): boolean => {
    return completions.some((c) => c.habitId === habitId && c.date === date);
  };

  const isCompletedToday = (habitId: string): boolean => {
    return isCompletedOn(habitId, toIso(new Date()));
  };

  const toggleComplete = (habitId: string, date: string = toIso(new Date())) => {
    const index = completions.findIndex((c) => c.habitId === habitId && c.date === date);
    if (index >= 0) {
      completions.splice(index, 1);
    } else {
      completions.push({ id: crypto.randomUUID(), habitId, date, completedAt: new Date().toISOString() });
    }
  };

  // Walks backward from today, counting consecutive *scheduled* days that
  // have a completion. Non-scheduled days are skipped, not counted as a
  // miss. If today is scheduled but not done yet, it isn't held against the
  // streak until the day is actually over — the walk starts from yesterday.
  const currentStreak = (habitId: string): number => {
    const habit = getHabitById(habitId);
    if (!habit) return 0;

    const cursor = new Date();
    if (habit.days.includes(weekDayOf(cursor)) && !isCompletedOn(habitId, toIso(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    for (let i = 0; i < 3650; i++) {
      if (habit.days.includes(weekDayOf(cursor))) {
        if (isCompletedOn(habitId, toIso(cursor))) {
          streak++;
        } else {
          break;
        }
      }
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  };

  // Scans the full history (from the habit's creation date to today) for the
  // longest run of consecutive completed *scheduled* days.
  const longestStreak = (habitId: string): number => {
    const habit = getHabitById(habitId);
    if (!habit) return 0;

    const cursor = new Date(habit.createdAt);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    let running = 0;
    let longest = 0;
    while (cursor <= end) {
      if (habit.days.includes(weekDayOf(cursor))) {
        if (isCompletedOn(habitId, toIso(cursor))) {
          running++;
          longest = Math.max(longest, running);
        } else {
          running = 0;
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return longest;
  };

  // True until the habit has had at least one *scheduled* day pass without a
  // completion — i.e. it hasn't had the chance to be "at risk" yet, it's
  // just new. A freshly created habit, or one whose only scheduled day is
  // still today/in the future, counts as new even with a 0 streak.
  const isNewHabit = (habitId: string): boolean => {
    const habit = getHabitById(habitId);
    if (!habit) return false;

    const cursor = new Date(habit.createdAt);
    cursor.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    while (cursor <= yesterday) {
      if (habit.days.includes(weekDayOf(cursor)) && !isCompletedOn(habitId, toIso(cursor))) {
        return false;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  };

  // What one calendar cell should render as for a given habit + date.
  const dayState = (habitId: string, date: string): HabitDayState => {
    const habit = getHabitById(habitId);
    if (!habit) return 'not-scheduled';

    // Dates before the habit existed can't have been missed — there was
    // nothing to do them for.
    if (date < toIso(new Date(habit.createdAt))) return 'not-scheduled';

    const scheduled = habit.days.includes(weekDayOf(new Date(date)));
    if (!scheduled) return 'not-scheduled';

    return isCompletedOn(habitId, date) ? 'done' : 'missed';
  };

  return {
    habits,
    completions,
    onAddHabit,
    deleteHabit,
    getHabitById,
    isCompletedOn,
    isCompletedToday,
    toggleComplete,
    currentStreak,
    longestStreak,
    isNewHabit,
    dayState,
  };
});
