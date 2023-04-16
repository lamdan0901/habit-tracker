import { LegacyRef, useEffect, useRef, useState } from 'react'
import isAlphanumeric from 'validator/lib/isAlphanumeric'
import isLength from 'validator/lib/isLength'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import AuthInput from './components/AuthInput'
import { useAuth } from '../../contexts/AuthProvider'
import { PeopleIcon, LockIcon } from '../../assets/icon'

import 'pretty-checkbox/src/pretty-checkbox.scss'
import './Login.scss'

export default function Login() {
  document.title = 'Login - Habit App'

  const usernameRef = useRef('')
  const passwordRef = useRef('')
  const keepLoginRef = useRef<HTMLInputElement>()

  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isEmailNeedVerifying, setIsEmailNeedVerifying] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()

    try {
      setMessage('')
      setLoading(true)
      if (allFieldsValid()) {
        await login(
          {
            username: usernameRef.current,
            password: passwordRef.current,
          },
          keepLoginRef.current!.checked,
        )
      } else setLoading(false)
    } catch (error: any) {
      console.log('error: ', error.response)
      if (error.response.data) {
        const errorMsg = error.response.data.error.message
        if (errorMsg === 'Please verify your email.') {
          setIsEmailNeedVerifying(true)
        } else {
          setMessage('Failed to login. ' + errorMsg)
        }
      } else {
        setMessage(
          'Failed to login. Server is busy or under maintenance, please come back in a few hours',
        )
      }

      if (passwordRef.current) passwordRef.current = ''
      setLoading(false)
    }
  }

  const allFieldsValid = () => {
    if (!isAlphanumeric(usernameRef.current) || !isLength(usernameRef.current, { min: 6 })) {
      setMessage('Username must be at least 6 characters')
      return false
    }
    if (!isLength(passwordRef.current, { min: 6 })) {
      setMessage('Password must be at least 8 characters')
      return false
    }
    return true
  }

  useEffect(() => {
    const msg = localStorage.getItem('msg')
    if (msg) {
      setMessage(msg)
      localStorage.removeItem('msg')
    }
  }, [])

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <h3 className="title">Welcome</h3>
        <div className="message">
          {message !== '' ? message : ''}
          {isEmailNeedVerifying && (
            <Link to="/verify-email" className="verify-now">
              Verify now
            </Link>
          )}
        </div>

        <form className="auth-form">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="text"
            placeHolder="username"
            icon={<PeopleIcon />}
            inputRef={usernameRef}
          />
          <AuthInput
            parentClass="password"
            inputClass="pass-input"
            inputType="password"
            placeHolder="password"
            icon={<LockIcon />}
            inputRef={passwordRef}
          />

          <div className="utilities">
            <div className="pretty p-default p-round p-smooth">
              <input
                type="checkbox"
                ref={keepLoginRef as LegacyRef<HTMLInputElement>}
                defaultChecked={true}
              />
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

          <button onClick={handleLogin} className={clsx('auth-btn', loading && 'disabled')}>
            Login
          </button>

          <div className="link suggestion">
            Don't have an account?
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
