import { useState } from 'react'
import { Checkbox } from '@nextui-org/react'
import EditHabit from 'components/EditHabit/EditHabit'
import './HabitList.scss'

export default function HabitList(props) {
  const [modalOpened, setModalOpened] = useState(false)
  const [currentHabit, setCurrentHabit] = useState({})

  function handleChooseHabit(habit) {
    setCurrentHabit(habit)
    setModalOpened(true)
  }

  function handleCloseModal() {
    setModalOpened(false)
  }

  return (
    <>
      <EditHabit
        habit={currentHabit}
        modalOpened={modalOpened}
        onCloseModal={handleCloseModal}
        onEditHabit={props.onEditHabit}
        onDeleteHabit={props.onDeleteHabit}
      />

      <div className="habits-view">
        <ul className="habits-list">
          {props.habits.map((habit, index) => (
            <div key={index}>
              <Checkbox
                color="success"
                title="Click to check this habit"
                onClick={() => {}}
                className="check-habit-box "
                style={{ color: habit.textColor }}>
                {habit.name}
              </Checkbox>

              <li
                title="Click to view details"
                style={{ backgroundColor: habit.bgColor, color: habit.textColor }}
                onClick={() => {
                  handleChooseHabit(habit)
                }}>
                <div></div>

                <div className="habit-time">{new Date(habit.time).toString().slice(16, 21)}</div>

                <div className="checked-time">
                  Checked <strong>{habit.checkedTimes}</strong> times
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}
