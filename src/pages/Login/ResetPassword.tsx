import { useEffect, useRef, useState } from 'react'
import isLength from 'validator/lib/isLength'
import AuthInput from './components/AuthInput'
import { useAuth } from '../../contexts/AuthProvider'
import { LockIcon, PhoneIcon } from '../../assets/icon'

import './Login.scss'
import clsx from 'clsx'

export default function ResetPassword() {
  document.title = 'Reset Password'

  const codeRef = useRef('')
  const newPasswordRef = useRef('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { resetPassword } = useAuth()

  async function handleSubmit(e: any) {
    e.preventDefault()

    try {
      setMessage('')
      setLoading(true)
      if (!allFieldsValid()) {
        setLoading(false)
        return
      }
      await resetPassword(codeRef.current, newPasswordRef.current)
      setLoading(false)
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

  const allFieldsValid = () => {
    if (codeRef.current.length !== 6) {
      setMessage('Your code must have 6 numbers')
      return false
    }
    if (!isLength(newPasswordRef.current, { min: 8 })) {
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
        <div className="title">Reset Password</div>
        {message && <div className="message">{message}</div>}

        <form className="auth-form">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="number"
            placeHolder="your code"
            icon={<PhoneIcon />}
            inputRef={codeRef}
          />

          <AuthInput
            parentClass="password"
            inputClass="pass-input"
            inputType="password"
            placeHolder="password"
            icon={<LockIcon />}
            inputRef={newPasswordRef}
          />

          <button onClick={handleSubmit} className={clsx('auth-btn', loading && 'disabled')}>
            Reset
          </button>

          <div className="link suggestion">
            Don't receive the code or it's expired?
            <br />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a style={{ cursor: 'pointer' }}>Resend code</a>
          </div>
        </form>
      </div>
    </div>
  )
}
