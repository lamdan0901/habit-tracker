import store from 'redux/store'
import { useState, useLayoutEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PrivateRoute from 'utils/PrivateRoute'
import { useSidebar } from 'contexts/SidebarProvider'
import { AuthProvider } from 'contexts/AuthProvider'

import Home from 'pages/Home/Home'
import Login from 'pages/Login/Login'
import Register from 'pages/Login/Register'
import EmailVerification from 'pages/Login/EmailVerification'
import ForgotPassword from 'pages/Login/ForgotPassword'
import ResetPassword from 'pages/Login/ResetPassword'
import NotFound from 'pages/NotFound/NotFound'
import Profile from 'pages/Profile/Profile'
import Statistics from 'pages/Statistics/Statistics'
import SleepCalculator from 'pages/SleepCalculator/SleepCalculator'
import './App.scss'

export default function App() {
  const [sidebarOpen, toggleSidebar] = useSidebar()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const resizeWindow = () => {
    setWindowWidth(window.innerWidth)
  }

  useLayoutEffect(() => {
    if ((windowWidth <= 768 && sidebarOpen) || (windowWidth > 768 && !sidebarOpen)) {
      toggleSidebar()
    }

    resizeWindow()
    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth])

  // when the user logs out, we need to clear the redux store?
  // when a guest visit the website, show homepage but the content is welcome only

  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
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
              path="/my-profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/sleep-calculator"
              element={
                <PrivateRoute>
                  <SleepCalculator windowWidth={windowWidth} />
                </PrivateRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <PrivateRoute>
                  <Statistics />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  )
}
