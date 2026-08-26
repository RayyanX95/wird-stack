import z from 'zod'

export const habitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  anchorPrayer: z.enum(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']),
  minimalVersion: z.string().min(1, 'Give it a minimal version'),
  days: z.array(z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])).min(1, 'Pick at least one day'),
})

export type HabitFormValues = z.infer<typeof habitSchema>
