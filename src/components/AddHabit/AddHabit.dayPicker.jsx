import { days } from 'constants/days'
import { useState } from 'react'
import './AddHabit.dayPicker.scss'

export default function DayPicker(props) {
  const { daysCheck, onDaysCheck } = props
  const [allDaysChecked, setAllDaysChecked] = useState(false)

  const handleAllCheck = () => {
    if (allDaysChecked) {
      setAllDaysChecked(false)
      onDaysCheck([])
    } else {
      setAllDaysChecked(true)
      onDaysCheck(days)
    }
  }

  const handleSingleCheck = (e) => {
    const { name } = e.target

    if (daysCheck.includes(name)) {
      onDaysCheck(daysCheck.filter((checked_name) => checked_name !== name))
      setAllDaysChecked(false)
    } else {
      daysCheck.push(name)
      onDaysCheck([...daysCheck])
      setAllDaysChecked(daysCheck.length === days.length)
    }
  }

  return (
    <div className="day-picker">
      <label htmlFor="">Reminder Days: </label>

      <div className="day-checkboxes">
        <div className="day-checkbox">
          <input type="checkbox" checked={allDaysChecked} onChange={handleAllCheck} />
          <label htmlFor="">All</label>
        </div>

        {days.map((day, index) => (
          <div className="day-checkbox" key={index}>
            <input
              type="checkbox"
              checked={daysCheck.includes(day)}
              name={day}
              onChange={handleSingleCheck}
            />
            <label htmlFor="">{day}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
