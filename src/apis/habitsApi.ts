import { DeletedHabit, Habit } from '../pages/Home/Home'
import axiosClient from '../utils/axiosClient'

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

  postHabit: (params: Habit | DeletedHabit) => {
    return axiosClient.post(basePath, params).catch((error) => {
      throw error.toJSON()
    })
  },

  putHabit: (id: number, params: Habit) => {
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
