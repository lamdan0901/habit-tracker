import Modal from 'react-modal'
import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { Checkbox } from '@nextui-org/react'
import { BsTrash } from 'react-icons/bs'

import axiosClient from 'utils/axiosClient'
import HabitModal from 'components/HabitModal/HabitModal'
import { useClockState } from 'contexts/SidebarProvider'

import * as habitColor from 'constants/habitColors'
import aibLogo from '../../assets/img/aib-logo.jpg'
import './HabitList.scss'

export default function HabitList(props) {
  const [habitModalOpened, setHabitModalOpened] = useState(false)
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false)

  const [currentHabit, setCurrentHabit] = useState({})
  const [tempHabit, setTempHabit] = useState() //habit that is saved before being deleted
  const now = new Date()
  const today = now.toISOString().slice(0, 10)

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

  function handleCloseHabitModal() {
    setHabitModalOpened(false)
  }

  //** handle sort habits by habit.reminderTime */
  // we can give more options to sort by name, by being checked or not later
  let sortedHabitList = useRef(props.habitList)

  useEffect(() => {
    sortedHabitList.current = props.habitList
    sortedHabitList.current.sort((habit1, habit2) => {
      return habit1.reminderTime > habit2.reminderTime
        ? 1
        : habit2.reminderTime > habit1.reminderTime
        ? -1
        : 0
    })
  }, [props.habitList])

  //**---- handle update habit checkboxes and habit check----**//

  const habitIds = props.habitList.map((habit) => habit.id)
  const [habitsCheck, setHabitsCheck] = useState([])
  const [allHabitsCheck, setAllHabitsCheck] = useState(false)

  const updateHabitCheckBoxes = useCallback(() => {
    let habitsCheckList = []

    sortedHabitList.current.forEach((habit) => {
      for (let i = 0; i < habit.performances.length; i++) {
        if (habit.performances[i].time === today && habit.performances[i].isChecked === true) {
          habitsCheckList.push(habit.id)
          break
        }
      }
    })

    setAllHabitsCheck(() =>
      habitsCheckList.length === props.habitList.length && props.habitList.length !== 0
        ? true
        : false,
    )

    return habitsCheckList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedHabitList])

  useEffect(() => {
    setHabitsCheck(updateHabitCheckBoxes)
  }, [updateHabitCheckBoxes])

  async function handleCheckHabit(habit) {
    const inspectId =
      habit.performances.length !== 0 && habit.performances.find((perf) => perf.time === today)
        ? habit.performances.find((perf) => perf.time === today).id
        : null

    // if performances (inspection list) is not created (performances.length==0), we create by POST request
    // if performances is created (performances.length>0):
    // + if today is not in performances, we create by POST request
    // + else we update by PATCH request

    if (habitsCheck.includes(habit.id)) {
      await axiosClient.patch(`/inspection/${inspectId}`, {
        time: today,
        isChecked: false,
      })

      setHabitsCheck(habitsCheck.filter((checked_ID) => checked_ID !== habit.id))
      setAllHabitsCheck(false)
      props.onGetHabits()
    } else {
      if (
        habit.performances.length !== 0 &&
        habit.performances.find((perf) => perf.time === today)
      ) {
        await axiosClient.patch(`/inspection/${inspectId}`, {
          time: today,
          isChecked: true,
        })
      } else {
        await axiosClient.post('/inspection', {
          time: today,
          isChecked: true,
          habitId: habit.id,
        })
      }

      habitsCheck.push(habit.id)
      setHabitsCheck([...habitsCheck])
      setAllHabitsCheck(habitsCheck.length === habitIds.length)
      props.onGetHabits()
    }
  }

  //**---- handle change 'gridTemplateColumns' of the habits list according to its width ----**//

  const habitListRef = useRef()
  const [habitListStyle, setHabitListStyle] = useState({
    display: 'grid',
    gridTemplateColumns: 'auto auto',
  })

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const habitsListElement = entries[0]

      if (habitsListElement.contentRect.width < 530) {
        setHabitListStyle((prevState) => ({
          ...prevState,
          gridTemplateColumns: 'auto',
        }))
      } else {
        setHabitListStyle((prevState) => ({
          ...prevState,
          gridTemplateColumns: 'auto auto',
        }))
      }
    })
    resizeObserver.observe(habitListRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [habitListRef])

  //**---- handle display habit color according to clockState and habitTime ----**//

  const clockState = useClockState()
  const [habitMainColors, setHabitMainColors] = useState([])

  useEffect(() => {
    const currentColorsList = []

    sortedHabitList.current.forEach((habit) => {
      if (
        !habit.performances.find((perf) => perf.time === today && perf.isChecked === true) ||
        habit.performances.length === 0
      ) {
        const formattedHabitTime = formatHabitTime(habit.reminderTime)
        const am_pmCompareRes = clockState.slice(6, 8).localeCompare(formattedHabitTime.slice(6, 8))

        //PM-PM || AM-AM
        if (am_pmCompareRes === 0) {
          const formattedTimeHour = ~~formattedHabitTime.slice(0, 2)
          const formattedTimeMinute = ~~formattedHabitTime.slice(3, 5)

          const clockStateHour = ~~clockState.slice(0, 2)
          const clockStateMinute = ~~clockState.slice(3, 5)

          if (formattedTimeHour === clockStateHour) {
            if (formattedTimeMinute < clockStateMinute) {
              currentColorsList.push(habitColor.expirationColor)
            } else {
              currentColorsList.push(habitColor.normalColor)
            }
          } else if (formattedTimeHour !== 12 && clockStateHour !== 12) {
            if (formattedTimeHour < clockStateHour) {
              currentColorsList.push(habitColor.expirationColor)
            } else {
              currentColorsList.push(habitColor.normalColor)
            }
          } else if (formattedTimeHour === 12) {
            currentColorsList.push(habitColor.expirationColor)
          } else {
            currentColorsList.push(habitColor.normalColor)
          }
        }
        //PM-AM
        else if (am_pmCompareRes === 1) {
          currentColorsList.push(habitColor.expirationColor)
        }
        //AM-PM
        else {
          currentColorsList.push(habitColor.normalColor)
        }
      } else {
        currentColorsList.push(habitColor.checkColor)
      }
    })

    setHabitMainColors(currentColorsList)
  }, [clockState, props.habitList, today])

  function formatHabitTime(habitTime) {
    const hour = ~~habitTime.slice(0, 2)
    const minute = habitTime.slice(3, 5)

    if (hour === 0) {
      habitTime = 12 + ':' + minute + ' AM'
    } else if (hour < 12) {
      if (hour < 10) habitTime = '0' + hour + ':' + minute + ' AM'
      else habitTime = hour + ':' + minute + ' AM'
    } else if (hour === 12) {
      habitTime = hour + ':' + minute + ' PM'
    } else {
      if (hour - 12 < 10) habitTime = '0' + (hour - 12) + ':' + minute + ' PM'
      else habitTime = hour - 12 + ':' + minute + ' PM'
    }

    return habitTime
  }

  //**---- handle change all done checkbox color ----**//

  const [allDoneColor, setAllDoneColor] = useState()

  useLayoutEffect(() => {
    setAllDoneColor(() => {
      if (habitsCheck.length !== 0) {
        return allHabitsCheck ? habitColor.checkColor : habitColor.normalColor
      }

      if (
        !habitMainColors.includes(habitColor.checkColor) &&
        !habitMainColors.includes(habitColor.normalColor)
      ) {
        return habitColor.expirationColor
      }

      return habitColor.normalColor
    })
  }, [allHabitsCheck, habitsCheck, habitMainColors])

  //**---- handle send browser notification ----**//

  useEffect(() => {
    const currentHabitsList = props.habitList.filter((habit) =>
      habit.reminderDays.includes(now.getDay()),
    )

    currentHabitsList.forEach((habit) => {
      if (!habit.checked) {
        const formattedHabitTime = formatHabitTime(habit.reminderTime)
        if (formattedHabitTime.localeCompare(clockState) === 0) {
          sendBrowserNotif('Habit Tracker', "It's time you did this habit: " + habit.title, aibLogo)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockState, props.habitList])

  function sendBrowserNotif(title, body, icon) {
    if (!('Notification' in window)) {
      console.warn('Your Browser does not support Chrome Notifications :(')
    } else if (Notification.permission === 'granted') {
      new Notification(title, {
        icon,
        body,
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            icon,
            body,
          })
        } else {
          console.warn(`Failed, Notification Permission is ${Notification.permission}`)
        }
      })
    } else {
      console.warn(`Failed, Notification Permission is ${Notification.permission}`)
    }
  }

  return (
    <>
      {habitModalOpened && (
        <HabitModal
          isEditMode={true}
          habit={currentHabit}
          habitList={props.habitList}
          isEditModalOpened={habitModalOpened}
          onEditHabit={props.onEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onCloseModal={handleCloseHabitModal}
        />
      )}

      <div className="habits-view">
        <div>
          <Checkbox
            color="primary"
            className="check-all_done-box"
            checked={allHabitsCheck}
            style={allDoneColor}>
            All done
          </Checkbox>
        </div>

        <ul className="habits-list" ref={habitListRef} style={habitListStyle}>
          {sortedHabitList.current.length !== 0 ? (
            props.habitList.map((habit, index) => (
              <div key={index}>
                <Checkbox
                  color="success"
                  className="check-habit-box"
                  title="Click to check this habit"
                  checked={habitsCheck.includes(habit.id)}
                  onChange={() => {
                    handleCheckHabit(habit)
                  }}
                />

                <li
                  title="Click to view details"
                  style={habitMainColors[index]}
                  onClick={() => {
                    handleChooseHabit(habit)
                  }}>
                  <p className="habit-name">{habit.title}</p>

                  <div className="habit-time">{formatHabitTime(habit.reminderTime)}</div>

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
            ))
          ) : (
            <div className="no-habit-msg">
              <p>You don't have any habits yet! Click</p>
              <span className="add-btn-icon">+</span>
              <p> to add one</p>
            </div>
          )}
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
