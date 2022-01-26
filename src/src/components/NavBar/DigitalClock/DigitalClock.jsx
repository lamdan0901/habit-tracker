import { useEffect, useState } from 'react'

function DigitalClock() {
  const [clockState, setClockState] = useState()

  //deps: effect will only activate if the values in the list change
  useEffect(() => {
    setInterval(() => {
      const date = new Date()
      setClockState(date.toLocaleTimeString())
    }, 1000)
  })
  return <h3 className="digi-clock">{clockState}</h3>
}

export default DigitalClock
