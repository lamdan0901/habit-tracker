import store from 'redux/store'
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from 'pages/Home/Home'
import NotFound from 'components/NotFound/NotFound'
import Statistics from 'pages/Statistics/Statistics'
import SleepCalculator from 'pages/SleepCalculator/SleepCalculator'
import './App.scss'

export default function App() {
  const [sidebarOpened, setSidebarOpened] = useState(true)
  const [windowWidth, setWindowWidth] = useState(0)

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    if (windowWidth < 768) setSidebarOpened(false)
    else setSidebarOpened(true)

    resizeWindow()

    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
  }, [windowWidth])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} />}
          />
          <Route
            path="/sleep-calculator"
            element={
              <SleepCalculator
                windowWidth={windowWidth}
                sidebarOpened={sidebarOpened}
                setSidebarOpened={setSidebarOpened}
              />
            }
          />
          <Route
            path="/statistics"
            element={
              <Statistics sidebarOpened={sidebarOpened} setSidebarOpened={setSidebarOpened} />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
