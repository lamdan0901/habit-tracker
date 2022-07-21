import { Habit } from '../reducers/habitSlice'

export const sendBrowserNotif = (title: string, body: string, icon: string) => {
  if (!('Notification' in window)) {
    console.warn('Your Browser does not support Chrome Notifications :(')
  } else if (Notification.permission === 'granted') {
    new Notification(title, {
      icon,
      body,
    })
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, {
          icon,
          body,
        })
      } else {
        console.warn(`Failed, Notification Permission is ${Notification.permission}`)
      }
    })
  } else {
    console.warn(`Failed, Notification Permission is ${Notification.permission}`)
  }
}

export const sortHabits = (habits: Habit[]) => {
  let sortedHabits = [...habits]
  sortedHabits.sort((habit1: Habit, habit2: Habit) => {
    return habit1.reminderTime > habit2.reminderTime
      ? 1
      : habit2.reminderTime > habit1.reminderTime
      ? -1
      : 0
  })
  return sortedHabits
}
