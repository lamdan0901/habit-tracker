import { useState } from 'react'
import Modal from 'react-modal'
import TextField from '@mui/material/TextField'
import MobileTimePicker from '@mui/lab/MobileTimePicker'
import DayPicker from './DayPicker/DayPicker'

import 'react-toastify/dist/ReactToastify.css'
import './HabitModal.scss'

export default function AddHabit(props) {
  const now = new Date()
  let habitReminderTime =
    props.isEditMode &&
    now.toString().slice(0, 16) + props.habit.reminderTime + now.toString().slice(21)

  const initialHabitValues = !props.isEditMode
    ? {
        title: '',
        description: '',
        reminderTime: now,
        reminderDays: [0, 1, 2, 3, 4, 5, 6],
        performances: [],
      }
    : {
        id: props.habit.id,
        title: props.habit.title,
        description: props.habit.description,
        reminderTime: new Date(habitReminderTime),
        reminderDays: props.habit.reminderDays,
        performances: props.habit.performances,
      }

  const [habitModalOpened, setHabitModalOpened] = useState(!!props.isEditModalOpened)
  const [habit, setHabit] = useState(initialHabitValues)
  const [titleError, setTitleError] = useState('')
  const [desError, setDesError] = useState('')

  function saveHabit() {
    if (!habit.title) {
      setDesError('')
      setTitleError('Title is not left blank!')
    } else if (!habit.description) {
      setTitleError('')
      setDesError('Description is not left blank!')
    } else if (isHabitNameDuplicated(habit)) setTitleError('Title is duplicated!')
    else {
      let newHabit = habit
      newHabit.reminderTime = formatTime()

      if (props.isEditMode) {
        const id = newHabit.id
        delete newHabit.id
        delete newHabit.performances

        props.onEditHabit(id, newHabit, '')
      } else {
        props.onAddHabit(newHabit)
      }
      handleCloseModal()
    }
  }

  function setTime(date) {
    setHabit((prevValue) => ({
      ...prevValue,
      reminderTime: date,
    }))
  }

  function formatTime() {
    const hour =
      ~~habit.reminderTime.getHours() >= 10
        ? habit.reminderTime.getHours()
        : '0' + habit.reminderTime.getHours()
    const minute =
      ~~habit.reminderTime.getMinutes() >= 10
        ? habit.reminderTime.getMinutes()
        : '0' + habit.reminderTime.getMinutes()
    return hour + ':' + minute
  }

  const isHabitNameDuplicated = (currentHabit) => {
    let habitTitles

    if (!props.isEditMode) habitTitles = props.habitList.map((habit) => habit.title)
    else
      habitTitles = props.habitList
        .filter((habit) => habit.title !== initialHabitValues.title)
        .map((habit) => habit.title)

    if (habitTitles.includes(currentHabit.title)) return true
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
      reminderDays: days,
    }))
  }

  function handleCloseModal() {
    if (props.isEditMode) props.onCloseModal()
    setHabitModalOpened(false)
    setHabit(initialHabitValues)
    setTitleError('')
    setDesError('')
  }

  return (
    <div>
      {!props.isEditMode ? (
        <button
          className="btn add-btn"
          onClick={() => {
            setHabitModalOpened(true)
          }}>
          +
        </button>
      ) : null}

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
              <label className="data-label">Title:</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                defaultValue={habit.title}
                autoComplete={'off'}
                className={titleError !== '' ? 'red-border' : ''}
              />
            </div>

            <div className="description-field">
              <label className="data-label">Description:</label>
              <textarea
                type="text"
                name="description"
                onChange={handleChange}
                defaultValue={habit.description}
                autoComplete={'off'}
                className={desError !== '' ? 'red-border' : ''}
              />
            </div>

            <div className="time-picker">
              <label className="time-label">Reminder Time:</label>
              <MobileTimePicker
                label=""
                orientation="portrait"
                ampm
                value={habit.reminderTime}
                onChange={(newValue) => {
                  setTime(newValue)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>

            <DayPicker
              isEditMode={props.isEditMode}
              daysCheck={habit.reminderDays}
              onDaysCheck={handleDayCheck}
            />
          </form>

          <footer className="modal-footer">
            {titleError === '' && desError === '' && <div className="error-message"></div>}
            {titleError !== '' && <div className="error-message">{titleError}</div>}
            {desError !== '' && <div className="error-message">{desError}</div>}
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
