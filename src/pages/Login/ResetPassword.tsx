import { LegacyRef, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
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
      await resetPassword(codeRef.current?.value, newPasswordRef.current?.value)
      navigate('/login')
    } catch (error: any) {
      setError('Failed to Reset password. ' + error?.response?.data?.message)
    }
    setLoading(false)
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
        <div className="sub-title">{error !== '' && error}</div>

        <div className="fields">
          <div className="username">
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path d="M13.372,1.781H6.628c-0.696,0-1.265,0.569-1.265,1.265v13.91c0,0.695,0.569,1.265,1.265,1.265h6.744c0.695,0,1.265-0.569,1.265-1.265V3.045C14.637,2.35,14.067,1.781,13.372,1.781 M13.794,16.955c0,0.228-0.194,0.421-0.422,0.421H6.628c-0.228,0-0.421-0.193-0.421-0.421v-0.843h7.587V16.955z M13.794,15.269H6.207V4.731h7.587V15.269z M13.794,3.888H6.207V3.045c0-0.228,0.194-0.421,0.421-0.421h6.744c0.228,0,0.422,0.194,0.422,0.421V3.888z"></path>
            </svg>
            <input
              type="number"
              ref={codeRef as LegacyRef<HTMLInputElement>}
              placeholder="code"
              className="user-input"
            />
          </div>
          <div className="password">
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path d="M17.308,7.564h-1.993c0-2.929-2.385-5.314-5.314-5.314S4.686,4.635,4.686,7.564H2.693c-0.244,0-0.443,0.2-0.443,0.443v9.3c0,0.243,0.199,0.442,0.443,0.442h14.615c0.243,0,0.442-0.199,0.442-0.442v-9.3C17.75,7.764,17.551,7.564,17.308,7.564 M10,3.136c2.442,0,4.43,1.986,4.43,4.428H5.571C5.571,5.122,7.558,3.136,10,3.136 M16.865,16.864H3.136V8.45h13.729V16.864z M10,10.664c-0.854,0-1.55,0.696-1.55,1.551c0,0.699,0.467,1.292,1.107,1.485v0.95c0,0.243,0.2,0.442,0.443,0.442s0.443-0.199,0.443-0.442V13.7c0.64-0.193,1.106-0.786,1.106-1.485C11.55,11.36,10.854,10.664,10,10.664 M10,12.878c-0.366,0-0.664-0.298-0.664-0.663c0-0.366,0.298-0.665,0.664-0.665c0.365,0,0.664,0.299,0.664,0.665C10.664,12.58,10.365,12.878,10,12.878"></path>
            </svg>
            <input
              type="password"
              ref={newPasswordRef as LegacyRef<HTMLInputElement>}
              placeholder="password"
              className="pass-input"
            />
          </div>

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
  //onClick={handleResendVerificationCode}
}
