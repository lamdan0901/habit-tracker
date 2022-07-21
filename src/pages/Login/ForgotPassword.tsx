import { LegacyRef, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import isEmail from 'validator/lib/isEmail'
import { useAuth } from '../../contexts/AuthProvider'
import AuthInput from './components/AuthInput'
import { MailIcon } from '../../assets/icon'

import './Login.scss'

export default function ForgotPassword() {
  document.title = 'Forgot Password'

  const emailRef = useRef<HTMLInputElement>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { requestPasswordReset }: any = useAuth()
  let navigate = useNavigate()

  async function handleSubmit() {
    try {
      setError('')
      setLoading(true)
      if (!isEmailValid()) {
        setLoading(false)
        return
      }
      await requestPasswordReset(emailRef.current?.value)
      navigate('/reset-password')
    } catch (error: any) {
      if (error.response.data) {
        setError('Failed to Reset password. ' + error.response.data.message)
      } else {
        setError(
          'Failed to Reset password. Server is busy or under maintenance, please come back in a few hours',
        )
      }
      setLoading(false)
    }
  }

  function isEmailValid() {
    if (!isEmail(emailRef.current!.value)) {
      setError('Invalid email')
      return false
    }
    return true
  }

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Forgot Password</div>
        <div className="sub-title">{error !== '' ? error : ''}</div>

        <div className="auth-form">
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="email"
            placeHolder="email"
            icon={<MailIcon />}
            inputRef={emailRef as LegacyRef<HTMLInputElement>}
          />

          <button onClick={handleSubmit} className={loading ? 'signin-btn disabled' : 'signin-btn'}>
            Reset
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
