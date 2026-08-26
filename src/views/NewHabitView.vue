<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Prayer, WeekDay } from '@/types'
import { habitSchema, type HabitFormValues } from './schema'

const PRAYERS: Prayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
const DAYS: { label: string; value: WeekDay }[] = [
  { label: 'M', value: 'Mon' },
  { label: 'T', value: 'Tue' },
  { label: 'W', value: 'Wed' },
  { label: 'T', value: 'Thu' },
  { label: 'F', value: 'Fri' },
  { label: 'S', value: 'Sat' },
  { label: 'S', value: 'Sun' },
]

const title = ref('')
const anchorPrayer = ref<Prayer>('Fajr')
const minimalVersion = ref('')
const selectedDays = ref<WeekDay[]>(DAYS.map((d) => d.value))

// One error message per field, keyed by the schema's own field names — stays
// in sync with habitSchema automatically since it's typed off HabitFormValues.
const errors = reactive<Partial<Record<keyof HabitFormValues, string>>>({})

function toggleDay(day: WeekDay) {
  selectedDays.value = selectedDays.value.includes(day)
    ? selectedDays.value.filter((d) => d !== day)
    : [...selectedDays.value, day]
}

function handleSubmit() {
  const result = habitSchema.safeParse({
    title: title.value,
    anchorPrayer: anchorPrayer.value,
    minimalVersion: minimalVersion.value,
    days: selectedDays.value,
  })

  // clear previous errors before reporting the new pass
  for (const key of Object.keys(errors) as (keyof HabitFormValues)[]) delete errors[key]

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof HabitFormValues
      if (!errors[field]) errors[field] = issue.message
    }
    return
  }

  // result.data is now a fully-typed, validated HabitFormValues —
  // this is the point to call the store/API with it.
  console.log('valid habit:', result.data)
}
</script>

<template>
  <div class="new-habit-page">
    <header class="page-header">
      <h1 class="text-title margin-bottom">New habit</h1>
      <span class="text-subtitle">Stack it after a prayer</span>
    </header>

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
        <RouterLink to="/habits" class="btn ghost">Cancel</RouterLink>
        <button type="submit" class="btn primary">Create habit</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.new-habit-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 420px;
}

.page-header {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.margin-bottom {
  margin-bottom: 6px;
}

.btn-row {
  display: flex;
  gap: 16px;
}
</style>
