import React, { useReducer, createContext, useContext, useEffect, useState } from 'react'
import axiosClient from '../utils/axiosClient'
import TokenService from 'utils/tokenService'
import { useNavigate } from 'react-router-dom'
import { authReducer } from '../reducers/authReducer'
import * as types from './types'

const basePath = '/auth'

const AuthContext = createContext()
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [userState, dispatch] = useReducer(authReducer, null)
  const [loading, setLoading] = useState(true)
  let navigate = useNavigate()

  async function register(user) {
    try {
      await axiosClient.post(`${basePath}/register`, user)
      dispatch({ type: types.REGISTER, payload: user })
    } catch (err) {
      throw err
    }
  }

  async function login(user) {
    try {
      const res = await axiosClient.post(`${basePath}/login`, user)
      dispatch({ type: types.LOGIN, payload: { res, username: user.username } })

      navigate('/')
    } catch (err) {
      throw err
    }
  }

  function sign_Out() {
    dispatch({ type: types.LOGOUT, payload: userState })
  }

  async function sendVerificationCode() {
    try {
      const email = localStorage.getItem('email')
      const res = await axiosClient.post(`${basePath}/send-token`, { email })
      dispatch({ type: types.SEND_VERIFY_EMAIL, payload: res.message })
    } catch (err) {
      throw err
    }
  }

  async function verifyUserInfo(code) {
    try {
      const email = localStorage.getItem('email')
      await axiosClient.post(`${basePath}/verify-token`, { email, code })

      dispatch({ type: types.VERIFY_USER })
    } catch (err) {
      throw err
    }
  }

  async function requestPasswordReset(email) {
    try {
      await axiosClient.post(`${basePath}/forgot-password`, { email })
      dispatch({ type: types.REQUEST_PASSWORD_RESET, payload: email })
    } catch (err) {
      throw err
    }
  }

  async function resetPassword(code, newPassword) {
    try {
      const email = localStorage.getItem('email')
      await axiosClient.post(`${basePath}/reset-password`, {
        email,
        code,
        newPassword,
      })
      dispatch({ type: types.RESET_PASSWORD })
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    const access_Token = TokenService.getLocalAccessToken()
    if (access_Token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_Token}`
      dispatch({ type: types.SET_USER, payload: localStorage.getItem('username') })
    }

    setLoading(false)
  }, [])

  const value = {
    userState,
    register,
    login,
    sign_Out,
    verifyUserInfo,
    sendVerificationCode,
    requestPasswordReset,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
