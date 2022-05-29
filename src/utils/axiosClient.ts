import axios from 'axios'
import queryString from 'query-string'
import TokenService from './tokenService'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  timeout: 10000,
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    throw error
  },
)

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data
  },
  async (error) => {
    const originalConfig = error.config

    if (originalConfig.url !== '/auth/login' && error.response) {
      // * Access token expired
      if (error.response.status === 401 && !originalConfig._retry) {
        // * handle infinite loop
        originalConfig._retry = true

        try {
          const res = await axiosClient.post('/auth/refresh-token', {
            refreshToken: TokenService.getLocalRefreshToken(),
          })
          // @ts-ignore
          TokenService.updateLocalAccessToken(res.accessToken)

          // @ts-ignore
          originalConfig.headers['Authorization'] = `Bearer ${res.accessToken}`
          return axiosClient(originalConfig)
        } catch (err) {
          console.error(error)
          return Promise.reject(err)
        }
      }
      // * Refresh token expired
      if (
        error.response.status === 400 &&
        (error.response.data.message === 'Invalid refresh token.' ||
          error.response.message === 'Invalid refresh token.') &&
        !originalConfig._retry
      ) {
        console.error('Refresh token expired')
        console.error(error.response)
        localStorage.setItem('msg', 'Your session has expired. Please login again.')
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    throw error
  },
)

export default axiosClient
