import { reactive, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { mockTodos } from '@/mocks';
import type { AddHabitPayload, HabitItem } from '@/types';

export const useHabitsStore = defineStore('habits', () => {
  const habits = reactive(mockTodos);

  const onAddHabit = (payload: AddHabitPayload) => {
    const newHabit: HabitItem = {
      ...payload,
      id: crypto.randomUUID(),
      status: 'next',
      isCompleted: false,
      paused: false,
      streak: 0,
    };
    habits.push(newHabit);
  };

  const getHabitById = (id: string) => {
    if (!id) return null;

    const habit = habits.find((h) => h.id === id);

    return habit;
  };

  watchEffect(() => console.log('habits', habits));

  return { habits, onAddHabit, getHabitById };
});
