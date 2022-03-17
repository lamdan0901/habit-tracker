import { days } from 'constants/days'
import { useState } from 'react'
import './DayPicker.scss'

export default function DayPicker({ isEditMode, daysCheck, onDaysCheck }) {
  const [allDaysChecked, setAllDaysChecked] = useState(() => {
    if (!isEditMode || (isEditMode && daysCheck.length === 7)) {
      return true
    }
    return false
  })

  const handleAllCheck = () => {
    if (allDaysChecked) {
      setAllDaysChecked(false)
      onDaysCheck([])
    } else {
      setAllDaysChecked(true)
      onDaysCheck([0, 1, 2, 3, 4, 5, 6])
    }
  }

  const handleSingleCheck = (e) => {
    const { name } = e.target
    let day = ~~name

    if (daysCheck.includes(day)) {
      onDaysCheck(daysCheck.filter((checked_day) => checked_day !== day))
      setAllDaysChecked(false)
    } else {
      daysCheck.push(day)
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
              name={index}
              onChange={handleSingleCheck}
              checked={daysCheck.includes(index)}
            />
            <label>{day}</label>
          </div>
        ))}
      </div>
    </div>
  )
}
