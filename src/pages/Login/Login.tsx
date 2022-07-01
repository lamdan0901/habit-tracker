import { LegacyRef, useEffect, useRef, useState } from 'react'
import isAlphanumeric from 'validator/lib/isAlphanumeric'
import isLength from 'validator/lib/isLength'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import AuthInput from './common/AuthInput'
import { useAuth } from '../../contexts/AuthProvider'
import { PeopleIcon, LockIcon } from '../../assets/icon'

import 'pretty-checkbox/src/pretty-checkbox.scss'
import './Login.scss'

// in profile page, we keep navbar and remove sidebar
// in login page is the same but remove user-info

export default function Login() {
  document.title = 'Login - Habit App'

  const usernameRef = useRef<HTMLInputElement>()
  const passwordRef = useRef<HTMLInputElement>()

  const { login }: any = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEmailNeedVerifying, setIsEmailNeedVerifying] = useState(false)

  async function handleLogin() {
    try {
      setError('')
      setLoading(true)
      if (allFieldsValid()) {
        await login({
          username: usernameRef.current?.value,
          password: passwordRef.current?.value,
        })
      } else setLoading(false)
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError('Failed to login. ' + error?.response?.data?.message)
      } else {
        setError(
          'Failed to login. Server is busy or under maintenance, please come back in a few hours',
        )
      }
      if (error?.response?.data?.message === 'Please verify your email.') {
        setIsEmailNeedVerifying(true)
      }

      if (passwordRef.current !== undefined) passwordRef.current.value = ''
      setLoading(false)
    }
  }

  const allFieldsValid = () => {
    if (
      !isAlphanumeric(usernameRef.current!.value) ||
      !isLength(usernameRef.current!.value, { min: 6 })
    ) {
      setError('Username must be at least 6 characters')
      return false
    }
    if (!isLength(passwordRef.current!.value, { min: 8 })) {
      setError('Password must be at least 8 characters')
      return false
    }
    return true
  }

  useEffect(() => {
    const msg = localStorage.getItem('msg')
    if (msg) {
      setError(msg)
      localStorage.removeItem('msg')
    }
  }, [])

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <h3 className="title">Welcome</h3>
        <div className="sub-title">
          {error !== '' ? error : ''}
          {isEmailNeedVerifying && (
            <Link to="/verify-email" className="verify-now">
              Verify now
            </Link>
          )}
        </div>

        <div className="fields">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="text"
            placeHolder="username"
            icon={<PeopleIcon />}
            inputRef={usernameRef as LegacyRef<HTMLInputElement>}
          />
          <AuthInput
            parentClass="password"
            inputClass="pass-input"
            inputType="password"
            placeHolder="password"
            icon={<LockIcon />}
            inputRef={passwordRef as LegacyRef<HTMLInputElement>}
          />

          <div className="utilities">
            <div className="pretty p-default p-round p-smooth">
              <input type="checkbox" defaultChecked={true} />
              <div className="state p-primary">
                <label>Remember me</label>
              </div>
            </div>

            <div className="link">
              <Link to="/forgot-password" className="link">
                Forgot password?
              </Link>
            </div>
          </div>

          <button onClick={handleLogin} className={clsx('signin-btn', loading && 'disabled')}>
            Login
          </button>

          <div className="link sign-up">
            Don't have an account?
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
