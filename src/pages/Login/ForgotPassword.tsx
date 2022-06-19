import { LegacyRef, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
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
      await requestPasswordReset(emailRef.current?.value)
      navigate('/reset-password')
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

  return (
    <div className="login-container">
      <div className="login">
        <div className="logo"></div>
        <div className="title">Forgot Password</div>
        <div className="sub-title">{error !== '' && error}</div>

        <div className="fields">
          <div className="username">
            <svg className="svg-icon" viewBox="0 0 20 20">
              <path d="M17.388,4.751H2.613c-0.213,0-0.389,0.175-0.389,0.389v9.72c0,0.216,0.175,0.389,0.389,0.389h14.775c0.214,0,0.389-0.173,0.389-0.389v-9.72C17.776,4.926,17.602,4.751,17.388,4.751 M16.448,5.53L10,11.984L3.552,5.53H16.448zM3.002,6.081l3.921,3.925l-3.921,3.925V6.081z M3.56,14.471l3.914-3.916l2.253,2.253c0.153,0.153,0.395,0.153,0.548,0l2.253-2.253l3.913,3.916H3.56z M16.999,13.931l-3.921-3.925l3.921-3.925V13.931z"></path>
            </svg>
            <input
              type="email"
              ref={emailRef as LegacyRef<HTMLInputElement>}
              placeholder="email"
              className="user-input"
            />
          </div>

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
