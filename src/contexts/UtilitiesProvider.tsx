import React, { useContext, useEffect, useState } from 'react'
import { sendBrowserNotif } from '../utils/utilityFunctions'
import aibLogo from '../assets/img/aib-logo.jpg'

const UtilitiesContext = React.createContext({
  clockState: '',
  sidebarOpen: false,
  toggleSidebar() {},
  notifyTime: '',
  windowWidth: 0,
  handleSetNotifyTime(_time: string) {},
})

export function useUtilities() {
  return useContext(UtilitiesContext)
}

export function UtilitiesProvider({ children }: any) {
  const [notifyTime, setNotifyTime] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [clockState, setClockState] = useState(() => formatTime(new Date().toLocaleTimeString()))

  function handleSetNotifyTime(time: string) {
    setNotifyTime(time)
  }

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentClockState = formatTime(new Date().toLocaleTimeString())
      if (currentClockState !== clockState) {
        setClockState(currentClockState)
      }
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function formatTime(time: string) {
    const currHour = ~~time.slice(0, 2)
    if (currHour >= 10) {
      return time.slice(0, 5) + ' ' + time.slice(9)
    } else {
      return '0' + time.slice(0, 4) + ' ' + time.slice(8)
    }
  }

  /**------------------------------------------------ */

  useEffect(() => {
    if (notifyTime && notifyTime.localeCompare(clockState) === 0) {
      sendBrowserNotif(
        'Habit Tracker',
        `Hey! Now is ${clockState}. It's time to sleep.\nHave a good night! 😴😴😴`,
        aibLogo,
      )
    }
  }, [clockState, notifyTime])

  /**------------------------------------------------ */

  function resizeWindow() {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    if ((windowWidth <= 768 && sidebarOpen) || (windowWidth > 768 && !sidebarOpen)) {
      toggleSidebar()
    }

    resizeWindow()
    window.addEventListener('resize', resizeWindow)
    return () => window.removeEventListener('resize', resizeWindow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth])

  const value = {
    clockState,
    sidebarOpen,
    toggleSidebar,
    notifyTime,
    windowWidth,
    handleSetNotifyTime,
  }

  return <UtilitiesContext.Provider value={value}>{children}</UtilitiesContext.Provider>
}
