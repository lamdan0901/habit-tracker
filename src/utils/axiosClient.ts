import axios from 'axios'
import queryString from 'query-string'
import TokenService from './tokenService'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  // baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
  timeout: 10000,
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      axiosClient.defaults.headers.common['Authorization'] = token
    }
    return config
  },
  (error) => {
    console.log('errorzzzzz: ', error)
    throw error
  },
)

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data
  },
  async (error) => {
    const originalConfig = error.config

    if (
      originalConfig.url !== '/auth/login' &&
      originalConfig.url !== '/auth/signup' &&
      error.response
    ) {
      if (error.response.status === 401 && !originalConfig._retry) {
        // * handle infinite loop
        originalConfig._retry = true

        try {
          const res: any = await axiosClient.post('/auth/refresh-token', {
            refreshToken: TokenService.getLocalRefreshToken(),
          })

          TokenService.updateLocalAccessToken(res.accessToken)
          originalConfig.headers['Authorization'] = res.accessToken

          return axiosClient(originalConfig)
        } catch (err) {
          console.error(error)
          return Promise.reject(err)
        }
      }
      if (
        error.response.status === 401 &&
        error.response.data.message === 'Refresh token expired or invalid'
      ) {
        console.error('Refresh token expired!!1 ', error.response)
        localStorage.clear()
        localStorage.setItem('msg', 'Your session has expired. Please login again.')
        window.location.href = '/login'
        return
      }
    }

    console.log('error.response: ', error.response)

    throw error.response.status
  },
)

export default axiosClient
