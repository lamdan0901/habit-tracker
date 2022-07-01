import { LegacyRef, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import AuthInput from './common/AuthInput'
import { useAuth } from '../../contexts/AuthProvider'
import { PhoneIcon } from '../../assets/icon'

import './Login.scss'

export default function EmailVerification() {
  document.title = 'Verify your email'

  let navigate = useNavigate()
  const codeRef = useRef<HTMLInputElement>()
  const { sendVerificationCode, verifyUserInfo }: any = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleVerifyEmail() {
    try {
      setError('')
      setLoading(true)
      if (!isCodeValid()) {
        setLoading(false)
        return
      }
      await verifyUserInfo(codeRef.current?.value)
      navigate('/login')
    } catch (error: any) {
      setError('Failed to verify email. ' + error?.response?.data?.message)
      setLoading(false)
    }
  }

  async function handleResendVerificationCode() {
    try {
      await sendVerificationCode()
      setError('Verification code has been resent to your email')
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError('Failed to resend verification code: ' + error?.response?.data?.message)
      } else {
        setError(
          'Failed to resend verification code. Server is busy or under maintenance, please come back in a few hours',
        )
      }
    }
  }

  function isCodeValid() {
    if (codeRef.current?.value.length !== 6) {
      setError('Your code must have 6 numbers')
      return false
    }
    return true
  }

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (email)
      setError(`Verification code has been sent to your email.
                Enter it here to verify your email`)
  }, [])

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Verify your email</div>
        <div className="sub-title">{error !== '' ? error : ''}</div>

        <div className="fields">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="number"
            placeHolder="your code"
            icon={<PhoneIcon />}
            inputRef={codeRef as LegacyRef<HTMLInputElement>}
          />

          <button onClick={handleVerifyEmail} className={clsx('signin-btn', loading && 'disabled')}>
            Verify
          </button>

          <div className="link sign-up">
            Don't receive the code or it's expired?
            <br />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={handleResendVerificationCode} style={{ cursor: 'pointer' }}>
              Resend code
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
