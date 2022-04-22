export const sendBrowserNotif = (title, body, icon) => {
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
