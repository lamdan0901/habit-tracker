import { habitPath } from '../constants'
import { DeletedHabit, Habit } from '../reducers/habitSlice'
import axiosClient from '../utils/axiosClient'

export interface ListResponse<T> {
  data: T[]
}

const habitsApi = {
  getAllHabits(): Promise<ListResponse<Habit>> {
    return axiosClient.get(habitPath).catch((error) => {
      throw error.toJSON()
    })
  },

  postHabit(habit: Habit | DeletedHabit): Promise<any> {
    return axiosClient.post(habitPath, habit).catch((error) => {
      throw error.toJSON()
    })
  },

  putHabit(id: number, habit: Habit): Promise<any> {
    return axiosClient.patch(`${habitPath}/${id}`, habit).catch((error) => {
      throw error.toJSON()
    })
  },

  deleteHabit(id: number): Promise<any> {
    return axiosClient.delete(`${habitPath}/${id}`).catch((error) => {
      throw error.toJSON()
    })
  },
}

export default habitsApi
