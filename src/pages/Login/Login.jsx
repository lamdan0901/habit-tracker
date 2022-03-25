import React, { useEffect, useRef, useState } from 'react'
import isAlphanumeric from 'validator/lib/isAlphanumeric'
import isLength from 'validator/lib/isLength'
import clsx from 'clsx'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from 'contexts/AuthProvider'
import './Login.scss'

// in profile page, we keep navbar and remove sidebar
// in login page is the same but remove user-info

export default function Login() {
  document.title = 'Login - Habit App'

  const usernameRef = useRef()
  const passwordRef = useRef()

  let navigate = useNavigate()
  const { login, setCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEmailNeedVerifying, setIsEmailNeedVerifying] = useState(false)

  async function handleLogin() {
    try {
      setError('')
      setLoading(true)
      if (allFieldsValid()) {
        await login({
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        })
        setCurrentUser(usernameRef.current.value)
        navigate('/')
      }
    } catch (error) {
      setError('Failed to login: ' + error.response.data.message)
      if (error.response.data.message === 'Please verify your email.') {
        setIsEmailNeedVerifying(true)
      }
      passwordRef.current.value = ''
    }
    setLoading(false)
  }

  const allFieldsValid = () => {
    if (!isAlphanumeric(usernameRef.current.value)) {
      setError('Invalid username')
      return false
    }
    if (!isLength(passwordRef.current.value, { min: 6 })) {
      setError('Password must be at least 6 characters')
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
        <div className="title">Welcome</div>
        <div className="sub-title">
          {error !== '' && error}
          {isEmailNeedVerifying && (
            <Link to="/verify-email" className="verify-now">
              Verify now
            </Link>
          )}
        </div>

        <div className="fields">
          <div className="username">
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path d="M12.075,10.812c1.358-0.853,2.242-2.507,2.242-4.037c0-2.181-1.795-4.618-4.198-4.618S5.921,4.594,5.921,6.775c0,1.53,0.884,3.185,2.242,4.037c-3.222,0.865-5.6,3.807-5.6,7.298c0,0.23,0.189,0.42,0.42,0.42h14.273c0.23,0,0.42-0.189,0.42-0.42C17.676,14.619,15.297,11.677,12.075,10.812 M6.761,6.775c0-2.162,1.773-3.778,3.358-3.778s3.359,1.616,3.359,3.778c0,2.162-1.774,3.778-3.359,3.778S6.761,8.937,6.761,6.775 M3.415,17.69c0.218-3.51,3.142-6.297,6.704-6.297c3.562,0,6.486,2.787,6.705,6.297H3.415z"></path>
            </svg>
            <input type="text" ref={usernameRef} placeholder="username" className="user-input" />
          </div>
          <div className="password">
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path d="M17.308,7.564h-1.993c0-2.929-2.385-5.314-5.314-5.314S4.686,4.635,4.686,7.564H2.693c-0.244,0-0.443,0.2-0.443,0.443v9.3c0,0.243,0.199,0.442,0.443,0.442h14.615c0.243,0,0.442-0.199,0.442-0.442v-9.3C17.75,7.764,17.551,7.564,17.308,7.564 M10,3.136c2.442,0,4.43,1.986,4.43,4.428H5.571C5.571,5.122,7.558,3.136,10,3.136 M16.865,16.864H3.136V8.45h13.729V16.864z M10,10.664c-0.854,0-1.55,0.696-1.55,1.551c0,0.699,0.467,1.292,1.107,1.485v0.95c0,0.243,0.2,0.442,0.443,0.442s0.443-0.199,0.443-0.442V13.7c0.64-0.193,1.106-0.786,1.106-1.485C11.55,11.36,10.854,10.664,10,10.664 M10,12.878c-0.366,0-0.664-0.298-0.664-0.663c0-0.366,0.298-0.665,0.664-0.665c0.365,0,0.664,0.299,0.664,0.665C10.664,12.58,10.365,12.878,10,12.878"></path>
            </svg>
            <input
              type="password"
              ref={passwordRef}
              placeholder="password"
              className="pass-input"
            />
          </div>

          <div className="pretty p-default p-round p-smooth">
            <input type="checkbox" defaultChecked={true} />
            <div className="state p-primary">
              <label>Remember me</label>
            </div>
          </div>

          <div className="link forgot-pass">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button onClick={handleLogin} className={clsx('signin-btn', loading && 'disabled')}>
            Login
          </button>

          <div className="link sign-up">
            Don't have an account?
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
