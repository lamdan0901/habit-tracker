import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

export default function PrivateRoute({ children }) {
  const { userState } = useAuth()
  return userState ? children : <Navigate to="/login" replace />
}
