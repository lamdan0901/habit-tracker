import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, cssTransition } from 'react-toastify'
import { Loading } from '@nextui-org/react'

import HabitList from 'components/HabitList/HabitList'
import MainLayout from 'layouts/MainLayout'
import HabitModel from 'components/HabitModel/HabitModel'
import * as actions from 'actions/habitsActions'

import 'react-toastify/dist/ReactToastify.css'
import './animate.min.css'
import './Home.scss'

export default function Home(props) {
  document.title = 'Home - Habit Tracker'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  let deletedHabit

  const [renderHomePage, setRenderHomePage] = useState(false)

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  useEffect(() => {
    dispatch(actions.getAllHabits()).then(() => {
      setRenderHomePage(true)
    })
  }, [dispatch])

  function handleAddHabit(habit, msg) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.postHabit(habit))
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        }),
    )
    displayNotif(msg === undefined ? 'New habit is added' : msg, notify)
  }

  function handleEditHabit(habit) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.putHabit(habit))
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        }),
    )
    displayNotif('Habit is saved', notify)
  }

  function handleDeleteHabit(habit) {
    deletedHabit = habit
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.deleteHabit(habit.id))
        .then(() => {
          resolve()
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

  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let sayHi = 'Good morning'
  if (currentHour >= 12) {
    if (currentHour < 18) sayHi = 'Good afternoon'
    else sayHi = 'Good evening'
  }

  //store state for when is searching and when is not
  const [isSearching, setIsSearching] = useState(false)
  const [searchedHabits, setSearchedHabits] = useState(habits)

  function handleSetSearchedHabits(habits) {
    setSearchedHabits(habits)
  }

  return (
    <>
      <MainLayout
        habits={habits}
        handleSetSearchedHabits={handleSetSearchedHabits}
        setIsSearching={setIsSearching}
        clockState={props.clockState}
        sidebarOpened={props.sidebarOpened}
        setSidebarOpened={props.setSidebarOpened}>
        {renderHomePage ? (
          <div className="home">
            <div className="header">
              <span>
                <h3>{today}</h3>
                <h2>{sayHi}, username!</h2>
              </span>
              <HabitModel onAddHabit={handleAddHabit} />
            </div>

            <HabitList
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              habits={isSearching ? searchedHabits : habits}
              isSearching={isSearching}
            />
          </div>
        ) : (
          <Loading size="xlarge" color="warning" textColor="warning" className="loading-animation">
            Loading...
          </Loading>
        )}
      </MainLayout>
    </>
  )
}
