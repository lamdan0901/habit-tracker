import axiosClient from '../utils/axiosClient'

type TPerformance = { id: number; time: string; isChecked: boolean; habitId: number }

interface IHabit {
  id: number
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
  performances: TPerformance[]
  createdAt?: Date
}

interface IDeletedHabit {
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
}

const basePath = '/habit'

const habitsApi = {
  getAllHabits: () => {
    return axiosClient.get(basePath).catch((error) => {
      throw error.toJSON()
    })
  },

  getHabitByID: (id: number) => {
    return axiosClient.get(`${basePath}/${id}`).catch((error) => {
      throw error.toJSON()
    })
  },

  postHabit: (params: IHabit | IDeletedHabit) => {
    return axiosClient.post(basePath, params).catch((error) => {
      throw error.toJSON()
    })
  },

  putHabit: (id: number, params: IHabit) => {
    return axiosClient.patch(`${basePath}/${id}`, params).catch((error) => {
      throw error.toJSON()
    })
  },

  deleteHabit: (id: number) => {
    return axiosClient.delete(`${basePath}/${id}`).catch((error) => {
      throw error.toJSON()
    })
  },
}

export default habitsApi
