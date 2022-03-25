import React, { useContext, useEffect, useState } from 'react'
import TokenService from 'utils/tokenService'
import axiosClient from '../utils/axiosClient'

const basePath = '/auth'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function register(user) {
    try {
      await axiosClient.post(`${basePath}/register`, user)
      localStorage.setItem('email', user.email)
    } catch (err) {
      throw err
    }
  }

  async function sendVerificationCode() {
    try {
      const email = localStorage.getItem('email')
      const res = await axiosClient.post(`${basePath}/send-token`, { email })
      return res.message
    } catch (err) {
      throw err
    }
  }

  async function verifyUserInfo(code) {
    try {
      const email = localStorage.getItem('email')
      await axiosClient.post(`${basePath}/verify-token`, { email, code })

      localStorage.setItem('msg', "Congrats! You've successfully verified your email address")
      localStorage.removeItem('email')
    } catch (err) {
      throw err
    }
  }

  async function login(user) {
    try {
      const res = await axiosClient.post(`${basePath}/login`, user)
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`
      TokenService.setTokens(res)

      localStorage.setItem('username', user.username)
      localStorage.removeItem('msg')
    } catch (err) {
      throw err
    }
  }

  async function requestResetPassword(email) {
    try {
      await axiosClient.post(`${basePath}/forgot-password`, { email })
      localStorage.setItem('email', email)
      localStorage.setItem(
        'msg',
        `Verification code's been sent to your email. 
        Input it here and type your new password`,
      )
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
      localStorage.removeItem('email')
      localStorage.setItem('msg', 'Congrats! Your password has been reset successfully')
    } catch (err) {
      throw err
    }
  }

  function sign_Out() {
    TokenService.removeToken()
    setCurrentUser(null)
  }

  useEffect(() => {
    const access_Token = TokenService.getLocalAccessToken()
    if (access_Token) {
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_Token}`
      setCurrentUser(localStorage.getItem('username'))
    }

    setLoading(false)
  }, [])

  const value = {
    currentUser,
    register,
    login,
    verifyUserInfo,
    sendVerificationCode,
    setCurrentUser,
    requestResetPassword,
    resetPassword,
    sign_Out,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
