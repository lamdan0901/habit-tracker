import './Login.scss'

import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import isAlphanumeric from 'validator/lib/isAlphanumeric'
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'

import { IdentityIcon, LockIcon, MailIcon, PeopleIcon } from '../../assets/icon'
import { useAuth } from '../../contexts/AuthProvider'
import AuthInput from './components/AuthInput'

export default function Register() {
  document.title = 'Register - Habit App'

  const emailRef = useRef('')
  const usernameRef = useRef('')
  const fullNameRef = useRef('')
  const passwordRef = useRef('')
  const passwordConfirmRef = useRef('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { register }: any = useAuth()

  async function handleRegister() {
    try {
      setMessage('')
      setLoading(true)
      if (allFieldsValid()) {
        await register({
          email: emailRef.current,
          username: usernameRef.current,
          password: passwordRef.current,
          fullName: fullNameRef.current,
        })
      } else setLoading(false)
    } catch (error: any) {
      if (error.response.data) {
        setMessage('Failed to create an account. ' + error.response.data.message)
      } else {
        setMessage(
          'Failed to create an account. Server is busy or under maintenance, please come back in a few hours',
        )
      }

      if (passwordRef.current && passwordConfirmRef.current) {
        passwordRef.current = ''
        passwordConfirmRef.current = ''
      }

      setLoading(false)
    }
  }

  const allFieldsValid = () => {
    if (!isEmail(emailRef.current)) {
      setMessage('Invalid email')
      return false
    }
    if (!isAlphanumeric(usernameRef.current) || !isLength(usernameRef.current, { min: 6 })) {
      setMessage('Username must be at least 6 characters')
      return false
    }
    if (isEmpty(fullNameRef.current)) {
      setMessage('Full name not left blank')
      return false
    }
    if (!isLength(passwordRef.current, { min: 8 })) {
      setMessage('Password must be at least 8 characters')
      return false
    }
    if (passwordRef.current !== passwordConfirmRef.current) {
      setMessage("Passwords don't match")
      if (passwordRef.current !== undefined && passwordConfirmRef.current !== undefined) {
        passwordRef.current = ''
        passwordConfirmRef.current = ''
      }
      return false
    }
    return true
  }

  const authInputItems = [
    {
      parentClass: 'username',
      inputClass: 'user-input',
      inputType: 'email',
      placeHolder: 'email',
      icon: <MailIcon />,
      ref: emailRef,
    },
    {
      parentClass: 'username',
      inputClass: 'user-input',
      inputType: 'text',
      placeHolder: 'username',
      icon: <PeopleIcon />,
      ref: usernameRef,
    },
    {
      parentClass: 'password',
      inputClass: 'pass-input',
      inputType: 'password',
      placeHolder: 'password',
      icon: <LockIcon />,
      ref: passwordRef,
    },
    {
      parentClass: 'password',
      inputClass: 'pass-input',
      inputType: 'password',
      placeHolder: 'confirm password',
      icon: <LockIcon />,
      ref: passwordConfirmRef,
    },
    {
      parentClass: 'username',
      inputClass: 'user-input',
      inputType: 'text',
      placeHolder: 'full nam',
      icon: <IdentityIcon />,
      ref: fullNameRef,
    },
  ]

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Register new account</div>
        {message && <div className="message">{message}</div>}

        <form className="auth-form">
          {authInputItems.map((authInput, i) => (
            <AuthInput
              parentClass="username"
              inputClass="user-input"
              inputType="email"
              placeHolder="email"
              icon={<MailIcon />}
              inputRef={emailRef}
            />
          ))}
          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="email"
            placeHolder="email"
            icon={<MailIcon />}
            inputRef={emailRef}
          />

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
          <AuthInput
            parentClass="password"
            inputClass="pass-input"
            inputType="password"
            placeHolder="confirm password"
            icon={<LockIcon />}
            inputRef={passwordConfirmRef}
          />

          <AuthInput
            parentClass="username"
            inputClass="user-input"
            inputType="text"
            placeHolder="full name"
            icon={<IdentityIcon />}
            inputRef={fullNameRef}
          />

          <button onClick={handleRegister} className={clsx('auth-btn', loading && 'disabled')}>
            Register
          </button>

          <div className="link suggestion">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
