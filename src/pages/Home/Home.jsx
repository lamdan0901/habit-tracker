import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast, cssTransition } from 'react-toastify'
import { Loading } from '@nextui-org/react'

import MainLayout from 'layouts/MainLayout'
import HabitList from 'components/HabitList/HabitList'
import HabitModal from 'components/HabitModal/HabitModal'
import * as actions from 'actions/habitsActions'

import 'react-toastify/dist/ReactToastify.css'
import './animate.min.css'
import './Home.scss'

export default function Home() {
  document.title = 'Home - Habit App'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning'
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon'
    else greetingText = 'Good evening'
  }

  const [loadingState, setLoadingState] = useState('pending')

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  const [isSearching, setIsSearching] = useState(false)
  const [searchHabits, setSearchHabits] = useState(habits)

  const [displayAllHabits, setDisplayAllHabits] = useState(false)
  const [habitList, setHabitList] = useState(habits)
  let deletedHabit

  function handleChangeHabitListDisplay() {
    if (!displayAllHabits) {
      setHabitList(habits)
    } else {
      const todayHabitList = setTodayHabitList(habits)
      setHabitList(todayHabitList)
    }
  }

  useEffect(() => {
    dispatchHabits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setTodayHabitList(habits) {
    let todayHabitList = []
    const thisDay = new Date().getDay()
    habits.forEach((habit) => {
      if (habit.reminderDays.includes(thisDay)) {
        todayHabitList.push(habit)
      }
    })
    return todayHabitList
  }

  function handleSetSearchHabits(searchHabits) {
    setSearchHabits(searchHabits)
  }

  function dispatchHabits(commandText) {
    dispatch(actions.getAllHabits())
      .then((res) => {
        if (commandText === 'display all') {
          setHabitList(res)
        } else {
          const todayHabitList = setTodayHabitList(res)
          setHabitList(todayHabitList)
        }
        setLoadingState('resolved')
      })
      .catch((err) => {
        setLoadingState('rejected')
        console.error(err)

        // if (err.status === 401) {
        //   getToken()
        // }
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
        .catch((err) => {
          reject()
          console.error(err)
        }),
    )
    displayNotif(!msg ? 'New habit is added' : msg, notify)
  }

  function handleEditHabit(id, habit) {
    const notify = new Promise((resolve, reject) =>
      dispatch(actions.putHabit(id, habit))
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits()
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err) => {
          reject()
          console.error(err)
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
          if (!displayAllHabits) {
            dispatchHabits()
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err) => {
          reject()
          console.error(err)
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
      habits={habitList}
      setIsSearching={setIsSearching}
      onSetSearchHabits={handleSetSearchHabits}>
      {loadingState === 'resolved' ? (
        <div>
          <div className="header">
            <span>
              <h3>{today}</h3>
              <h2>{greetingText}, Edward!</h2>
            </span>

            <button
              className={habits.length !== 0 ? 'btn show-all-btn' : 'btn show-all-btn disabled'}
              onClick={() => {
                setDisplayAllHabits(!displayAllHabits)
                handleChangeHabitListDisplay()
              }}>
              {!displayAllHabits ? 'All habits' : "Today's habits"}
            </button>

            <HabitModal onAddHabit={handleAddHabit} habitList={habits} />
          </div>

          <HabitList
            habitList={isSearching ? searchHabits : habitList}
            isSearching={isSearching}
            displayAllHabits={displayAllHabits}
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
