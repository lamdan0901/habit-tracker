import './AddHabit.scss'
import Modal from 'react-modal'
import { useState } from 'react'

export default function AddHabit(props) {
  const [modalOpened, setModalOpened] = useState(false)

  function handleAddHabit() {
    handleCloseModal()
  }

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
        closeTimeoutMS={200}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className="Modal"
        overlayClassName="Overlay">
        <div className="modal-content">
          <h2 className="title">Add Habit</h2>

          <div className="data-input">
            <input type="text" />
            <textarea placeholder="Remember, be nice!" rows="4" />
          </div>

          <div className="footer">
            <button className="btn confirm-btn" onClick={handleAddHabit}>
              ADD
            </button>
            <button className="btn cancel-btn" onClick={handleCloseModal}>
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
