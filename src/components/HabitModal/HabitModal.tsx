import './HabitModal.scss'

import { MobileTimePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import Modal from 'react-modal'

import DayPicker from './DayPicker/DayPicker'

interface HabitModalProps {
  habit: Habit | null
  habitList: Habit[]
  habitModalOpened: boolean
  onChooseHabit(habit: Habit | null): void
  onAddHabit?(newHabit: Habit): void
  onEditHabit?(id: string, habit: Habit): void
  onCloseModal?(): void
}

const initEmptyValue = {
  title: '',
  description: '',
  reminderTime: new Date(),
  reminderDays: [0, 1, 2, 3, 4, 5, 6],
  performances: [],
}

export default function HabitModal(props: HabitModalProps) {
  const now = new Date()

  const initialHabitValue: Habit = props.habit?._id
    ? {
        ...props.habit,
        reminderTime: new Date(
          now.toString().slice(0, 16) + props.habit.reminderTime + now.toString().slice(21),
        ),
        reminderDays: [...props.habit.reminderDays],
      }
    : initEmptyValue

  const [habit, setHabit] = useState(initialHabitValue)
  const [titleError, setTitleError] = useState('')

  if (props.habit?._id !== habit._id) {
    setHabit(initialHabitValue)
  } else if (!props.habit?._id && habit._id) {
    setHabit(initEmptyValue)
  }

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
    setHabit(initEmptyValue)
    props.onChooseHabit(null)
    setTitleError('')
    props.onCloseModal?.()
  }

  return (
    <div>
      <Modal
        className="habit-modal"
        overlayClassName="habit-modal-overlay"
        closeTimeoutMS={200}
        isOpen={props.habitModalOpened}
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
                onChange={(value: any) => setTime(value)}
                componentsProps={{ textField: { variant: 'outlined' } }}
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
