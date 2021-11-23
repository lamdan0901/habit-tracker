import axios from 'axios'
import queryString from 'query-string'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  header: {
    'content-type': 'application/json',
  },
  timeout: 4000,
  //use queryString to stringify params
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config) => {
  //handle token here...
  return config
})

//request that has response returning data will be handled here
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data
  },
  (error) => {
    throw error
  },
)

export default axiosClient
