import axiosClient from '../utils/axiosClient'

const basePath = '/habit'

const habitsApi = {
  getAllHabits: (params) => {
    return axiosClient.get(basePath, { params }).catch((error) => {
      throw error.toJSON()
    })
  },

  getHabitByID: (id) => {
    return axiosClient.get(`${basePath}/${id}`).catch((error) => {
      throw error.toJSON()
    })
  },

  postHabit: (params) => {
    return axiosClient.post(basePath, params).catch((error) => {
      throw error.toJSON()
    })
  },

  putHabit: (id, params) => {
    return axiosClient.patch(`${basePath}/${id}`, params).catch((error) => {
      throw error.toJSON()
    })
  },

  deleteHabit: (id) => {
    return axiosClient.delete(`${basePath}/${id}`).catch((error) => {
      throw error.toJSON()
    })
  },
}

export default habitsApi
