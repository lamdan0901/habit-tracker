import store from 'redux/store'
import { useState, useLayoutEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from 'pages/Home/Home'
import NotFound from 'components/NotFound/NotFound'
import Statistics from 'pages/Statistics/Statistics'
import SleepCalculator from 'pages/SleepCalculator/SleepCalculator'
import { useSidebar } from 'contexts/SidebarProvider'
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

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sleep-calculator" element={<SleepCalculator windowWidth={windowWidth} />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
