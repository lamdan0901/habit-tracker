import Modal from 'react-modal'
import { useState, useRef, useEffect } from 'react'
import { Checkbox } from '@nextui-org/react'
import { BsTrash } from 'react-icons/bs'

import HabitModal from 'components/HabitModal/HabitModal'
import { useClockState } from 'contexts/SidebarProvider'
import { normalColor, checkColor, expirationColor } from 'constants/habitColors'
import './HabitList.scss'

export default function HabitList(props) {
  const [habitModalOpened, setHabitModalOpened] = useState(false)
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false)

  const [currentHabit, setCurrentHabit] = useState({})
  const [tempHabit, setTempHabit] = useState() //habit that is saved before being deleted

  function handleChooseHabit(habit) {
    setCurrentHabit(habit)
    setHabitModalOpened(true)
  }

  function handleDeleteHabit() {
    props.onDeleteHabit(tempHabit)
  }

  function handleOpenDialog(habit) {
    setTempHabit(habit)
    setConfirmDialogOpened(true)
  }

  function handleCloseConfirmDialog() {
    setConfirmDialogOpened(false)
  }

  //**---- handle set habit checked or not ----**//

  const habitIds = props.habitsList.map((habit) => habit.id)
  const [habitsCheck, setHabitsCheck] = useState(props.habitsCheck.checkedHabitList)
  const [allHabitsCheck, setAllHabitsCheck] = useState(() => {
    if (habitsCheck.length === props.habitsList.length) return true
    return false
  })

  // console.log(props.habitsCheck.checkedHabitList)

  const handleAllHabitsCheck = () => {
    if (allHabitsCheck) {
      setAllHabitsCheck(false)
      setHabitsCheck([])
      props.habitsList.forEach((habit) => {
        habit.checked = false
        props.onEditHabit(habit, 'no notification')
      })
    } else {
      setAllHabitsCheck(true)
      setHabitsCheck(habitIds)
      props.habitsList.forEach((habit) => {
        if (!habit.checked) {
          habit.checked = true
          props.onEditHabit(habit, 'no notification')
        }
      })
    }
  }

  const handleSingleHabitCheck = (habit, index) => {
    const id = habit.id

    if (habitsCheck.includes(id)) {
      setHabitsCheck(habitsCheck.filter((checked_ID) => checked_ID !== id))
      setAllHabitsCheck(false)
      habitsCheck[index] = false
    } else {
      habitsCheck.push(id)
      setHabitsCheck([...habitsCheck])
      setAllHabitsCheck(habitsCheck.length === habitIds.length)
      habitsCheck[index] = true
    }

    props.onEditHabit(habit, 'no notification')
  }

  useEffect(() => {
    setHabitsCheck(() => {
      return props.habitsCheck.checkedHabitList
    })
  }, [props.habitsCheck.checkedHabitList])

  useEffect(() => {
    setAllHabitsCheck(() => {
      if (habitsCheck.length === props.habitsList.length) return true
      return false
    })
  }, [habitsCheck, props.habitsList.length])

  //**---- handle change 'gridTemplateColumns' of the habits list according to width ----**//

  const habitsListRef = useRef()
  const [habitsListStyle, setHabitsListStyle] = useState({
    display: 'grid',
    gridTemplateColumns: 'auto auto',
  })

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const habitsListElement = entries[0]

      if (habitsListElement.contentRect.width < 530) {
        setHabitsListStyle((prevValue) => ({ ...prevValue, gridTemplateColumns: 'auto' }))
      } else {
        setHabitsListStyle((prevValue) => ({ ...prevValue, gridTemplateColumns: 'auto auto' }))
      }
    })
    resizeObserver.observe(habitsListRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [habitsListRef])

  //**---- handle display habit color according to clockState and habitTime ----**//

  const clockState = useClockState()
  const [habitMainColors, setHabitMainColors] = useState([])

  useEffect(() => {
    const currentColorsList = []

    props.habitsList.forEach((habit) => {
      if (!habit.checked) {
        const formattedHabitTime = formatHabitTime(habit.time)
        const am_pmCompareRes = clockState.slice(6, 8).localeCompare(formattedHabitTime.slice(6, 8))

        //PM-PM || AM-AM
        if (am_pmCompareRes === 0) {
          const formattedTimeHour = ~~formattedHabitTime.slice(0, 2)
          const formattedTimeMinute = ~~formattedHabitTime.slice(3, 5)

          const clockStateHour = ~~clockState.slice(0, 2)
          const clockStateMinute = ~~clockState.slice(3, 5)

          if (formattedTimeHour === clockStateHour) {
            if (formattedTimeMinute < clockStateMinute) {
              currentColorsList.push(expirationColor)
            } else {
              currentColorsList.push(normalColor)
            }
          } else if (formattedTimeHour !== 12 && clockStateHour !== 12) {
            if (formattedTimeHour < clockStateHour) {
              currentColorsList.push(expirationColor)
            } else {
              currentColorsList.push(normalColor)
            }
          } else if (formattedTimeHour === 12) {
            currentColorsList.push(expirationColor)
          } else {
            currentColorsList.push(normalColor)
          }
        }
        //PM-AM
        else if (am_pmCompareRes === 1) {
          currentColorsList.push(expirationColor)
        }
        //AM-PM
        else {
          currentColorsList.push(normalColor)
        }
      } else {
        currentColorsList.push(checkColor)
      }
    })

    setHabitMainColors(currentColorsList)
  }, [clockState, props.habitsList])

  function formatHabitTime(habitTime) {
    let formattedHabitTime = new Date(habitTime).toString().slice(16, 21)
    const hour = ~~formattedHabitTime.slice(0, 2)
    const minute = formattedHabitTime.slice(3, 5)

    if (hour === 0) {
      formattedHabitTime = 12 + ':' + minute + ' AM'
    } else if (hour < 12) {
      if (hour < 10) formattedHabitTime = '0' + hour + ':' + minute + ' AM'
      else formattedHabitTime = hour + ':' + minute + ' AM'
    } else if (hour === 12) {
      formattedHabitTime = hour + ':' + minute + ' PM'
    } else {
      if (hour - 12 < 10) formattedHabitTime = '0' + (hour - 12) + ':' + minute + ' PM'
      else formattedHabitTime = hour - 12 + ':' + minute + ' PM'
    }

    return formattedHabitTime
  }

  return (
    <>
      {habitModalOpened && (
        <HabitModal
          isEditMode={true}
          habit={currentHabit}
          habitsList={props.habitsList}
          isEditModalOpened={habitModalOpened}
          onEditHabit={props.onEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onCloseModal={() => {
            setHabitModalOpened(false)
          }}
        />
      )}

      <div className="habits-view">
        <div>
          <Checkbox
            color="primary"
            className="check-all_done-box"
            title="Click to set all the habits done"
            onChange={handleAllHabitsCheck}
            checked={allHabitsCheck}>
            All done
          </Checkbox>
        </div>

        <ul className="habits-list" ref={habitsListRef} style={habitsListStyle}>
          {props.habitsList.map((habit, index) => (
            <div key={index}>
              <Checkbox
                color="success"
                className="check-habit-box"
                title="Click to check this habit"
                checked={habitsCheck[index]}
                onChange={() => {
                  handleSingleHabitCheck(habit)
                }}
              />

              <li
                title="Click to view details"
                style={habitMainColors[index]}
                onClick={() => {
                  handleChooseHabit(habit)
                }}>
                <p className="habit-name">{habit.name}</p>

                <div className="habit-time">{formatHabitTime(habit.time)}</div>

                <div
                  title="Delete this habit"
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation() //so that when we click the child element, it won't call the parent element
                    handleOpenDialog(habit)
                  }}>
                  <BsTrash />
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>

      <Modal
        className="confirm-dialog"
        overlayClassName="confirm-dialog-overlay"
        isOpen={confirmDialogOpened}
        onRequestClose={handleCloseConfirmDialog}
        shouldCloseOnOverlayClick={false}
        closeTimeoutMS={200}>
        <div className="confirm-dialog-content">
          <h3>Delete Habit</h3>
          <p>Are you sure you want to delete this habit?</p>
          <div className="delete-btn-group">
            <button
              className="btn cancel-btn"
              onClick={() => {
                handleDeleteHabit()
                handleCloseConfirmDialog()
              }}>
              DELETE
            </button>
            <button className="btn confirm-btn" onClick={handleCloseConfirmDialog}>
              CANCEL
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
