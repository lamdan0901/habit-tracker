import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authPath, types } from '../constants'

import { authReducer } from '../reducers/authReducer'
import axiosClient from '../utils/axiosClient'
import TokenService from '../utils/tokenService'

const AuthContext = createContext({
  username: '',
  signOut() {},
  async register(_user: User) {},
  async login(_user: User, _shouldKeepLogin: boolean) {},
  async verifyUserInfo(_code: string) {},
  async sendVerificationCode() {},
  async requestPasswordReset(_email: string) {},
  async resetPassword(_code: string, _newPassword: string) {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: any) {
  const [username, dispatch] = useReducer(authReducer, null)
  const [loading, setLoading] = useState(true)
  let navigate = useNavigate()

  async function register(user: User) {
    try {
      await axiosClient.post(`${authPath}/signup`, user)
      dispatch({ type: types.REGISTER, payload: user })
      navigate('/verify-email')
    } catch (err) {
      throw err
    }
  }

  async function login(user: User, shouldKeepLogin: boolean) {
    try {
      const res = await axiosClient.post(`${authPath}/login`, user)
      dispatch({
        type: types.LOGIN,
        payload: { res, username: user.username, shouldKeepLogin },
      })
      navigate('/')
    } catch (err) {
      throw err
    }
  }

  function signOut() {
    dispatch({ type: types.LOGOUT, payload: username })
    navigate('/login')
  }

  async function sendVerificationCode() {
    try {
      const email = localStorage.getItem('email')
      const res = await axiosClient.post(`${authPath}/resend-code`, { email })
      // @ts-ignore
      dispatch({ type: types.SEND_VERIFY_EMAIL, payload: res.message })
    } catch (err) {
      throw err
    }
  }

  async function verifyUserInfo(verificationCode: string) {
    try {
      const email = localStorage.getItem('email')
      await axiosClient.post(`${authPath}/verify-email`, { email, verificationCode })
      dispatch({ type: types.VERIFY_USER })
      navigate('/login')
    } catch (err) {
      throw err
    }
  }

  async function requestPasswordReset(email: string) {
    try {
      await axiosClient.post(`${authPath}/forgot-password`, { email })
      dispatch({ type: types.REQUEST_PASSWORD_RESET, payload: email })
      navigate('/reset-password')
    } catch (err) {
      throw err
    }
  }

  async function resetPassword(code: string, newPassword: string) {
    try {
      const email = localStorage.getItem('email')
      await axiosClient.post(`${authPath}/reset-password`, {
        email,
        code,
        newPassword,
      })
      dispatch({ type: types.RESET_PASSWORD })
      navigate('/login')
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    const ACCESS_TOKEN = TokenService.getLocalAccessToken()
    if (ACCESS_TOKEN) {
      axiosClient.defaults.headers.common['Authorization'] = ACCESS_TOKEN
      dispatch({ type: types.SET_USER, payload: localStorage.getItem('username') })
    }

    setLoading(false)
  }, [])

  const value = {
    username,
    register,
    login,
    signOut,
    verifyUserInfo,
    sendVerificationCode,
    requestPasswordReset,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
