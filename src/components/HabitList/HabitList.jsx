import { Checkbox } from '@nextui-org/react'
import MiniMenu from 'components/MiniMenu/MiniMenu'
import ProgressBar from '@ramonak/react-progress-bar'
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

            <span className="habit-time">{habit.time}</span>

            <ProgressBar
              completed={Math.floor((8 / 30) * 100)}
              width={window.innerWidth < 700 ? '100px' : '200px'}
              height={window.innerWidth < 700 ? '15px' : '20px'}
              labelAlignment="outside"
              labelColor="#6a1b9a"
            />

            <span className="menu-icon">
              <MiniMenu />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
