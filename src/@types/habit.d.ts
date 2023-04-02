interface GetHabitsParams {
  page?: number
  search?: string
  viewTodayHabits?: boolean
}
interface Performance {
  _id: string
  time: string
  isChecked: boolean
  habitId: number
}

interface Habit {
  _id?: string
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
  performances?: Performance[]
  createdAt?: Date
  checked?: boolean
}

interface DeletedHabit {
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
}
