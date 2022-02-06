import { useState } from 'react'
import Modal from 'react-modal'
import MobileTimePicker from '@mui/lab/MobileTimePicker'
import TextField from '@mui/material/TextField'
import DayPicker from './DayPicker/DayPicker'

import 'react-toastify/dist/ReactToastify.css'
import './HabitModal.scss'

export default function AddHabit(props) {
  const initialHabitValues = !props.isEditMode
    ? {
        name: '',
        description: '',
        checked: false,
        time: new Date(),
        daysChecked: [new Date().toString().slice(0, 3)],
      }
    : {
        id: props.habit.id,
        name: props.habit.name,
        description: props.habit.description,
        checked: props.habit.checked,
        time: new Date(props.habit.time),
        daysChecked: props.habit.daysChecked,
      }

  const [habit, setHabit] = useState(initialHabitValues)

  const [habitModalOpened, setHabitModalOpened] = useState(!!props.isEditModalOpened)
  const [error, setError] = useState('')

  function saveHabit() {
    if (!habit.name) setError('Habit name is not left blank!')
    else if (isDuplicatedHabitName(habit)) setError('Habit name is duplicated!')
    else {
      props.isEditMode ? props.onEditHabit(habit) : props.onAddHabit(habit)
      handleCloseModal()
    }
  }

  function setTime(date) {
    setHabit((prevValue) => ({
      ...prevValue,
      time: date,
    }))
  }

  function isDuplicatedHabitName(currentHabit) {
    let habitNames

    !props.isEditMode
      ? (habitNames = props.habitsList.map((habit) => habit.name))
      : (habitNames = props.habitsList
          .filter((habit) => habit.name !== initialHabitValues.name)
          .map((habit) => habit.name))

    if (habitNames.includes(currentHabit.name)) return true
    return false
  }

  function handleChange(e) {
    const { name, value } = e.target
    setHabit((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      }
    })
  }

  function handleDayCheck(days) {
    setHabit((prevValue) => ({
      ...prevValue,
      daysChecked: days,
    }))
  }

  function handleCloseModal() {
    setHabitModalOpened(false)
    props.isEditMode && props.onCloseModal()
    setHabit(initialHabitValues)
    setError('')
  }

  return (
    <div>
      {!props.isEditMode && (
        <button
          className="btn add-btn"
          onClick={() => {
            setHabitModalOpened(true)
          }}>
          +
        </button>
      )}

      <Modal
        className="habit-modal"
        overlayClassName="habit-modal-overlay"
        closeTimeoutMS={200}
        isOpen={habitModalOpened}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}>
        <div className="modal-content">
          <h2 className="modal-title">{props.isEditMode ? 'View Habit' : 'Add Habit'}</h2>

          <form className="data-fields">
            <div className="name-field">
              <label className="data-label">Name:</label>
              <input
                type="text"
                className={error !== '' ? 'red-border' : ''}
                name="name"
                onChange={handleChange}
                defaultValue={habit.name}
              />
            </div>

            <div className="description-field">
              <label className="data-label">Description:</label>
              <textarea
                type="text"
                name="description"
                onChange={handleChange}
                defaultValue={habit.description}
              />
            </div>

            <div className="time-picker">
              <label className="time-label">Reminder Time:</label>
              <MobileTimePicker
                label=""
                orientation="portrait"
                ampm
                value={habit.time}
                onChange={(newValue) => {
                  setTime(newValue)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>

            <DayPicker daysCheck={habit.daysChecked} onDaysCheck={handleDayCheck} />
          </form>

          <footer className="modal-footer">
            <div className="error-message">{error !== '' && error}</div>
            <div>
              <button className="btn confirm-btn" onClick={saveHabit}>
                {props.isEditMode ? 'EDIT' : 'ADD'}
              </button>
              <button className="btn cancel-btn" onClick={handleCloseModal}>
                CANCEL
              </button>
            </div>
          </footer>
        </div>
      </Modal>
    </div>
  )
}
