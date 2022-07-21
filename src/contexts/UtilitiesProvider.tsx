import React, { useContext, useEffect, useState } from 'react'
import { sendBrowserNotif } from '../utils/utilityFunctions'
import aibLogo from '../assets/img/aib-logo.jpg'

const TimeContext = React.createContext('')
const NotifTimeContext = React.createContext([{}, () => {}])

export function useClockState() {
  return useContext(TimeContext)
}
export function useNotifTime() {
  return useContext(NotifTimeContext)
}

export function UtilitiesProvider({ children }: any) {
  const [notifyTime, setNotifyTime] = useState('')
  const [clockState, setClockState] = useState(formatTime(new Date().toLocaleTimeString()))

  function handleSetNotifyTime(time: string) {
    setNotifyTime(time)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentClockState = formatTime(new Date().toLocaleTimeString('en-US'))
      if (currentClockState !== clockState) {
        setClockState(currentClockState)
      }
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (notifyTime) {
      if (notifyTime.localeCompare(clockState) === 0) {
        sendBrowserNotif(
          'Habit Tracker',
          `Hey! Now is ${clockState}. It's time to sleep.\nHave a good night! 😴😴😴`,
          aibLogo,
        )
      }
    }
  }, [clockState, notifyTime])

  function formatTime(time: string) {
    // if hour >= 10
    if (~~time.slice(0, 2) >= 10) {
      return time.slice(0, 5) + ' ' + time.slice(9)
    } else {
      return '0' + time.slice(0, 4) + ' ' + time.slice(8)
    }
  }

  return (
    <TimeContext.Provider value={clockState}>
      <NotifTimeContext.Provider value={[notifyTime, handleSetNotifyTime]}>
        {children}
      </NotifTimeContext.Provider>
    </TimeContext.Provider>
  )
}
