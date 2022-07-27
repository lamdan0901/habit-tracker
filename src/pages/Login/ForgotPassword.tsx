import './Login.scss'

import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import isEmail from 'validator/lib/isEmail'

import { MailIcon } from '../../assets/icon'
import { useAuth } from '../../contexts/AuthProvider'
import AuthInput from './components/AuthInput'

export default function ForgotPassword() {
  document.title = 'Forgot Password'

  const emailRef = useRef('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { requestPasswordReset }: any = useAuth()

  async function handleSubmit(e: any) {
    e.preventDefault()

    try {
      setMessage('')
      setLoading(true)
      if (!isEmailValid()) {
        setLoading(false)
        return
      }
      await requestPasswordReset(emailRef.current)
    } catch (error: any) {
      if (error.response.data) {
        setMessage('Failed to Reset password. ' + error.response.data.message)
      } else {
        setMessage(
          'Failed to Reset password. Server is busy or under maintenance, please come back in a few hours',
        )
      }
      setLoading(false)
    }
  }

  function isEmailValid() {
    if (!isEmail(emailRef.current)) {
      setMessage('Invalid email')
      return false
    }
    return true
  }

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Forgot Password</div>
        {message && <div className="message">{message}</div>}

        <form className="auth-form">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="email"
            placeHolder="email"
            icon={<MailIcon />}
            inputRef={emailRef}
          />

          <button onClick={handleSubmit} className={clsx('auth-btn', loading && 'disabled')}>
            Reset
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
