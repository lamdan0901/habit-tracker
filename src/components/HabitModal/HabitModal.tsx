import './HabitModal.scss'

import { MobileTimePicker } from '@mui/x-date-pickers'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { useState } from 'react'
import Modal from 'react-modal'

import DayPicker from './DayPicker/DayPicker'
import { IoAddSharp } from 'react-icons/io5'

interface HabitModalProps {
  habit?: Habit
  habitList: Habit[]
  isEditModalOpened?: boolean
  onAddHabit?(newHabit: Habit): void
  onEditHabit?(id: string, habit: Habit): void
  onCloseModal?(): void
}

export default function HabitModal(props: HabitModalProps) {
  const now = new Date()

  const initialHabitValues: Habit = props.habit?._id
    ? {
        _id: props.habit._id,
        title: props.habit.title,
        description: props.habit.description,
        reminderTime: new Date(
          now.toString().slice(0, 16) + props.habit.reminderTime + now.toString().slice(21),
        ),
        reminderDays: [...props.habit.reminderDays],
        performances: props.habit.performances,
      }
    : {
        title: '',
        description: '',
        reminderTime: now,
        reminderDays: [0, 1, 2, 3, 4, 5, 6],
        performances: [],
      }

  const [habitModalOpened, setHabitModalOpened] = useState(!!props.isEditModalOpened)
  const [habit, setHabit] = useState(initialHabitValues)
  const [titleError, setTitleError] = useState('')

  function saveHabit() {
    if (!habit.title) {
      setTitleError('Title is not left blank!')
      return
    }

    const newHabit = { ...habit }
    newHabit.reminderTime = formatTime()

    if (props.habit?._id) {
      const id = newHabit._id
      delete newHabit._id
      delete newHabit?.performances

      if (id) props.onEditHabit?.(id, newHabit)
    } else {
      props.onAddHabit?.(newHabit)
    }
    handleCloseModal()
  }

  function setTime(date: Date) {
    setHabit((prevValue) => ({
      ...prevValue,
      reminderTime: date,
    }))
  }

  function formatTime() {
    const habitReminderTime = habit.reminderTime as Date

    const hour = habitReminderTime.getHours().toString().padStart(2, '0')
    const minute = habitReminderTime.getMinutes().toString().padStart(2, '0')
    return `${hour}:${minute}`
  }

  function handleChange(e: any) {
    setHabit((prevValue) => {
      return {
        ...prevValue,
        [e.target.name]: e.target.value,
      }
    })
  }

  function handleDayCheck(days: number[]) {
    setHabit((prevValue) => ({
      ...prevValue,
      reminderDays: days,
    }))
  }

  function handleCloseModal() {
    props.onCloseModal?.()
    setHabitModalOpened(false)
    setHabit(initialHabitValues)
    setTitleError('')
  }

  return (
    <div>
      {!props.habit?._id ? (
        <button
          className="btn add-btn"
          onClick={() => {
            setHabitModalOpened(true)
          }}>
          <IoAddSharp />
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
          <h2 className="modal-title">{props.habit?._id ? 'View Habit' : 'Add Habit'}</h2>

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
                name="description"
                onChange={handleChange}
                defaultValue={habit.description}
                autoComplete={'off'}
              />
            </div>

            <div className="time-picker">
              <label className="time-label">Reminder Time:</label>
              <MobileTimePicker
                label=""
                orientation="portrait"
                ampm
                value={habit.reminderTime}
                onChange={(newValue: any) => {
                  setTime(newValue)
                }}
                renderInput={(params: TextFieldProps) => <TextField {...params} />}
              />
            </div>

            <DayPicker
              isEditMode={!!props.habit?._id}
              daysCheck={habit.reminderDays}
              onDaysCheck={handleDayCheck}
            />
          </form>

          <footer className="modal-footer">
            <div className="error-message">{titleError ?? ''}</div>
            <div>
              <button className="btn confirm-btn" onClick={saveHabit}>
                {props.habit?._id ? 'EDIT' : 'ADD'}
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
