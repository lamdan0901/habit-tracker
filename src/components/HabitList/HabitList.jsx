import { useState } from 'react'
import { Checkbox } from '@nextui-org/react'
import AddHabit from 'components/AddHabit/AddHabit'
import './HabitList.scss'

export default function HabitList(props) {
  const [modalOpened, setModalOpened] = useState(false)

  return (
    <div className="habits-view">
      <ul className="habits-list">
        {props.habits.map((habit, index) => (
          <div key={index}>
            {modalOpened && (
              <AddHabit
                editModalOpened={modalOpened}
                editHabit={props.editHabit}
                editMode={true}
                habit={habit}
              />
            )}

            <Checkbox
              color="success"
              title="Click to check this habit"
              onClick={() => {
                console.log('Checkbox clicked')
              }}
              className="checkbox">
              {habit.name}
            </Checkbox>

            <li
              title="Click to view details"
              onClick={() => {
                setModalOpened(true)
              }}>
              <div></div>

              <span className="habit-time">{habit.time}</span>

              <span>
                Checked <strong>{habit.checkedTimes}</strong> times
              </span>
            </li>
          </div>
        ))}
      </ul>
    </div>
  )
}
