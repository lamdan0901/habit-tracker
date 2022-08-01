import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { store } from '../redux/store'
import PrivateRoute from '../utils/PrivateRoute'
import { AuthProvider } from '../contexts/AuthProvider'
import { UtilitiesProvider } from '../contexts/UtilitiesProvider'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Login/Register'
import EmailVerification from '../pages/Login/EmailVerification'
import ForgotPassword from '../pages/Login/ForgotPassword'
import ResetPassword from '../pages/Login/ResetPassword'
import NotFound from '../pages/NotFound/NotFound'
import SleepCalculator from '../pages/SleepCalculator/SleepCalculator'
import './App.scss'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <UtilitiesProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sleep-calculator"
                element={
                  <PrivateRoute>
                    <SleepCalculator />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UtilitiesProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}
