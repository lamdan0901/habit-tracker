import { LegacyRef, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import isLength from 'validator/lib/isLength'
import AuthInput from './common/AuthInput'
import { useAuth } from '../../contexts/AuthProvider'
import { LockIcon, PhoneIcon } from '../../assets/icon'

import './Login.scss'

export default function ResetPassword() {
  document.title = 'Reset Password'

  const codeRef = useRef<HTMLInputElement>()
  const newPasswordRef = useRef<HTMLInputElement>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { resetPassword }: any = useAuth()
  let navigate = useNavigate()

  async function handleSubmit() {
    try {
      setError('')
      setLoading(true)
      if (!allFieldsValid()) {
        setLoading(false)
        return
      }
      await resetPassword(codeRef.current?.value, newPasswordRef.current?.value)
      navigate('/login')
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError('Failed to Reset password. ' + error?.response?.data?.message)
      } else {
        setError(
          'Failed to Reset password. Server is busy or under maintenance, please come back in a few hours',
        )
      }
    }
    setLoading(false)
  }

  const allFieldsValid = () => {
    if (codeRef.current?.value.length !== 6) {
      setError('Your code must have 6 numbers')
      return false
    }
    if (!isLength(newPasswordRef.current!.value, { min: 8 })) {
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
        <div className="title">Reset Password</div>
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

          <AuthInput
            parentClass="password"
            inputClass="pass-input"
            inputType="password"
            placeHolder="password"
            icon={<LockIcon />}
            inputRef={newPasswordRef as LegacyRef<HTMLInputElement>}
          />

          <button onClick={handleSubmit} className={loading ? 'signin-btn disabled' : 'signin-btn'}>
            Reset
          </button>

          <div className="link sign-up">
            Don't receive the code or it's expired?
            <br />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a style={{ cursor: 'pointer' }}>Resend code</a>
          </div>
        </div>
      </div>
    </div>
  )
}
