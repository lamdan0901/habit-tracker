import { habitPath } from '../constants'
import { DeletedHabit, Habit } from '../reducers/habitSlice'
import axiosClient from '../utils/axiosClient'

interface ListResponse<T> {
  data: T[]
}

const habitsApi = {
  getAllHabits(params?: GetHabitsParams): Promise<ListResponse<Habit>> {
    return axiosClient.get(`${habitPath}`, { params }).catch((error) => {
      throw error
    })
  },

  postHabit(habit: Habit | DeletedHabit): Promise<any> {
    return axiosClient.post(habitPath, habit).catch((error) => {
      throw error
    })
  },

  putHabit(id: string, habit: Habit): Promise<any> {
    return axiosClient.patch(`${habitPath}/${id}`, habit).catch((error) => {
      throw error
    })
  },

  deleteHabit(id: string): Promise<any> {
    return axiosClient.delete(`${habitPath}/${id}`).catch((error) => {
      throw error
    })
  },
}

export default habitsApi
