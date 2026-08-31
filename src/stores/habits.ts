import { ref } from 'vue';
import { defineStore } from 'pinia';
import { mockCompletions, mockHabits } from '@/mocks';
import type { AddHabitPayload, HabitDayState, HabitItem } from '@/types';
import { fromIso, toIso, weekDayOf } from '@/utils';

export const useHabitsStore = defineStore(
  'habits',
  () => {
    // Seed defaults only — pinia-plugin-persistedstate (see `persist` below)
    // owns reading from and writing to localStorage from here on.
    //
    // These must be `ref`s, not `reactive` arrays: the persist plugin
    // rehydrates via `store.$patch`, which for a setup store's plain
    // `reactive` state reassigns `pinia.state.value[id].habits` to a new
    // array — but the store's exposed `habits` property (and every closure
    // below) was bound to the *original* array at store-creation time, so it
    // never sees that swap. A `ref` doesn't have this problem: Vue's
    // ref-unwrapping means `$patch` updates `habits.value` in place on the
    // same ref instance, so hydration is actually visible here.
    const habits = ref(mockHabits);
    const completions = ref(mockCompletions);

    const onAddHabit = (payload: AddHabitPayload) => {
      const newHabit: HabitItem = {
        ...payload,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        paused: false,
      };
      habits.value.push(newHabit);
    };

    const updateHabit = (habitId: string, payload: AddHabitPayload) => {
      const habit = getHabitById(habitId);
      if (!habit) return;

      Object.assign(habit, payload);
    };

    const togglePause = (habitId: string) => {
      const habit = getHabitById(habitId);
      if (!habit) return;

      habit.paused = !habit.paused;
    };

    const deleteHabit = (habitId: string) => {
      const index = habits.value.findIndex((h) => h.id === habitId);
      if (index >= 0) habits.value.splice(index, 1);

      for (let i = completions.value.length - 1; i >= 0; i--) {
        if (completions.value[i]?.habitId === habitId) completions.value.splice(i, 1);
      }
    };

    const getHabitById = (id: string) => {
      if (!id) return null;

      return habits.value.find((h) => h.id === id) ?? null;
    };

    const isCompletedOn = (habitId: string, date: string): boolean => {
      return completions.value.some((c) => c.habitId === habitId && c.date === date);
    };

    const isCompletedToday = (habitId: string): boolean => {
      return isCompletedOn(habitId, toIso(new Date()));
    };

    const isScheduledToday = (habitId: string): boolean => {
      const habit = getHabitById(habitId);
      if (!habit) return false;

      return habit.days.includes(weekDayOf(new Date()));
    };

    const toggleComplete = (habitId: string, date: string = toIso(new Date())) => {
      const habit = getHabitById(habitId);
      // Paused habits aren't part of the active routine — block completion
      // toggling here too, not just in the UI, since this is reachable
      // directly as a store action.
      if (habit?.paused) return;

      const index = completions.value.findIndex((c) => c.habitId === habitId && c.date === date);
      if (index >= 0) {
        // Removal is always allowed. A completion can legitimately exist on a
        // day the habit is no longer scheduled for — the user edited the
        // schedule after logging it — and refusing to delete that would strand
        // a row nothing in the UI can reach.
        completions.value.splice(index, 1);
      } else {
        // Adding one, though, is refused off-schedule: dayState() reports such
        // a day as 'not-scheduled', so stats never count it and streaks skip
        // over it. The tick would read as done and mean nothing.
        if (habit && !habit.days.includes(weekDayOf(fromIso(date)))) return;

        completions.value.push({
          id: crypto.randomUUID(),
          habitId,
          date,
          completedAt: new Date().toISOString(),
        });
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
      updateHabit,
      togglePause,
      deleteHabit,
      getHabitById,
      isCompletedOn,
      isCompletedToday,
      isScheduledToday,
      toggleComplete,
      currentStreak,
      longestStreak,
      isNewHabit,
      dayState,
    };
  },
  {
    persist: {
      key: 'habits-store',
      pick: ['habits', 'completions'],
      storage: localStorage,
    },
  },
);
