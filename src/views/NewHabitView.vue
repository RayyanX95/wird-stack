<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import type { Prayer, WeekDay } from '@/types';
import { PRAYERS, WEEKDAY_DISPLAY_ORDER, WEEKDAY_SHORT_LABELS } from '@/types';
import { habitSchema, type HabitFormValues } from './schema';
import { useHabitsStore } from '@/stores/habits';
import { ModalComponent } from '@/components';

const router = useRouter();

const DAYS = WEEKDAY_DISPLAY_ORDER.map((value) => ({ value, label: WEEKDAY_SHORT_LABELS[value] }));

const route = useRoute();
const { onAddHabit, updateHabit, getHabitById } = useHabitsStore();

// Present iff we're on /habits/:id/edit — same form, different mode.
const hasIdParam = computed(() => !!route.params.id);
const habit = computed(() => (hasIdParam.value ? getHabitById(route.params.id as string) : null));
const isEditing = computed(() => !!habit.value);
// Editing a real route param that no longer resolves to a habit (deleted,
// bad link, etc.) — distinct from the "new habit" case, which has no id at all.
const notFound = computed(() => hasIdParam.value && !habit.value);

const title = ref(habit.value?.title ?? '');
const anchorPrayer = ref<Prayer>(habit.value?.anchorPrayer ?? 'Fajr');
const minimalVersion = ref(habit.value?.minimalVersion ?? '');
const selectedDays = ref<WeekDay[]>(habit.value?.days ?? DAYS.map((d) => d.value));

// One error message per field, keyed by the schema's own field names — stays
// in sync with habitSchema automatically since it's typed off HabitFormValues.
const errors = reactive<Partial<Record<keyof HabitFormValues, string>>>({});

const showSuccessModal = ref(false);

function toggleDay(day: WeekDay) {
  selectedDays.value = selectedDays.value.includes(day)
    ? selectedDays.value.filter((d) => d !== day)
    : [...selectedDays.value, day];
}

const resetForm = () => {
  title.value = '';
  minimalVersion.value = '';
  selectedDays.value = DAYS.map((d) => d.value);
  anchorPrayer.value = 'Fajr';
};

function handleSubmit() {
  const result = habitSchema.safeParse({
    title: title.value,
    anchorPrayer: anchorPrayer.value,
    minimalVersion: minimalVersion.value,
    days: selectedDays.value,
  });

  // clear previous errors before reporting the new pass
  for (const key of Object.keys(errors) as (keyof HabitFormValues)[]) delete errors[key];

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof HabitFormValues;
      if (!errors[field]) errors[field] = issue.message;
    }
    return;
  }

  if (isEditing.value && habit.value) {
    updateHabit(habit.value.id, result.data);
  } else {
    onAddHabit(result.data);
    resetForm();
  }
  showSuccessModal.value = true;
}
</script>

<template>
  <div class="view new-habit-page">
    <div v-if="notFound" class="empty-state">
      <div class="empty-icon">
        <Icon icon="lucide:search-x" />
      </div>
      <h1 class="text-title margin-bottom">Habit not found</h1>
      <p class="text-subtitle">
        This habit may have been deleted, or the link you followed is out of date.
      </p>
      <RouterLink to="/habits" class="btn primary">Back to habits</RouterLink>
    </div>

    <template v-else>
      <header class="page-header">
        <h1 class="text-title margin-bottom">{{ isEditing ? 'Edit habit' : 'New habit' }}</h1>
        <span class="text-subtitle">Stack it after a prayer</span>
      </header>

      <ModalComponent
        v-model:open="showSuccessModal"
        :title="isEditing ? 'Habit updated' : 'Habit stacked'"
        :message="
          isEditing
            ? 'Your changes have been saved.'
            : `It's on your Today list — you'll see it after your next prayer.`
        "
        success-btn-label="Go to habits"
        close-btn-label="Close"
        @success="router.push(isEditing ? `/habits/${habit!.id}` : '/habits')"
        variant="success"
      />

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <div class="field-label">Title <span class="req">*</span></div>
          <input
            v-model="title"
            type="text"
            class="field-input"
            :class="{ invalid: errors.title }"
            placeholder="e.g. Read Qur'an"
          />
          <div v-if="errors.title" class="field-error">{{ errors.title }}</div>
        </div>

        <div class="field">
          <div class="field-label">Anchor prayer <span class="req">*</span></div>
          <div class="prayer-pills">
            <button
              v-for="prayer in PRAYERS"
              :key="prayer"
              type="button"
              class="prayer-pill"
              :class="{ selected: anchorPrayer === prayer }"
              @click="anchorPrayer = prayer"
            >
              {{ prayer }}
            </button>
          </div>
          <div v-if="errors.anchorPrayer" class="field-error">{{ errors.anchorPrayer }}</div>
        </div>

        <div class="field">
          <div class="field-label">Minimal version <span class="req">*</span></div>
          <input
            v-model="minimalVersion"
            type="text"
            class="field-input"
            :class="{ invalid: errors.minimalVersion }"
            placeholder="e.g. 1 verse"
          />
          <div v-if="errors.minimalVersion" class="field-error">{{ errors.minimalVersion }}</div>
          <div v-else class="field-hint">Two-minute rule — smaller than feels necessary.</div>
        </div>

        <div class="field">
          <div class="field-label">Days</div>
          <div class="day-pills">
            <button
              v-for="day in DAYS"
              :key="day.value"
              type="button"
              class="day-pill"
              :class="{ selected: selectedDays.includes(day.value) }"
              @click="toggleDay(day.value)"
            >
              {{ day.label }}
            </button>
          </div>
          <div v-if="errors.days" class="field-error">{{ errors.days }}</div>
          <div v-else class="field-hint">
            Every day by default — narrow it down for day-specific habits like fasting Mondays.
          </div>
        </div>

        <div class="btn-row">
          <RouterLink :to="isEditing ? `/habits/${habit!.id}` : '/habits'" class="btn ghost">
            Cancel
          </RouterLink>
          <button type="submit" class="btn primary">
            {{ isEditing ? 'Update habit' : 'Create habit' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped lang="scss">
.new-habit-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.btn-row {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .btn-row .btn {
    flex: 1;
  }
}
</style>
