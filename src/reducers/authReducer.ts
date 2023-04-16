import { types } from '../constants'
import axiosClient from '../utils/axiosClient'
import TokenService from '../utils/tokenService'

export const authReducer = (state: string, action: any) => {
  switch (action.type) {
    case types.REGISTER:
      localStorage.setItem('email', action.payload.email)
      localStorage.setItem('fullName', action.payload.fullName)
      return state

    case types.LOGIN: {
      const { res, username, shouldKeepLogin } = action.payload
      axiosClient.defaults.headers.common['Authorization'] = res.accessToken
      localStorage.setItem('username', username)
      localStorage.removeItem('msg')

      if (shouldKeepLogin) {
        TokenService.setTokens(res)
      }
      return username
    }

    case types.LOGOUT:
      localStorage.clear()
      return null

    case types.SEND_VERIFY_EMAIL:
      return state

    case types.VERIFY_USER:
      localStorage.setItem('msg', "Congrats! You've successfully verified your email address")
      localStorage.removeItem('email')
      return state

    case types.REQUEST_PASSWORD_RESET:
      localStorage.setItem('email', action.payload)
      localStorage.setItem(
        'msg',
        `Verification code's been sent to your email. 
            Input it here and type your new password`,
      )
      return state

    case types.RESET_PASSWORD:
      localStorage.removeItem('email')
      localStorage.setItem('msg', 'Congrats! Your password has been reset successfully')
      return state

    case types.SET_USER: {
      return action.payload
    }

    default:
      return state
  }
}
