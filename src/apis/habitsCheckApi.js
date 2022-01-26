import axiosClient from '../utils/axiosClient'

const basePath = '/habitsCheck'

const habitsCheckApi = {
  getHabitsCheck: (params) => {
    return axiosClient.get(basePath, { params })
  },

  putHabitsCheck: (params) => {
    return axiosClient.put(`${basePath}/1`, params)
  },
}

export default habitsCheckApi
