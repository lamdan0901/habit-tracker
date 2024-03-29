import './Login.scss'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { PhoneIcon } from '../../assets/icon'
import { useAuth } from '../../contexts/AuthProvider'
import AuthInput from './components/AuthInput'

export default function EmailVerification() {
  document.title = 'Verify your email'

  const codeRef = useRef('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { sendVerificationCode, verifyUserInfo } = useAuth()

  async function handleVerifyEmail(e: any) {
    e.preventDefault()

    try {
      setMessage('')
      setLoading(true)
      if (isCodeValid()) {
        await verifyUserInfo(codeRef.current)
      } else setLoading(false)
    } catch (error: any) {
      if (error === 400) {
        setMessage('Verification code expired')
      } else {
        setMessage('Invalid verification code or email not exist')
      }
      setLoading(false)
    }
  }

  async function handleResendVerificationCode() {
    try {
      setLoading(true)
      await sendVerificationCode()
      setMessage('Verification code has been resent to your email')
    } catch (error: any) {
      setMessage(
        'Failed to resend verification code. Server is busy or under maintenance, please come back in a few hours',
      )
    }
    setLoading(false)
  }

  function isCodeValid() {
    if (codeRef.current?.length !== 6) {
      setMessage('Your code must have 6 numbers')
      return false
    }
    return true
  }

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (email)
      setMessage(`Verification code has been sent to your email.
                Enter it here to verify your email`)
  }, [])

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Verify your email</div>
        {message && <div className="message">{message}</div>}

        <form className="auth-form">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="text"
            placeHolder="your code"
            icon={<PhoneIcon />}
            inputRef={codeRef}
          />

          <button onClick={handleVerifyEmail} className={clsx('auth-btn', loading && 'disabled')}>
            Verify
          </button>

          <div className="link suggestion">
            Don't receive the code or it's expired?
            <br />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              onClick={handleResendVerificationCode}
              className={clsx(loading && 'disabled')}
              style={{ cursor: 'pointer' }}>
              Resend code
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
