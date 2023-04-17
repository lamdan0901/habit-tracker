export function sendBrowserNotif(title: string, body: string, icon: string) {
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

export function greetingText(username: string) {
  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning, '
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon, '
    else greetingText = 'Good evening, '
  }
  greetingText += username + '!'

  return greetingText
}

export function convertTime24To12(time24h: string) {
  const hour = ~~time24h.slice(0, 2)
  const minute = time24h.slice(3, 5)
  const am = ' AM',
    pm = ' PM'

  if (hour === 0) {
    return 12 + ':' + minute + am
  }
  if (hour < 12) {
    if (hour < 10) return '0' + hour + ':' + minute + am
    return hour + ':' + minute + am
  }
  if (hour === 12) {
    return hour + ':' + minute + pm
  }
  if (hour - 12 < 10) return '0' + (hour - 12) + ':' + minute + pm
  return hour - 12 + ':' + minute + pm
}

export function convertTime12To24(time12h: string) {
  const [time, modifier] = time12h.split(' ')
  let [hours, minutes] = time.split(':')

  if (hours === '12') {
    hours = '00'
  }
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12)
  }

  return `${hours}:${minutes}`
}
