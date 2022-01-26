import axiosClient from '../utils/axiosClient'

const basePath = '/habitsList'

const habitsApi = {
  getAllHabits: (params) => {
    return axiosClient.get(basePath, { params })
  },

  getHabitByID: (id) => {
    return axiosClient.get(`${basePath}/${id}`)
  },

  postHabit: (params) => {
    return axiosClient.post(basePath, params)
  },

  putHabit: (id, params) => {
    return axiosClient.put(`${basePath}/${id}`, params)
  },

  deleteHabit: (id) => {
    return axiosClient.delete(`${basePath}/${id}`)
  },
}

export default habitsApi
