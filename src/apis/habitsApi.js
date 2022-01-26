import axiosClient from '../utils/axiosClient'

const habitsApi = {
  getAllHabits: (params) => {
    const url = '/habitsList'
    return axiosClient.get(url, { params })
  },

  getHabitByID: (id) => {
    const url = `/habitsList/${id}`
    return axiosClient.get(url)
  },

  postHabit: (params) => {
    const url = `/habitsList`
    return axiosClient.post(url, params)
  },

  putHabit: (id, params) => {
    const url = `/habitsList/${id}`
    return axiosClient.put(url, params)
  },

  deleteHabit: (id) => {
    return axiosClient.delete(`/habitsList/${id}`)
  },
}

export default habitsApi
