export type Prayer = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha'
export type WeekDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
export type HabitStatus = 'next' | 'passed'

export interface AddTodoPayload {
  title: string
  anchorPrayer: Prayer
  minimalVersion: string
  days: WeekDay[]
  status: HabitStatus
}

export interface TodoItem extends AddTodoPayload {
  id: string
  streak: number
  paused: boolean
  isCompleted: boolean
}
