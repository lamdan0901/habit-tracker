import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function PrivateRoute({ children }: any) {
  const { username } = useAuth()
  return username ? children : <Navigate to="/login" replace />
}
