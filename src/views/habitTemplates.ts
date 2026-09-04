import type { Prayer, WeekDay } from '@/types';

/**
 * One-tap starters for the new-habit form.
 *
 * The empty "minimal version" field was the biggest gap between the pitch and
 * the product: a first-time visitor has no example of what a "two-minute"
 * habit even looks like, and a form with no worked example is where an
 * onboarding funnel actually leaks. These prefill the form; they don't submit
 * it — the user still reviews and can change anything before creating it.
 *
 * Titles and minimal versions are i18n keys, resolved at render time, so the
 * template list itself stays locale-agnostic — same reasoning as the message
 * keys in schema.ts.
 */
export interface HabitTemplate {
  key: string;
  icon: string;
  anchorPrayer: Prayer;
  titleKey: string;
  minimalKey: string;
  /** Only set for a day-specific example; templates without it use every day. */
  days?: WeekDay[];
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    key: 'quranAfterFajr',
    icon: 'lucide:book-open',
    anchorPrayer: 'Fajr',
    titleKey: 'habitForm.templates.quranAfterFajr.title',
    minimalKey: 'habitForm.templates.quranAfterFajr.minimal',
  },
  {
    key: 'morningAdhkar',
    icon: 'lucide:sunrise',
    anchorPrayer: 'Fajr',
    titleKey: 'habitForm.templates.morningAdhkar.title',
    minimalKey: 'habitForm.templates.morningAdhkar.minimal',
  },
  {
    key: 'dhikrAfterDhuhr',
    icon: 'lucide:sparkles',
    anchorPrayer: 'Dhuhr',
    titleKey: 'habitForm.templates.dhikrAfterDhuhr.title',
    minimalKey: 'habitForm.templates.dhikrAfterDhuhr.minimal',
  },
  {
    key: 'gratitudeAfterAsr',
    icon: 'lucide:heart',
    anchorPrayer: 'Asr',
    titleKey: 'habitForm.templates.gratitudeAfterAsr.title',
    minimalKey: 'habitForm.templates.gratitudeAfterAsr.minimal',
  },
  {
    key: 'istighfarAfterMaghrib',
    icon: 'lucide:moon',
    anchorPrayer: 'Maghrib',
    titleKey: 'habitForm.templates.istighfarAfterMaghrib.title',
    minimalKey: 'habitForm.templates.istighfarAfterMaghrib.minimal',
  },
  {
    key: 'sadaqahAfterMaghrib',
    icon: 'lucide:hand-heart',
    anchorPrayer: 'Maghrib',
    titleKey: 'habitForm.templates.sadaqahAfterMaghrib.title',
    minimalKey: 'habitForm.templates.sadaqahAfterMaghrib.minimal',
  },
  {
    key: 'nightAdhkar',
    icon: 'lucide:moon-star',
    anchorPrayer: 'Isha',
    titleKey: 'habitForm.templates.nightAdhkar.title',
    minimalKey: 'habitForm.templates.nightAdhkar.minimal',
  },
  {
    key: 'fastMonThu',
    icon: 'lucide:calendar-check',
    anchorPrayer: 'Fajr',
    titleKey: 'habitForm.templates.fastMonThu.title',
    minimalKey: 'habitForm.templates.fastMonThu.minimal',
    // The one preset that demonstrates the days picker rather than defaulting
    // to every day — Sunnah fasting is the clearest real example of a
    // habit that is not daily by design.
    days: ['Mon', 'Thu'],
  },
];
