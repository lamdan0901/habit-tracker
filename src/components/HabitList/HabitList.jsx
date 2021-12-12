import { useState } from 'react'
import { Checkbox } from '@nextui-org/react'
import HabitModel from 'components/HabitModel/HabitModel'
import { BsTrash } from 'react-icons/bs'
import './HabitList.scss'

export default function HabitList(props) {
  const [modalOpened, setModalOpened] = useState(false)
  const [currentHabit, setCurrentHabit] = useState({})

  function handleChooseHabit(habit) {
    setCurrentHabit(habit)
    setModalOpened(true)
  }

  function handleDeleteHabit(habitId) {
    props.onDeleteHabit(habitId)
  }

  return (
    <>
      {modalOpened && (
        <HabitModel
          habit={currentHabit}
          editModalOpened={modalOpened}
          onCloseModal={() => {
            setModalOpened(false)
          }}
          onEditHabit={props.onEditHabit}
          onDeleteHabit={handleDeleteHabit}
          editMode={true}
        />
      )}

      <div className="habits-view">
        <ul className="habits-list">
          {props.habits.map((habit, index) => (
            <div key={index}>
              <Checkbox
                color="success"
                title="Click to check this habit"
                onClick={() => {}}
                className="check-habit-box"
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

                <div
                  title="Delete this habit"
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation() //so that when we click the child element, it won't call the parent element
                    handleDeleteHabit(habit.id)
                  }}>
                  <BsTrash />
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}
