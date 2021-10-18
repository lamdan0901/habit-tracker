import { useState } from 'react'
import Modal from 'react-modal'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import { SketchPicker } from 'react-color'

import DayPicker from './AddHabit.dayPicker'

import 'react-datepicker/dist/react-datepicker.css'
import './AddHabit.scss'

registerLocale('vi', vi)

export default function AddHabit(props) {
  const [modalOpened, setModalOpened] = useState(!!props.editModalOpened)
  const [startDate, setStartDate] = useState(new Date())
  const [error, setError] = useState('')

  const initialHabitValues = !props.editMode
    ? {
        name: '',
        daysChecked: [startDate.toString().slice(0, 3)],
        time: startDate.toString().slice(16, 21),
        checkedTimes: 0,
        color: '#fff',
      }
    : props.habit

  const [habit, setHabit] = useState(initialHabitValues)

  function handleDayCheck(days) {
    setHabit((prevValue) => ({
      ...prevValue,
      daysChecked: days,
    }))
  }

  // console.log(habit)

  function setTime(date) {
    setStartDate(date)

    setHabit((prevValue) => ({
      ...prevValue,
      time: date.toString().slice(16, 21),
    }))
  }

  function saveHabit() {
    if (!habit.name) setError("Habit's name is not left blank!")
    else {
      props.editMode ? props.editHabit(habit) : props.addHabit(habit)
      handleCloseModal()
    }
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

  function handleOpenModal() {
    setModalOpened(true)
  }
  function handleCloseModal() {
    setModalOpened(false)
    // props.editMode && props.closeModal()
    setHabit(initialHabitValues)
    setError('')
  }

  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  function handleChooseColorClick(e) {
    setDisplayColorPicker(!displayColorPicker)
    e.preventDefault()
  }

  function handleChooseColorClose() {
    setDisplayColorPicker(false)
  }

  function handleColorChange(color, event) {
    setHabit((prevValue) => ({
      ...prevValue,
      color: color,
    }))
  }

  //color picker' style
  const popover = {
    position: 'absolute',
    zIndex: '2',
  }
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }

  return (
    <div>
      <button className="btn add-btn" onClick={handleOpenModal}>
        +
      </button>

      <Modal
        isOpen={modalOpened}
        closeTimeoutMS={200}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className="Modal"
        overlayClassName="Overlay">
        {/* -------------------------- */}
        <div className="modal-content">
          <h2 className="title">{props.editMode ? 'Save Habit' : 'Add Habit'}</h2>

          <form className="data-fields">
            <div className="name-input">
              <label>Habit's Name:</label>
              <input
                type="text"
                placeholder=" "
                className={error !== '' ? 'red-border' : ''}
                name="name"
                onChange={handleChange}
                defaultValue={props.habit.name}
              />
            </div>

            <div className="time-and-color-pickers">
              <div className="time-picker">
                <label className="time-label">Pick A Time:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  locale="vi"
                  showPopperArrow={false}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="date-input"
                />
              </div>

              <div>
                <button className="btn pick-color-btn" onClick={handleChooseColorClick}>
                  Pick A Color
                </button>
                {displayColorPicker ? (
                  <div style={popover}>
                    <div style={cover} onClick={handleChooseColorClose} />
                    <SketchPicker color={habit.color} onChange={handleColorChange} />
                  </div>
                ) : null}
              </div>
            </div>

            <DayPicker daysCheck={habit.daysChecked} onDaysCheck={handleDayCheck} />
          </form>

          <div className="footer">
            <div className="error-message">{error !== '' && error}</div>
            <div>
              <button className="btn confirm-btn" onClick={saveHabit}>
                {props.editMode ? 'SAVE' : 'ADD'}
              </button>
              <button className="btn cancel-btn" onClick={handleCloseModal}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
