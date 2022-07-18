import './HabitModal.scss'

import MobileTimePicker from '@mui/lab/MobileTimePicker'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { useState } from 'react'
import Modal from 'react-modal'

import DayPicker from './DayPicker/DayPicker'
import { Habit } from '../../reducers/habitSlice'
import { IoAddSharp } from 'react-icons/io5'

interface HabitModalProps {
  habit: Habit
  habitList: Habit[]
  isEditMode?: boolean
  isEditModalOpened: boolean
  onAddHabit(newHabit: Habit, msg: string): void
  onEditHabit(id: number, habit: Habit): void
  onCloseModal(): void
}

export default function HabitModal(props: HabitModalProps) {
  const now = new Date()

  const initialHabitValues: Habit = props.isEditMode
    ? {
        id: props.habit.id,
        title: props.habit.title,
        description: props.habit.description,
        reminderTime: new Date(
          now.toString().slice(0, 16) + props.habit.reminderTime + now.toString().slice(21),
        ),
        reminderDays: props.habit.reminderDays,
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
  const [desError, setDesError] = useState('')

  function saveHabit() {
    if (isHabitInputsInvalid()) return

    let newHabit = habit
    newHabit.reminderTime = formatTime()

    if (props.isEditMode) {
      const id = newHabit.id as number
      delete newHabit.id
      delete newHabit?.performances

      props.onEditHabit(id, newHabit)
    } else {
      props.onAddHabit(newHabit, '')
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

    let hour: number | string = habitReminderTime.getHours()
    hour = ~~hour >= 10 ? hour : '0' + hour

    let minute: number | string = habitReminderTime.getMinutes()
    minute = ~~minute >= 10 ? minute : '0' + minute

    return hour + ':' + minute
  }

  function handleChange(e: any) {
    const { name, value } = e.target
    setHabit((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
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
    if (props.isEditMode) props.onCloseModal()
    setHabitModalOpened(false)
    setHabit(initialHabitValues)
    setTitleError('')
    setDesError('')
  }

  const isHabitInputsInvalid = () => {
    if (!habit.title) {
      setDesError('')
      setTitleError('Title is not left blank!')
      return true
    } else if (!habit.description) {
      setTitleError('')
      setDesError('Description is not left blank!')
      return true
    } else if (isHabitNameDuplicated(habit)) {
      setTitleError('Title is duplicated!')
      return true
    }
    return false
  }

  const isHabitNameDuplicated = (currentHabit: Habit) => {
    let habitTitles

    if (!props.isEditMode) habitTitles = props.habitList.map((habit: Habit) => habit.title)
    else
      habitTitles = props.habitList
        .filter((habit: Habit) => habit.title !== initialHabitValues.title)
        .map((habit: Habit) => habit.title)

    if (habitTitles.includes(currentHabit.title)) return true
    return false
  }

  return (
    <div>
      {!props.isEditMode ? (
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
                onChange={(newValue: any) => {
                  setTime(newValue)
                }}
                renderInput={(params: TextFieldProps) => <TextField {...params} />}
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
