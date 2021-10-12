import { Checkbox } from '@nextui-org/react'
import ProgressBar from '@ramonak/react-progress-bar'
import './HabitList.scss'

export default function HabitList({ habits }) {
  return (
    <div className="habits-view">
      <ul className="habits-list">
        {habits.map((habit, index) => (
          <li
            title="Click to view details"
            key={index}
            onClick={() => {
              console.log('object')
            }}>
            <Checkbox color="success" line>
              {habit.habitName}
            </Checkbox>

            <span className="habit-time">{habit.time}</span>

            {habit.endDate !== null ? (
              <ProgressBar
                completed={Math.floor((habit.checkedTimes / habit.totalDay) * 100)}
                width="100px"
                height="15px"
                labelAlignment="outside"
                labelColor="#6a1b9a"
              />
            ) : (
              <span>
                Checked <strong>{habit.checkedTimes}</strong> times
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
