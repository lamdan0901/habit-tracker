import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function PrivateRoute({ children }: any) {
  const { userState }: any = useAuth()
  return userState ? children : <Navigate to="/login" replace />
}
