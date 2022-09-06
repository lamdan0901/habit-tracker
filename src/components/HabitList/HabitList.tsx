import './HabitList.scss'

import { Checkbox } from '@nextui-org/react'
import { LegacyRef, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import Modal from 'react-modal'

import habitsInspectionApi from '../../apis/habitsInspectionApi'
import aibLogo from '../../assets/img/aib-logo.jpg'
import HabitModal from '../../components/HabitModal/HabitModal'
import { checkColor, expirationColor, normalColor } from '../../constants'
import { useUtilities } from '../../contexts/UtilitiesProvider'
import { HabitActions } from '../../pages/Home/Home'
import { Habit, Performance } from '../../reducers/habitSlice'
import { sendBrowserNotif } from '../../utils/utilityFunctions'
import clsx from 'clsx'

type HabitMainColor = { backgroundColor: string; color: string }

interface HabitListProps {
  habitList: Habit[]
  onGetHabits(action?: HabitActions): void
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
  const convertedClockState = useRef('')
  const today = now.toISOString().slice(0, 10)
  const { sidebarOpen, windowWidth } = useUtilities()

  const [isChecking, setIsChecking] = useState(false)
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
  const [allHabitsChecked, setAllHabitsChecked] = useState(false)

  const updateHabitCheckBoxes = useCallback(() => {
    let habitCheckList: number[] = []

    habitList.forEach((habit: Habit) => {
      if (isHabitCheckedToday(habit)) {
        habitCheckList.push(habit.id as number)
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
    if (!habit.performances || !habit.id) {
      return
    }

    let inspectionId
    const todayPerformance = habit.performances.find((perf: Performance) => perf.time === today)

    if (todayPerformance) {
      inspectionId = todayPerformance.id
    }

    setIsChecking(true)

    //* if performances (inspection list) is not created (performances.length==0), we make a POST request
    //* if performances is created (performances.length>0):
    //***  if performances doesn't include today , we make a POST request
    //***  else we update by making a PATCH request

    if (habitsCheck.includes(habit.id) && inspectionId) {
      await habitsInspectionApi.patchInspection(
        {
          time: today,
          isChecked: false,
        },
        inspectionId,
      )

      setHabitsCheck(habitsCheck.filter((checked_ID) => checked_ID !== habit.id))
      setAllHabitsChecked(false)
      setIsChecking(false)
      onGetHabits()
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
          habitId: habit.id,
        })
      }

      habitsCheck.push(habit.id)
      setHabitsCheck([...habitsCheck])
      setAllHabitsChecked(habitsCheck.length === habitIds.length)
      setIsChecking(false)
      onGetHabits()
    }
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
        habit.reminderDays.includes(now.getDay()) && !habitsCheck.includes(habit.id as number),
    )
    unCheckedHabitsOfToday.forEach((habit: Habit) => {
      if ((habit.reminderTime as string).localeCompare(convertedClockState.current) === 0) {
        sendBrowserNotif('Habit Tracker', "It's time you did this habit: " + habit.title, aibLogo)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockState, habitsCheck, habitList])

  //**---- utility functions ----**//

  const isHabitCheckedToday = (habit: Habit) => {
    return habit.performances?.find(
      (perf: Performance) => perf.time === today && perf.isChecked === true,
    )
  }

  function convertTime24To12(time24h: string) {
    const hour = ~~time24h.slice(0, 2)
    const minute = time24h.slice(3, 5)
    const am = ' AM',
      pm = ' PM'

    if (hour === 0) {
      return 12 + ':' + minute + am
    }
    if (hour < 12) {
      if (hour < 10) return '0' + hour + ':' + minute + am
      return hour + ':' + minute + am
    }
    if (hour === 12) {
      return hour + ':' + minute + pm
    }
    if (hour - 12 < 10) return '0' + (hour - 12) + ':' + minute + pm
    return hour - 12 + ':' + minute + pm
  }

  function convertTime12To24(time12h: string) {
    const [time, modifier] = time12h.split(' ')
    let [hours, minutes] = time.split(':')

    if (hours === '12') {
      hours = '00'
    }
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12)
    }

    return `${hours}:${minutes}`
  }

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
            className={clsx(
              'all_done-checkbox',
              windowWidth <= 480 && 'lower-1',
              sidebarOpen && windowWidth <= 480 && 'lower-2',
            )}
            checked={allHabitsChecked}
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
                  disabled={isChecking}
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
