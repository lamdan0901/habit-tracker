import { useState } from 'react'
import { Checkbox } from '@nextui-org/react'
import { BsTrash } from 'react-icons/bs'
import HabitModel from 'components/HabitModel/HabitModel'
import './HabitList.scss'

export default function HabitList(props) {
  const [modalOpened, setModalOpened] = useState(false)
  const [currentHabit, setCurrentHabit] = useState({})

  function handleChooseHabit(habit) {
    setCurrentHabit(habit)
    setModalOpened(true)
  }

  function handleDeleteHabit(habit) {
    props.onDeleteHabit(habit)
  }

  const habitIDs = props.habits.map((habit) => habit.id)
  const [habitsCheck, setHabitsCheck] = useState([])
  const [allHabitsChecked, setAllHabitsChecked] = useState(false)

  const handleAllCheck = () => {
    if (allHabitsChecked) {
      setAllHabitsChecked(false)
      setHabitsCheck([])
    } else {
      setAllHabitsChecked(true)
      setHabitsCheck(habitIDs)
    }
  }

  const handleSingleCheck = (id) => {
    if (habitsCheck.includes(id)) {
      setHabitsCheck(habitsCheck.filter((checked_habitID) => checked_habitID !== id))
      setAllHabitsChecked(false)
    } else {
      habitsCheck.push(id)
      setHabitsCheck([...habitsCheck])
      setAllHabitsChecked(habitsCheck.length === habitIDs.length)
    }
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
        <div>
          <Checkbox
            color="success"
            title="Click to set all the habits done"
            onChange={handleAllCheck}
            checked={allHabitsChecked}
            className="check-all_done-box">
            All done
          </Checkbox>
        </div>

        <ul className="habits-list">
          {props.habits.map((habit, index) => (
            <div key={index}>
              <Checkbox
                color="success"
                title="Click to check this habit"
                onChange={() => {
                  handleSingleCheck(habit.id)
                }}
                checked={habitsCheck.includes(habit.id)}
                className="check-habit-box"
                textColor={habit.textColor}>
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
                    handleDeleteHabit(habit)
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
