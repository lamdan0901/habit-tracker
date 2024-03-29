import './HabitList.scss'

import { Checkbox } from '@nextui-org/react'
import { LegacyRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import Modal from 'react-modal'

import habitsInspectionApi from '../../apis/habitsInspectionApi'
import aibLogo from '../../assets/img/aib-logo.jpg'
import { checkColor, expirationColor, normalColor } from '../../constants'
import { useUtilities } from '../../contexts/UtilitiesProvider'
import {
  sendBrowserNotif,
  convertTime12To24,
  convertTime24To12,
} from '../../utils/utilityFunctions'
import clsx from 'clsx'

type HabitMainColor = { backgroundColor: string; color: string }

interface HabitListProps {
  habitList: Habit[]
  onGetHabits(params?: GetHabitsParams): void
  onDeleteHabit(habit: Habit): void
  onChooseHabit(habit: Habit): void
  onHabitModelOpen(value: boolean): void
  habitModalOpened: boolean
}

export default function HabitList({
  habitList,
  onGetHabits,
  onDeleteHabit,
  onChooseHabit,
  onHabitModelOpen,
}: HabitListProps) {
  const now = new Date()
  const convertedClockState = useRef('')
  const today = now.toISOString().slice(0, 10)
  const { sidebarOpen, windowWidth } = useUtilities()

  const [isChecking, setIsChecking] = useState(false)
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false)

  const [tempHabit, setTempHabit] = useState<Habit>() //habit that is saved before being deleted

  function handleChooseHabit(habit: Habit) {
    onChooseHabit(habit)
    onHabitModelOpen(true)
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
    onHabitModelOpen(false)
  }

  //**---- handle update habit checkboxes and habit check----**//

  const habitIds = habitList.map((habit: Habit) => habit._id)
  const [habitsCheck, setHabitsCheck] = useState<string[]>([])
  const [allHabitsChecked, setAllHabitsChecked] = useState(false)

  const updateHabitCheckBoxes = useCallback(() => {
    let habitCheckList: string[] = []

    habitList.forEach((habit: Habit) => {
      if (isHabitCheckedToday(habit)) {
        habitCheckList.push(habit._id ?? '')
      }
    })

    setAllHabitsChecked(() => habitList.length !== 0 && habitCheckList.length === habitList.length)

    return habitCheckList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitList])

  useEffect(() => {
    setHabitsCheck(updateHabitCheckBoxes)
  }, [updateHabitCheckBoxes])

  async function handleCheckHabit(habit: Habit) {
    if (!habit.performances || !habit._id) {
      return
    }

    let inspectionId
    const todayPerformance = habit.performances.find((perf: Performance) => perf.time === today)

    if (todayPerformance) {
      inspectionId = todayPerformance._id
    }

    setIsChecking(true)

    //* if performances (inspection list) is not created (performances.length==0), we make a POST request
    //* if performances is created (performances.length>0):
    //***  if performances doesn't include today , we make a POST request
    //***  else we update by making a PATCH request

    if (habitsCheck.includes(habit._id) && inspectionId) {
      await habitsInspectionApi.patchInspection(
        {
          time: today,
          isChecked: false,
        },
        inspectionId,
      )

      setHabitsCheck(habitsCheck.filter((checked_ID) => checked_ID !== habit._id))
      setAllHabitsChecked(false)
    } else {
      if (
        inspectionId &&
        habit.performances.length !== 0 &&
        habit.performances.find((perf: Performance) => perf.time === today)
      ) {
        await habitsInspectionApi.patchInspection(
          {
            time: today,
            isChecked: true,
          },
          inspectionId,
        )
      } else {
        await habitsInspectionApi.postInspection({
          time: today,
          isChecked: true,
          habitId: habit._id,
        })
      }

      habitsCheck.push(habit._id)
      setHabitsCheck([...habitsCheck])
      setAllHabitsChecked(habitsCheck.length === habitIds.length)
    }

    setIsChecking(false)
    onGetHabits()
  }

  //**---- handle change the habits list's grid layout according to its width ----**//

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

  const { clockState } = useUtilities()
  const [habitMainColors, setHabitMainColors] = useState<HabitMainColor[]>([])

  useEffect(() => {
    const currentColorList: HabitMainColor[] = []

    habitList.forEach((habit: Habit) => {
      if (!isHabitCheckedToday(habit) || habit.performances?.length === 0) {
        let [habitHour, habitMinute] = (habit.reminderTime as string)
          .split(':')
          .map((item) => parseInt(item))

        let [clockHour, clockMinute] = convertedClockState.current
          .split(':')
          .map((item) => parseInt(item))

        if (habitHour < clockHour) {
          currentColorList.push(expirationColor)
        } else if (habitHour > clockHour) {
          currentColorList.push(normalColor)
        } else {
          if (habitMinute >= clockMinute) {
            currentColorList.push(normalColor)
          } else {
            currentColorList.push(expirationColor)
          }
        }
      } else {
        currentColorList.push(checkColor)
      }
    })

    setHabitMainColors(currentColorList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertedClockState.current, habitList, today])

  //**---- handle change all-done-checkbox's color ----**//

  const [allDoneColor, setAllDoneColor] = useState<HabitMainColor>()

  useEffect(() => {
    setAllDoneColor(() => {
      if (habitsCheck.length !== 0) {
        return allHabitsChecked ? checkColor : normalColor
      }

      if (!habitMainColors.includes(checkColor) && !habitMainColors.includes(normalColor)) {
        return expirationColor
      }

      return normalColor
    })
  }, [allHabitsChecked, habitsCheck, habitMainColors])

  //**---- handle send browser notification ----**//

  useEffect(() => {
    convertedClockState.current = convertTime12To24(clockState)

    const unCheckedHabitsOfToday = habitList.filter(
      (habit: Habit) =>
        habit.reminderDays.includes(now.getDay()) && !habitsCheck.includes(habit._id ?? ''),
    )
    unCheckedHabitsOfToday.forEach((habit: Habit) => {
      if ((habit.reminderTime as string).localeCompare(convertedClockState.current) === 0) {
        sendBrowserNotif('Habit Tracker', "It's time you did this habit: " + habit.title, aibLogo)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockState, habitsCheck, habitList])

  //**---- utility ----**//

  const isHabitCheckedToday = (habit: Habit) => {
    return habit.performances?.find(
      (perf: Performance) => perf.time === today && perf.isChecked === true,
    )
  }

  return (
    <>
      <div className="habits-view">
        <Checkbox
          color="primary"
          className={clsx(
            'all_done-checkbox',
            windowWidth <= 480 && 'lower-1',
            sidebarOpen && windowWidth <= 480 && 'lower-2',
          )}
          checked={allHabitsChecked}
          style={allDoneColor}>
          <span>All done</span>
        </Checkbox>

        <ul
          className="habits-list"
          ref={habitListRef as LegacyRef<HTMLUListElement>}
          style={habitListStyle}>
          {habitList.length !== 0 ? (
            habitList.map((habit: Habit, index: number) => (
              <div key={index}>
                <Checkbox
                  disabled={isChecking}
                  color="success"
                  className="check-habit-box"
                  title="Click to check this habit"
                  checked={habitsCheck.includes(habit._id ?? '')}
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

                  <div className="habit-time">
                    {convertTime24To12(habit.reminderTime as string)}
                  </div>

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
              <p>No habits found! Click</p>
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
