import { Checkbox } from '@nextui-org/react'
import MiniMenu from 'components/MiniMenu/MiniMenu'
import './HabitList.scss'

export default function HabitList({ habits }) {
  return (
    <div className="habits-view">
      <ul className="habits-list">
        {habits.map((habit, index) => (
          <li key={index}>
            <Checkbox color="success" line>
              {habit.name}
            </Checkbox>
            <span className="time">{habit.time}</span>
            <span className="menu-icon">
              <MiniMenu menuIcon="menu icon" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
