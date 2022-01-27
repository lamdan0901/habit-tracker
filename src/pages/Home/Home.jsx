import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, cssTransition } from 'react-toastify'
import { Loading } from '@nextui-org/react'

import HabitList from 'components/HabitList/HabitList'
import MainLayout from 'layouts/MainLayout'
import HabitModal from 'components/HabitModal/HabitModal'
import * as actions from 'actions/habitsActions'

import 'react-toastify/dist/ReactToastify.css'
import './animate.min.css'
import './Home.scss'

export default function Home() {
  document.title = 'Home - Habit Tracker'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning'
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon'
    else greetingText = 'Good evening'
  }

  let deletedHabit
  const [renderHomePage, setRenderHomePage] = useState(false)

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  const [isSearching, setIsSearching] = useState(false)
  const [searchedHabits, setSearchedHabits] = useState(habits)

  const [displayAllHabits, setDisplayAllHabits] = useState(false)
  const [habitsList, setHabitsList] = useState(habits)

  function handleChangeHabitsListDisplay() {
    if (!displayAllHabits) {
      setHabitsList(habits)
    } else {
      const todayHabitsList = setTodayHabitsList(habits)
      setHabitsList(todayHabitsList)
    }
  }

  useEffect(() => {
    dispatchHabits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  function setTodayHabitsList(habits) {
    let todayHabitsList = []
    habits.forEach((habit) => {
      if (habit.daysChecked.includes(today.slice(0, 3))) {
        todayHabitsList.push(habit)
      }
    })
    return todayHabitsList
  }

  function dispatchHabits(commandText) {
    dispatch(actions.getAllHabits()).then((res) => {
      if (commandText === 'display all') {
        setHabitsList(res)
      } else {
        const todayHabitsList = setTodayHabitsList(res)
        setHabitsList(todayHabitsList)
      }
      setRenderHomePage(true)
    })
  }

  function handleAddHabit(habit, msg) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.postHabit(habit))
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits()
          } else {
            dispatchHabits('display all')
          }
        })
        .catch(() => {
          reject()
        }),
    )
    displayNotif(!msg ? 'New habit is added' : msg, notify)
  }

  function handleEditHabit(habit, msg) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.putHabit(habit))
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits()
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((error) => {
          reject(error)
        }),
    )

    if (msg === 'no notification') return
    displayNotif('Habit is saved', notify)
  }

  function handleDeleteHabit(habit) {
    deletedHabit = habit
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.deleteHabit(habit.id))
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits()
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((error) => {
          reject(error)
        }),
    )
    displayNotif('Habit is deleted', notify, '')
  }

  function displayNotif(msg, notify, deleteAction) {
    toast.promise(notify, {
      pending: 'Working on it...',
      success: {
        render() {
          return (
            <div>
              <span>{msg}</span>
              {deleteAction !== undefined && (
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
        transition: bounce,
      },

      error: {
        render() {
          return 'An error has occurred!'
        },
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
        transition: bounce,
      },
    })
  }

  const bounce = cssTransition({
    enter: 'animate__animated animate__fadeIn',
    exit: 'animate__animated animate__fadeOut',
  })

  return (
    <MainLayout
      habits={habitsList}
      setIsSearching={setIsSearching}
      onSetSearchedHabits={(habits) => {
        setSearchedHabits(habits)
      }}>
      {renderHomePage ? (
        <div>
          <div className="header">
            <span>
              <h3>{today}</h3>
              <h2>{greetingText}, Edward!</h2>
            </span>

            <button
              className="btn show-all-btn"
              onClick={() => {
                setDisplayAllHabits(!displayAllHabits)
                handleChangeHabitsListDisplay()
              }}>
              {!displayAllHabits ? 'All habits' : "Today's habits"}
            </button>

            <HabitModal onAddHabit={handleAddHabit} habitsList={habits} />
          </div>

          <HabitList
            habitsList={isSearching ? searchedHabits : habitsList}
            isSearching={isSearching}
            displayAllHabits={displayAllHabits}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        </div>
      ) : (
        <Loading size="xlarge" color="warning" textColor="warning" className="loading-animation">
          Loading...
        </Loading>
      )}
    </MainLayout>
  )
}
