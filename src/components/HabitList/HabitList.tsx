import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  MutableRefObject,
  LegacyRef,
} from 'react'
import Modal from 'react-modal'
import { BsTrash } from 'react-icons/bs'
import { Checkbox } from '@nextui-org/react'

import HabitModal from '../../components/HabitModal/HabitModal'
import { useClockState } from '../../contexts/UtilitiesProvider'
import axiosClient from '../../utils/axiosClient'
import { sendBrowserNotif } from '../../utils/sendBrowserNotif'
import { TPerformance } from '../HabitModal/HabitModal'
import { IHabit } from '../HabitModal/HabitModal'

import * as habitColor from '../../constants/habitColors'
import aibLogo from '../../assets/img/aib-logo.jpg'
import './HabitList.scss'

type THabitMainColor = { backgroundColor: string; color: string }
// type TPerformance = { id: number; time: string; isChecked: boolean; habitId: number }

// interface IHabit {
//   id: number
//   title: string
//   description: string
//   reminderTime: Date | string
//   reminderDays: number[]
//   performances: TPerformance[]
//   createdAt?: Date
//   checked?: boolean
// }

interface IHabitListProps {
  habitList: IHabit[]
  onGetHabits(commandText: string): void
  onEditHabit(id: number, habit: IHabit): void
  onDeleteHabit(habit: IHabit): void
}

export default function HabitList(props: IHabitListProps) {
  const [habitModalOpened, setHabitModalOpened] = useState(false)
  const [confirmDialogOpened, setConfirmDialogOpened] = useState(false)

  const [currentHabit, setCurrentHabit] = useState<IHabit>()
  const [tempHabit, setTempHabit] = useState<IHabit>() //habit that is saved before being deleted
  const now = new Date()
  const today = now.toISOString().slice(0, 10)

  function handleChooseHabit(habit: IHabit) {
    setCurrentHabit(habit)
    setHabitModalOpened(true)
  }

  function handleDeleteHabit() {
    props.onDeleteHabit(tempHabit as IHabit)
  }

  function handleOpenDialog(habit: IHabit) {
    setTempHabit(habit)
    setConfirmDialogOpened(true)
  }

  function handleCloseConfirmDialog() {
    setConfirmDialogOpened(false)
  }

  function handleCloseHabitModal() {
    setHabitModalOpened(false)
  }

  //**---- handle sort habits by habit.reminderTime ----**/
  // we can give more options to sort by name, by being checked or not later
  let sortedHabitList = useRef(props.habitList)

  useEffect(() => {
    sortedHabitList.current = props.habitList
    sortedHabitList.current.sort((habit1: IHabit, habit2: IHabit) => {
      return habit1.reminderTime > habit2.reminderTime
        ? 1
        : habit2.reminderTime > habit1.reminderTime
        ? -1
        : 0
    })
  }, [props.habitList])

  //**---- handle update habit checkboxes and habit check----**//

  const habitIds = props.habitList.map((habit: IHabit) => habit.id)
  const [habitsCheck, setHabitsCheck] = useState<number[]>([])
  const [allHabitsCheck, setAllHabitsCheck] = useState(false)

  const updateHabitCheckBoxes = useCallback(() => {
    let habitCheckList: number[] = []

    sortedHabitList.current.forEach((habit: IHabit) => {
      const habitPerformances = habit.performances as TPerformance[]

      for (let i = 0; i < habitPerformances.length; i++) {
        if (habitPerformances[i].time === today && habitPerformances[i].isChecked === true) {
          habitCheckList.push(habit.id as number)
          break
        }
      }
    })

    setAllHabitsCheck(() =>
      habitCheckList.length === props.habitList.length && props.habitList.length !== 0
        ? true
        : false,
    )

    return habitCheckList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedHabitList])

  useEffect(() => {
    setHabitsCheck(updateHabitCheckBoxes)
  }, [updateHabitCheckBoxes])

  async function handleCheckHabit(habit: IHabit) {
    if (habit.performances === undefined || habit.id === undefined) {
      return
    }

    let inspectId
    const habitPerformance = habit.performances.find((perf: TPerformance) => perf.time === today)

    if (habit.performances.length !== 0 && habitPerformance !== undefined) {
      //* in case habitPerformance is not found, it will be undefined
      inspectId = habitPerformance.id
    }

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
      props.onGetHabits('')
    } else {
      if (
        habit.performances.length !== 0 &&
        habit.performances.find((perf: TPerformance) => perf.time === today)
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
      props.onGetHabits('')
    }
  }

  //**---- handle change 'gridTemplateColumns' of the habits list according to its width ----**//

  const habitListRef = useRef<HTMLUListElement>()
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
    resizeObserver.observe((habitListRef as MutableRefObject<HTMLUListElement>).current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [habitListRef])

  //**---- handle display habit color according to clockState and habitTime ----**//

  const clockState: string = useClockState()
  const [habitMainColors, setHabitMainColors] = useState<THabitMainColor[]>([])

  useEffect(() => {
    const currentColorsList: THabitMainColor[] = []

    sortedHabitList.current.forEach((habit: IHabit) => {
      if (
        !habit.performances?.find(
          (perf: TPerformance) => perf.time === today && perf.isChecked === true,
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

  //**---- handle change all done checkbox color ----**//

  const [allDoneColor, setAllDoneColor] = useState<THabitMainColor>()

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
    const currentHabitsList = props.habitList.filter((habit: IHabit) =>
      habit.reminderDays.includes(now.getDay()),
    )

    currentHabitsList.forEach((habit: IHabit) => {
      if (!habit.checked) {
        const formattedHabitTime = formatHabitTime(habit.reminderTime as string)
        if (formattedHabitTime.localeCompare(clockState) === 0) {
          sendBrowserNotif('Habit Tracker', "It's time you did this habit: " + habit.title, aibLogo)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockState, props.habitList])

  return (
    <>
      {habitModalOpened && (
        <HabitModal
          isEditMode={true}
          isEditModalOpened={habitModalOpened}
          habit={currentHabit as IHabit}
          habitList={props.habitList}
          onEditHabit={props.onEditHabit}
          onAddHabit={() => {}}
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

        <ul
          className="habits-list"
          ref={habitListRef as LegacyRef<HTMLUListElement>}
          style={habitListStyle}>
          {sortedHabitList.current.length !== 0 ? (
            props.habitList.map((habit: IHabit, index: number) => (
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