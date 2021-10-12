import Modal from 'react-modal'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'

import 'react-datepicker/dist/react-datepicker.css'
import './AddHabit.scss'

export default function AddHabit(props) {
  registerLocale('vi', vi)

  const [modalOpened, setModalOpened] = useState(false)
  const [error, setError] = useState('')

  const [habitName, setHabitName] = useState('')
  const [description, setDescription] = useState('')

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState('')

  const StartDate = startDate.toString().slice(4, 15)
  let EndDate = endDate.toString().slice(4, 15)
  const totalDay = EndDate.slice(4, 6) - StartDate.slice(4, 6)

  function handleAddHabit() {
    if (EndDate === StartDate) EndDate = null
    if (!habitName) setError("Habit's name is not left blank!")
    else {
      props.addHabit({
        habitName,
        description,
        StartDate,
        EndDate,
        time: startDate.toString().slice(16, 21),
        checkedTimes: 0,
        totalDay,
        //remember to add data validation, notification
        //and update the API's keys before moving on to editing and deleting habit
      })

      handleCloseModal()
    }
  }

  function handleNameChange(e) {
    setHabitName(e.target.value)
  }
  function handleDescriptionChange(e) {
    setDescription(e.target.value)
  }

  function handleOpenModal() {
    setModalOpened(true)
  }
  function handleCloseModal() {
    setModalOpened(false)
    setError('')
  }

  return (
    <div>
      <button className="btn add-btn" onClick={handleOpenModal}>
        Add Habit
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
          <h2 className="title">Add Habit</h2>

          <form className="data-fields">
            <div className="name-input">
              <input
                type="text"
                placeholder=" "
                className={error !== '' ? 'red-border' : ''}
                onChange={handleNameChange}
                value={props.name}
              />
              <label>Habit's Name</label>
            </div>

            <div className="description-input">
              <textarea
                placeholder=" "
                onChange={handleDescriptionChange}
                value={props.description}
                style={{ fontSize: '16px', height: '60px' }}
              />
              <label>Description</label>
            </div>
          </form>

          {/* Pick starting date */}
          <label className="starting-label">Start Date and Remind Time:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy h:mm aa"
            timeInputLabel="Time:"
            showTimeInput
            locale="vi"
            className="date-input"
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            showPopperArrow={false}
            // withPortal
            // portalId="root-portal"
            // calendarClassName="date-picker-inside"
            // wrapperClassName="date-picker"
          />

          {/* Pick ending date (this is not picked by default)*/}
          <label className="finishing-label">Finish Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            locale="vi"
            className="date-input"
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            isClearable
            openToDate={new Date()}
            showPopperArrow={false}
            placeholderText="Unset"
          />

          <div className="footer">
            <div className="error-message">{error !== '' && error}</div>
            <div>
              <button className="btn confirm-btn" onClick={handleAddHabit}>
                ADD
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
