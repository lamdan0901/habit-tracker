import store from 'redux/store'
import { useState, useEffect, useLayoutEffect } from 'react'
import { Provider } from 'react-redux'
import { useSidebar, useSidebarUpdate } from 'contexts/SidebarProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from 'pages/Home/Home'
import NotFound from 'components/NotFound/NotFound'
import Statistics from 'pages/Statistics/Statistics'
import SleepCalculator from 'pages/SleepCalculator/SleepCalculator'
import './App.scss'

export default function App() {
  const sidebarOpen = useSidebar()
  const toggleSidebar = useSidebarUpdate()
  const [windowWidth, setWindowWidth] = useState(0)

  const resizeWindow = () => {
    setWindowWidth(window.innerWidth)
  }

  useLayoutEffect(() => {
    if (windowWidth <= 768 && sidebarOpen) toggleSidebar()
    else if (windowWidth > 768 && !sidebarOpen) toggleSidebar()

    resizeWindow()
    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth])

  const now = new Date().toLocaleTimeString()
  const [clockState, setClockState] = useState(formatTime(now))

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString()
      setClockState(formatTime(now))
    }, 10000)
    return () => clearInterval(interval)
  })

  function formatTime(time) {
    if (time.slice(0, 1) === '1') {
      return time.slice(0, 5) + ' ' + now.slice(9, 11)
    } else {
      return '0' + time.slice(0, 4) + ' ' + now.slice(8, 10)
    }
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home clockState={clockState} />} />
          <Route
            path="/sleep-calculator"
            element={<SleepCalculator windowWidth={windowWidth} clockState={clockState} />}
          />
          <Route path="/statistics" element={<Statistics clockState={clockState} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
