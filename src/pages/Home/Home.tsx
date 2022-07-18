import './Home.scss'

import { Loading } from '@nextui-org/react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import HabitList from '../../components/HabitList/HabitList'
import HabitModal from '../../components/HabitModal/HabitModal'
import { useAuth } from '../../contexts/AuthProvider'
import MainLayout from '../../layouts/MainLayout'
import {
  createHabit,
  DeletedHabit,
  deleteHabit,
  getHabits,
  Habit,
  updateHabit,
} from '../../reducers/habitSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'

export default function Home() {
  document.title = 'Home - Habit App'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const dispatch = useAppDispatch()
  const { username }: any = useAuth()

  const [loadingState, setLoadingState] = useState('idle')
  const [isSearching, setIsSearching] = useState(false)

  const habits: Habit[] = useAppSelector((state) => state.habits.value)
  const [habitList, setHabitList] = useState(habits)
  const [searchHabits, setSearchHabits] = useState(habits)
  let deletedHabit: DeletedHabit

  const [shouldDisplayAllHabits, setShouldDisplayAllHabits] = useState(false)

  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning, '
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon, '
    else greetingText = 'Good evening, '
  }
  greetingText += username + '!'

  useEffect(() => {
    dispatchHabits('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChangeHabitListDisplay() {
    if (!shouldDisplayAllHabits) {
      setHabitList(habits)
    } else {
      const habitsOfToday = setHabitsOfToday(habits)
      setHabitList(habitsOfToday)
    }
  }

  function setHabitsOfToday(habits: Habit[]) {
    let habitsOfToday: Habit[] = []
    const today = new Date().getDay()

    habits.forEach((habit: Habit) => {
      if (habit.reminderDays.includes(today)) {
        habitsOfToday.push(habit)
      }
    })
    return habitsOfToday
  }

  function dispatchHabits(commandText: string) {
    dispatch(getHabits())
      .then((actionResult) => {
        const habits = unwrapResult(actionResult)
        if (commandText === 'display all') {
          setHabitList(habits)
        } else {
          const todayHabitList = setHabitsOfToday(habits)
          setHabitList(todayHabitList)
        }
        setShouldDisplayAllHabits(false)
        setLoadingState('resolved')
      })
      .catch((err: any) => {
        setLoadingState('rejected')
        console.error(err.message)
      })
  }

  function handleAddHabit(habit: Habit | DeletedHabit, msg: string) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(createHabit(habit))
        .then(() => {
          resolve()
          if (!shouldDisplayAllHabits) {
            dispatchHabits('')
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err: any) => {
          reject()
          console.error(err.message)
        }),
    )
    displayNotif(msg ? msg : 'Habit is saved', notify, '')
  }

  function handleEditHabit(id: number, habit: Habit) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(updateHabit({ id, habit }))
        .then(() => {
          resolve()
          if (!shouldDisplayAllHabits) {
            dispatchHabits('')
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err: any) => {
          reject()
          console.error(err.message)
        }),
    )
    displayNotif('Habit is saved', notify, '')
  }

  function handleDeleteHabit(habit: Habit) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(deleteHabit(habit.id as number))
        .then(() => {
          resolve()
          if (!shouldDisplayAllHabits) {
            dispatchHabits('')
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err: any) => {
          reject()
          console.error(err.message)
        }),
    )

    deletedHabit = {
      title: habit.title,
      description: habit.description,
      reminderTime: habit.reminderTime,
      reminderDays: habit.reminderDays,
    }
    displayNotif('Habit is deleted', notify, 'can undo delete')
  }

  function displayNotif(msg: string, notify: Promise<void>, deleteAction: string) {
    toast.promise(notify, {
      pending: 'Working on it...',
      success: {
        render() {
          return (
            <div>
              <span>{msg}</span>
              {deleteAction === 'can undo delete' && (
                <button
                  className="btn undo_delete-btn"
                  onClick={() => {
                    handleAddHabit(deletedHabit, 'Undo delete successfully!')
                  }}>
                  UNDO DELETE
                </button>
              )}
            </div>
          )
        },
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
      },
      error: {
        render() {
          return 'An error has occurred!'
        },
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
      },
    })
  }

  return (
    <MainLayout
      habits={habitList}
      setIsSearching={setIsSearching}
      onSetSearchHabits={(habits: Habit[]) => {
        setSearchHabits(habits)
      }}>
      {loadingState === 'resolved' ? (
        <div>
          <div className="header">
            <span>
              <h3>{today}</h3>
              <h2>{greetingText}</h2>
            </span>

            <button
              className={habits.length !== 0 ? 'btn show-all-btn' : 'btn show-all-btn disabled'}
              onClick={() => {
                setShouldDisplayAllHabits(!shouldDisplayAllHabits)
                handleChangeHabitListDisplay()
              }}>
              {!shouldDisplayAllHabits ? 'All habits' : "Today's habits"}
            </button>

            <HabitModal
              isEditMode={false}
              isEditModalOpened={false}
              habit={habits[0]}
              habitList={habits}
              onAddHabit={handleAddHabit}
              onEditHabit={() => {}}
              onCloseModal={() => {}}
            />
          </div>

          <HabitList
            habitList={isSearching ? searchHabits : habitList}
            onGetHabits={dispatchHabits}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        </div>
      ) : loadingState === 'rejected' ? (
        <>
          <h2>Error occurred while fetching data...</h2>
          <p>Please try again later</p>
        </>
      ) : (
        <Loading size="xlarge" color="warning" textColor="warning" className="loading-animation">
          Loading...
        </Loading>
      )}
    </MainLayout>
  )
}
