export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'
export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
export type HabitStatus = 'next' | 'passed'

export interface AddHabitPayload {
  title: string
  anchorPrayer: Prayer
  minimalVersion: string
  days: WeekDay[]
}

export interface HabitItem extends AddHabitPayload {
  id: string
  streak: number
  paused: boolean
  isCompleted: boolean
  status: HabitStatus
}
