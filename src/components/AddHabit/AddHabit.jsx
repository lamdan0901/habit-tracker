import { useState } from 'react'
import Modal from 'react-modal'
import { SketchPicker } from 'react-color'
import DatePicker from 'react-datepicker'
// import { registerLocale } from 'react-datepicker'
// import vi from 'date-fns/locale/vi'
// registerLocale('vi', vi)

import DayPicker from './AddHabit.dayPicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import './AddHabit.scss'

export default function AddHabit(props) {
  const [modalOpened, setModalOpened] = useState(!!props.editModalOpened)
  const [error, setError] = useState('')

  const initialHabitValues = !props.editMode
    ? {
        name: '',
        daysChecked: [new Date().toString().slice(0, 3)],
        time: new Date(),
        checkedTimes: 0,
        // checked: false,
        bgColor: {
          hex: '#2a291b',
          rgb: {
            r: 228,
            g: 228,
            b: 228,
            a: 1,
          },
        },
        textColor: {
          hex: '#eae7e7',
          rgb: {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
          },
        },
      }
    : {
        id: props.habit.id,
        name: props.habit.name,
        daysChecked: props.habit.daysChecked,
        time: new Date(props.habit.time),
        checkedTimes: props.habit.checkedTimes,
        // checked: false,
        bgColor: props.habit.bgColor,
        textColor: props.habit.textColor,
      }

  const [habit, setHabit] = useState(initialHabitValues)

  function handleDayCheck(days) {
    setHabit((prevValue) => ({
      ...prevValue,
      daysChecked: days,
    }))
  }

  function setTime(date) {
    setHabit((prevValue) => ({
      ...prevValue,
      time: date,
    }))
  }

  function saveHabit() {
    if (!habit.name) setError("Habit's name is not left blank!")
    else {
      props.editMode ? props.onEditHabit(habit) : props.onAddHabit(habit)
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

  function handleDelete() {
    props.onDeleteHabit(habit.id)
    handleCloseModal()
  }

  function handleOpenModal() {
    setModalOpened(true)
  }
  function handleCloseModal() {
    setModalOpened(false)
    props.editMode && props.onCloseModal()
    setHabit(initialHabitValues)
    setError('')
  }

  const [displayBgColorPicker, setDisplayBgColorPicker] = useState(false)
  const [displayTextColorPicker, setDisplayTextColorPicker] = useState(false)

  function handleChooseBgColorClick(e) {
    setDisplayBgColorPicker(!displayBgColorPicker)
    e.preventDefault()
  }
  function handleChooseTextColorClick(e) {
    setDisplayTextColorPicker(!displayTextColorPicker)
    e.preventDefault()
  }

  function handleChooseBgColorClose() {
    setDisplayBgColorPicker(false)
  }
  function handleChooseTextColorClose() {
    setDisplayTextColorPicker(false)
  }

  function handleBgColorChange(bgColor, event) {
    setHabit((prevValue) => ({
      ...prevValue,
      bgColor: bgColor,
    }))
  }
  function handleTextColorChange(textColor, event) {
    setHabit((prevValue) => ({
      ...prevValue,
      textColor: textColor,
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
      {!props.editMode && (
        <button className="btn add-btn" onClick={handleOpenModal}>
          +
        </button>
      )}

      <Modal
        isOpen={modalOpened}
        closeTimeoutMS={200}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className="Modal"
        overlayClassName="Overlay">
        {/* -------------------------- */}
        <div className="modal-content">
          <h2 className="title">{props.editMode ? 'Edit Habit' : 'Add Habit'}</h2>

          <form className="data-fields">
            <div className="name-input">
              <label>Habit's Name:</label>
              <input
                type="text"
                placeholder=" "
                className={error !== '' ? 'red-border' : ''}
                name="name"
                onChange={handleChange}
                defaultValue={habit.name}
              />
            </div>

            <div className="time-picker">
              <label className="time-label">Pick A Time:</label>
              <DatePicker
                selected={habit.time}
                onChange={(date) => setTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                showPopperArrow={false}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="date-input"
              />
            </div>

            <div className="color-pickers">
              <div className="bgColor-picker">
                <label htmlFor="">Background Color: </label>
                <button
                  className="btn pick-color-btn"
                  onClick={handleChooseBgColorClick}
                  style={{ backgroundColor: habit.bgColor.hex }}>
                  <span style={{ color: habit.textColor.hex }}>{habit.bgColor.hex}</span>
                </button>
                {displayBgColorPicker ? (
                  <div style={popover}>
                    <div style={cover} onClick={handleChooseBgColorClose} />
                    <SketchPicker color={habit.bgColor} onChange={handleBgColorChange} />
                  </div>
                ) : null}
              </div>

              <div className="textColor-picker">
                <label htmlFor="">Text Color: </label>
                <button
                  className="btn pick-color-btn"
                  onClick={handleChooseTextColorClick}
                  style={{ backgroundColor: habit.textColor.hex }}>
                  <span style={{ color: habit.bgColor.hex }}>{habit.textColor.hex}</span>
                </button>
                {displayTextColorPicker ? (
                  <div style={popover}>
                    <div style={cover} onClick={handleChooseTextColorClose} />
                    <SketchPicker color={habit.textColor} onChange={handleTextColorChange} />
                  </div>
                ) : null}
              </div>
            </div>

            <DayPicker daysCheck={habit.daysChecked} onDaysCheck={handleDayCheck} />
          </form>

          <div className="footer">
            <div className="error-message">{error !== '' && error}</div>
            <div>
              {props.editMode && (
                <button className="btn cancel-btn" onClick={handleDelete}>
                  DELETE
                </button>
              )}
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
