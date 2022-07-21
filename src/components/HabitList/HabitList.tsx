import './HabitList.scss'

import { Checkbox } from '@nextui-org/react'
import {
  LegacyRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { BsTrash } from 'react-icons/bs'
import Modal from 'react-modal'

import aibLogo from '../../assets/img/aib-logo.jpg'
import HabitModal from '../../components/HabitModal/HabitModal'
import { normalColor, checkColor, expirationColor } from '../../constants'
import { useClockState } from '../../contexts/UtilitiesProvider'
import { Habit, Performance } from '../../reducers/habitSlice'
import axiosClient from '../../utils/axiosClient'
import { sendBrowserNotif } from '../../utils/utilityFunctions'

type HabitMainColor = { backgroundColor: string; color: string }

interface HabitListProps {
  habitList: Habit[]
  onGetHabits(commandText: string): void
  onEditHabit(id: number, habit: Habit): void
  onDeleteHabit(habit: Habit): void
}

export default function HabitList({
  habitList,
  onGetHabits,
  onEditHabit,
  onDeleteHabit,
}: HabitListProps) {
  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  const [habitModalOpened, setHabitModalOpened] = useState(false)
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false)

  const [currentHabit, setCurrentHabit] = useState<Habit>()
  const [tempHabit, setTempHabit] = useState<Habit>() //habit that is saved before being deleted

  function handleChooseHabit(habit: Habit) {
    setCurrentHabit(habit)
    setHabitModalOpened(true)
  }

  function handleDeleteHabit() {
    onDeleteHabit(tempHabit as Habit)
  }

  function handleOpenDialog(habit: Habit) {
    setTempHabit(habit)
    setConfirmDialogOpened(true)
  }

  function handleCloseConfirmDialog() {
    setConfirmDialogOpened(false)
  }

  function handleCloseHabitModal() {
    setHabitModalOpened(false)
  }

  //**---- handle update habit checkboxes and habit check----**//

  const habitIds = habitList.map((habit: Habit) => habit.id)
  const [habitsCheck, setHabitsCheck] = useState<number[]>([])
  const [allHabitsCheck, setAllHabitsCheck] = useState(false)

  const updateHabitCheckBoxes = useCallback(() => {
    let habitCheckList: number[] = []

    habitList.forEach((habit: Habit) => {
      const habitPerformances = habit.performances as Performance[]

      for (const perf of habitPerformances) {
        if (perf.time === today && perf.isChecked === true) {
          habitCheckList.push(habit.id as number)
          break
        }
      }
    })

    setAllHabitsCheck(() => habitList.length !== 0 && habitCheckList.length === habitList.length)

    return habitCheckList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitList])

  useEffect(() => {
    setHabitsCheck(updateHabitCheckBoxes)
  }, [updateHabitCheckBoxes])

  async function handleCheckHabit(habit: Habit) {
    if (!habit.performances || !habit.id) {
      return
    }

    let inspectId
    const habitPerformance = habit.performances.find((perf: Performance) => perf.time === today)

    if (habitPerformance && habit.performances.length !== 0) {
      inspectId = habitPerformance.id
    }

    //* if performances (inspection list) is not created (performances.length==0), we make a POST request
    //* if performances is created (performances.length>0):
    //***  if today is not in performances, we make a POST request
    //***  else we update by making a PATCH request

    if (habitsCheck.includes(habit.id)) {
      await axiosClient.patch(`/inspection/${inspectId}`, {
        time: today,
        isChecked: false,
      })

      setHabitsCheck(habitsCheck.filter((checked_ID) => checked_ID !== habit.id))
      setAllHabitsCheck(false)
      onGetHabits('')
    } else {
      if (
        habit.performances.length !== 0 &&
        habit.performances.find((perf: Performance) => perf.time === today)
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
      onGetHabits('')
    }
  }

  //**---- handle changet the habits list's grid layout according to its width ----**//

  const habitListRef = useRef<HTMLUListElement>()
  const [habitListStyle, setHabitListStyle] = useState({
    display: 'grid',
    gridTemplateColumns: 'auto auto',
  })

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const habitsListElement = entries[0]

      if (
        habitsListElement.contentRect.width < 530 &&
        habitListStyle.gridTemplateColumns === 'auto auto'
      ) {
        setHabitListStyle((prevState) => ({
          ...prevState,
          gridTemplateColumns: 'auto',
        }))
      } else if (
        habitsListElement.contentRect.width >= 530 &&
        habitListStyle.gridTemplateColumns === 'auto'
      ) {
        setHabitListStyle((prevState) => ({
          ...prevState,
          gridTemplateColumns: 'auto auto',
        }))
      }
    })
    resizeObserver.observe((habitListRef as MutableRefObject<HTMLUListElement>).current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [habitListRef, habitListStyle])

  //**---- handle display habit color according to clockState and habitTime ----**//

  const clockState: string = useClockState()
  const [habitMainColors, setHabitMainColors] = useState<HabitMainColor[]>([])

  useEffect(() => {
    const currentColorsList: HabitMainColor[] = []

    habitList.forEach((habit: Habit) => {
      if (
        !habit.performances?.find(
          (perf: Performance) => perf.time === today && perf.isChecked === true,
        ) ||
        habit.performances.length === 0
      ) {
        const formattedHabitTime = formatHabitTime(habit.reminderTime as string)
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
  }, [clockState, habitList, today])

  function formatHabitTime(habitTime: string) {
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

  //**---- handle change all-done-checkbox's color ----**//

  const [allDoneColor, setAllDoneColor] = useState<HabitMainColor>()

  useLayoutEffect(() => {
    setAllDoneColor(() => {
      if (habitsCheck.length !== 0) {
        return allHabitsCheck ? checkColor : normalColor
      }

      if (!habitMainColors.includes(checkColor) && !habitMainColors.includes(normalColor)) {
        return expirationColor
      }

      return normalColor
    })
  }, [allHabitsCheck, habitsCheck, habitMainColors])

  //**---- handle send browser notification ----**//

  useEffect(() => {
    const currentHabitsList = habitList.filter((habit: Habit) =>
      habit.reminderDays.includes(now.getDay()),
    )

    currentHabitsList.forEach((habit: Habit) => {
      if (!habit.checked) {
        const formattedHabitTime = formatHabitTime(habit.reminderTime as string)
        if (formattedHabitTime.localeCompare(clockState) === 0) {
          sendBrowserNotif('Habit Tracker', "It's time you did this habit: " + habit.title, aibLogo)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockState, habitList])

  return (
    <>
      {habitModalOpened && (
        <HabitModal
          isEditMode={true}
          isEditModalOpened={habitModalOpened}
          habit={currentHabit as Habit}
          habitList={habitList}
          onEditHabit={onEditHabit}
          onAddHabit={() => {}}
          onCloseModal={handleCloseHabitModal}
        />
      )}

      <div className="habits-view">
        <div>
          <Checkbox
            color="primary"
            className="all_done-checkbox"
            checked={allHabitsCheck}
            style={allDoneColor}>
            All done
          </Checkbox>
        </div>

        <ul
          className="habits-list"
          ref={habitListRef as LegacyRef<HTMLUListElement>}
          style={habitListStyle}>
          {habitList.length !== 0 ? (
            habitList.map((habit: Habit, index: number) => (
              <div key={index}>
                <Checkbox
                  color="success"
                  className="check-habit-box"
                  title="Click to check this habit"
                  checked={habitsCheck.includes(habit.id as number)}
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

                  <div className="habit-time">{formatHabitTime(habit.reminderTime as string)}</div>

                  <div
                    title="Delete this habit"
                    className="delete-btn"
                    onClick={(e: any) => {
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

      {confirmDialogOpened && (
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
      )}
    </>
  )
}
