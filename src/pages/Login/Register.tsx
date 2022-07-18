import './Login.scss'

import clsx from 'clsx'
import { LegacyRef, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import isAlphanumeric from 'validator/lib/isAlphanumeric'
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'

import { IdentityIcon, LockIcon, MailIcon, PeopleIcon } from '../../assets/icon'
import { useAuth } from '../../contexts/AuthProvider'
import AuthInput from './components/AuthInput'

export default function Register() {
  document.title = 'Register - Habit App'

  const emailRef = useRef<HTMLInputElement>()
  const usernameRef = useRef<HTMLInputElement>()
  const fullNameRef = useRef<HTMLInputElement>()
  const passwordRef = useRef<HTMLInputElement>()
  const passwordConfirmRef = useRef<HTMLInputElement>()

  let navigate = useNavigate()
  const { register }: any = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister() {
    try {
      setError('')
      setLoading(true)
      if (allFieldsValid()) {
        await register({
          email: emailRef.current?.value,
          username: usernameRef.current?.value,
          password: passwordRef.current?.value,
          fullName: fullNameRef.current?.value,
        })
        navigate('/verify-email')
      } else setLoading(false)
    } catch (error: any) {
      if (error.response.data) {
        setError('Failed to create an account. ' + error.response.data.message)
      } else {
        setError(
          'Failed to create an account. Server is busy or under maintenance, please come back in a few hours',
        )
      }

      if (passwordRef.current && passwordConfirmRef.current) {
        passwordRef.current.value = ''
        passwordConfirmRef.current.value = ''
      }

      setLoading(false)
    }
  }

  const allFieldsValid = () => {
    if (!isEmail(emailRef.current!.value)) {
      setError('Invalid email')
      return false
    }
    if (
      !isAlphanumeric(usernameRef.current!.value) ||
      !isLength(usernameRef.current!.value, { min: 6 })
    ) {
      setError('Username must be at least 6 characters')
      return false
    }
    if (isEmpty(fullNameRef.current!.value)) {
      setError('Full name not left blank')
      return false
    }
    if (!isLength(passwordRef.current!.value, { min: 8 })) {
      setError('Password must be at least 8 characters')
      return false
    }
    if (passwordRef.current!.value !== passwordConfirmRef.current!.value) {
      setError("Passwords don't match")
      if (passwordRef.current !== undefined && passwordConfirmRef.current !== undefined) {
        passwordRef.current.value = ''
        passwordConfirmRef.current.value = ''
      }
      return false
    }
    return true
  }

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Register new account</div>
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
          <AuthInput
            parentClass="password"
            inputClass="pass-input"
            inputType="password"
            placeHolder="confirm password"
            icon={<LockIcon />}
            inputRef={passwordConfirmRef as LegacyRef<HTMLInputElement>}
          />

          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="text"
            placeHolder="full name"
            icon={<IdentityIcon />}
            inputRef={fullNameRef as LegacyRef<HTMLInputElement>}
          />

          <button onClick={handleRegister} className={clsx('signin-btn', loading && 'disabled')}>
            Register
          </button>

          <div className="link sign-up">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
