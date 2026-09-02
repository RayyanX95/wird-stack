import z from 'zod';

/**
 * Validation messages are i18n *keys*, not sentences.
 *
 * The schema is a module-level constant, so a literal message here would be
 * resolved once at import time and then stay in whichever language was active
 * on first load — surviving every subsequent language switch. Emitting keys
 * defers the lookup to render time, where the locale is live. The form maps
 * `issue.message` through `t()`.
 */
export const habitSchema = z.object({
  title: z.string().min(1, 'habitForm.errors.title'),
  anchorPrayer: z.enum(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']),
  minimalVersion: z.string().min(1, 'habitForm.errors.minimalVersion'),
  days: z
    .array(z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']))
    .min(1, 'habitForm.errors.days'),
});

export type HabitFormValues = z.infer<typeof habitSchema>;
