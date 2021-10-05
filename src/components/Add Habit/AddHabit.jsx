import './AddHabit.scss'
import Modal from 'react-modal'
import { useState } from 'react'

export default function AddHabit(props) {
  const [modalOpened, setModalOpened] = useState(false)

  function handleOpenModal() {
    setModalOpened(true)
    props.setBlurBg(true)
  }

  function handleCloseModal() {
    setModalOpened(false)
    props.setBlurBg(false)
  }

  return (
    <div>
      <button className="btn add-btn" onClick={handleOpenModal}>
        Add Habit
      </button>
      <Modal
        isOpen={modalOpened}
        closeTimeoutMS={300}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className="Modal"
        overlayClassName="Overlay">
        <h2>Add Habit</h2>
        <div className="divider"></div>
        <input type="text" />
        <textarea placeholder="Remember, be nice!" cols="30" rows="5" />
        <button className="btn add-btn" onClick={handleCloseModal}>
          Add
        </button>
        <button className="btn add-btn" onClick={handleCloseModal}>
          Cancel
        </button>
      </Modal>
    </div>
  )
}
