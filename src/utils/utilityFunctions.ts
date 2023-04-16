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

export const greetingText = (username: string) => {
  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning, '
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon, '
    else greetingText = 'Good evening, '
  }
  greetingText += username + '!'

  return greetingText
}
