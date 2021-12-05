import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, cssTransition } from 'react-toastify'
import { Loading } from '@nextui-org/react'

import HabitList from 'components/HabitList/HabitList'
import MainLayout from 'layouts/MainLayout'
import AddHabit from 'components/AddHabit/AddHabit'
import * as actions from 'actions/habitsActions'

import 'react-toastify/dist/ReactToastify.css'
import './animate.min.css'
import './Home.scss'

export default function Home(props) {
  document.title = 'Home - Habit Tracker'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  const [renderHomePage, setRenderHomePage] = useState(false)

  useEffect(() => {
    dispatch(actions.getAllHabits()).then(() => {
      setRenderHomePage(true)
    })
  }, [dispatch])

  function handleAddHabit(habit) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.postHabit(habit))
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        }),
    )
    displayNotif('New habit is added', notify)
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

  function handleDeleteHabit(id) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.deleteHabit(id))
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        }),
    )
    displayNotif('Habit is deleted', notify)
  }

  function displayNotif(msg, notify) {
    toast.promise(notify, {
      pending: 'Working on it...',
      success: {
        render() {
          return msg
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
      },
    })
  }

  const bounce = cssTransition({
    enter: 'animate__animated animate__fadeIn',
    exit: 'animate__animated animate__fadeOut',
  })

  let currentTime = parseInt(new Date().toString().slice(16, 18))
  let sayHi = 'Good morning'
  if (currentTime > 12) {
    if (currentTime < 18) sayHi = 'Good afternoon'
    else sayHi = 'Good evening'
  }

  return (
    <>
      <MainLayout sidebarOpened={props.sidebarOpened} setSidebarOpened={props.setSidebarOpened}>
        {renderHomePage ? (
          <div className="home">
            <div className="header">
              <span>
                <h3>{today}</h3>
                <h2>{sayHi}, username!</h2>
              </span>
              <AddHabit onAddHabit={handleAddHabit} />
            </div>
            <HabitList
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              habits={habits}
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
