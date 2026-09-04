<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useI18n } from 'vue-i18n';
import type { Prayer, WeekDay } from '@/types';
import { PRAYERS, WEEKDAY_DISPLAY_ORDER } from '@/types';
import { habitSchema, type HabitFormValues } from './schema';
import { HABIT_TEMPLATES, type HabitTemplate } from './habitTemplates';
import { useHabitsStore } from '@/stores/habits';
import { ModalComponent } from '@/components';

const { t } = useI18n();
const router = useRouter();

const DAYS = WEEKDAY_DISPLAY_ORDER;

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
const selectedDays = ref<WeekDay[]>(habit.value?.days ?? [...DAYS]);

// One error message per field, keyed by the schema's own field names — stays
// in sync with habitSchema automatically since it's typed off HabitFormValues.
const errors = reactive<Partial<Record<keyof HabitFormValues, string>>>({});

const showSuccessModal = ref(false);

function toggleDay(day: WeekDay) {
  selectedDays.value = selectedDays.value.includes(day)
    ? selectedDays.value.filter((d) => d !== day)
    : [...selectedDays.value, day];
}

// Prefills the form; does not submit it. A one-tap *create* would deny the
// user the chance to notice "10 istighfar" isn't their thing and change it to
// 3 before it becomes their first entry in the log.
function applyTemplate(template: HabitTemplate) {
  title.value = t(template.titleKey);
  anchorPrayer.value = template.anchorPrayer;
  minimalVersion.value = t(template.minimalKey);
  selectedDays.value = template.days ? [...template.days] : [...DAYS];
}

const resetForm = () => {
  title.value = '';
  minimalVersion.value = '';
  selectedDays.value = [...DAYS];
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
      // issue.message is an i18n key — see the note in schema.ts.
      if (!errors[field]) errors[field] = t(issue.message);
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
      <h1 class="text-title margin-bottom">{{ t('habitForm.notFoundTitle') }}</h1>
      <p class="text-subtitle">{{ t('habitForm.notFoundBody') }}</p>
      <RouterLink to="/habits" class="btn primary">{{ t('habitForm.backToHabits') }}</RouterLink>
    </div>

    <template v-else>
      <header class="page-header">
        <h1 class="text-title margin-bottom">
          {{ isEditing ? t('habitForm.editTitle') : t('habitForm.newTitle') }}
        </h1>
        <span class="text-subtitle">{{ t('habitForm.subtitle') }}</span>
      </header>

      <ModalComponent
        v-model:open="showSuccessModal"
        :title="isEditing ? t('habitForm.successUpdatedTitle') : t('habitForm.successCreatedTitle')"
        :message="isEditing ? t('habitForm.successUpdatedBody') : t('habitForm.successCreatedBody')"
        :success-btn-label="t('habitForm.goToHabits')"
        :close-btn-label="t('common.close')"
        @success="router.push(isEditing ? `/habits/${habit!.id}` : '/habits')"
        variant="success"
      />

      <!-- Only for a genuinely new habit — editing already has a starting point,
           and overwriting an edit-in-progress with a template would be a data-loss
           trap, not a shortcut. -->
      <div v-if="!isEditing" class="quick-start">
        <div class="field-label">{{ t('habitForm.quickStartHeading') }}</div>
        <div class="template-row">
          <button
            v-for="template in HABIT_TEMPLATES"
            :key="template.key"
            type="button"
            class="template-chip"
            @click="applyTemplate(template)"
          >
            <Icon :icon="template.icon" class="template-icon" aria-hidden="true" />
            <span>{{ t(template.titleKey) }}</span>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <div class="field-label">{{ t('habitForm.fieldTitle') }} <span class="req">*</span></div>
          <input
            v-model="title"
            type="text"
            class="field-input"
            :class="{ invalid: errors.title }"
            :placeholder="t('habitForm.titlePlaceholder')"
          />
          <div v-if="errors.title" class="field-error">{{ errors.title }}</div>
        </div>

        <div class="field">
          <div class="field-label">{{ t('habitForm.fieldAnchor') }} <span class="req">*</span></div>
          <div class="prayer-pills">
            <button
              v-for="prayer in PRAYERS"
              :key="prayer"
              type="button"
              class="prayer-pill"
              :class="{ selected: anchorPrayer === prayer }"
              @click="anchorPrayer = prayer"
            >
              {{ t(`prayers.${prayer}`) }}
            </button>
          </div>
          <div v-if="errors.anchorPrayer" class="field-error">{{ errors.anchorPrayer }}</div>
        </div>

        <div class="field">
          <div class="field-label">{{ t('habitForm.fieldMinimal') }} <span class="req">*</span></div>
          <input
            v-model="minimalVersion"
            type="text"
            class="field-input"
            :class="{ invalid: errors.minimalVersion }"
            :placeholder="t('habitForm.minimalPlaceholder')"
          />
          <div v-if="errors.minimalVersion" class="field-error">{{ errors.minimalVersion }}</div>
          <div v-else class="field-hint">{{ t('habitForm.minimalHint') }}</div>
        </div>

        <div class="field">
          <div class="field-label">{{ t('habitForm.fieldDays') }}</div>
          <div class="day-pills">
            <button
              v-for="day in DAYS"
              :key="day"
              type="button"
              class="day-pill"
              :class="{ selected: selectedDays.includes(day) }"
              :aria-label="t(`weekdays.long.${day}`)"
              @click="toggleDay(day)"
            >
              {{ t(`weekdays.short.${day}`) }}
            </button>
          </div>
          <div v-if="errors.days" class="field-error">{{ errors.days }}</div>
          <div v-else class="field-hint">{{ t('habitForm.daysHint') }}</div>
        </div>

        <div class="btn-row">
          <RouterLink :to="isEditing ? `/habits/${habit!.id}` : '/habits'" class="btn ghost">
            {{ t('common.cancel') }}
          </RouterLink>
          <button type="submit" class="btn primary">
            {{ isEditing ? t('habitForm.submitUpdate') : t('habitForm.submitCreate') }}
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

.quick-start {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.template-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.template-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast),
    background-color var(--transition-fast);
}
.template-chip:hover {
  border-color: var(--accent);
  color: var(--text);
  background: var(--accent-soft);
}

.template-icon {
  font-size: var(--text-md);
  opacity: 0.75;
  flex-shrink: 0;
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
