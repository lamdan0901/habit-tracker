import './Home.scss'

import { Loading } from '@nextui-org/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import HabitList from '../../components/HabitList/HabitList'
import HabitModal from '../../components/HabitModal/HabitModal'
import { useAuth } from '../../contexts/AuthProvider'
import { useUtilities } from '../../contexts/UtilitiesProvider'
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
import Pagination from '../../components/Pagination/Pagination'

export default function Home() {
  document.title = 'Home - Habit App'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const dispatch = useAppDispatch()
  const { username } = useAuth()
  const { sidebarOpen, windowWidth } = useUtilities()

  const [currentPage, setCurrentPage] = useState(1)
  const [loadingState, setLoadingState] = useState('idle')
  const [searchText, setSearchText] = useState('')

  const { data: habits, numOfPages } = useAppSelector((state) => state.habits.value)
  const [habitList, setHabitList] = useState(habits)

  const [showTodaysHabits, setShowTodaysHabits] = useState(false)

  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning, '
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon, '
    else greetingText = 'Good evening, '
  }
  greetingText += username + '!'

  useEffect(() => {
    dispatchHabits({ search: searchText, page: currentPage, viewTodayHabits: showTodaysHabits })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchText])

  function handleChangeHabitListDisplay() {
    dispatchHabits({ search: searchText, page: 1, viewTodayHabits: !showTodaysHabits })
    setCurrentPage(1)
    setShowTodaysHabits(!showTodaysHabits)
  }

  function handleSearchTextChange(text: string) {
    setSearchText(text)
  }

  function dispatchHabits(params?: GetHabitsParams) {
    if (!params) {
      params = { search: searchText, page: currentPage, viewTodayHabits: showTodaysHabits }
    }

    dispatch(getHabits(params))
      .then((actionResult) => {
        // @ts-ignore
        const habits = actionResult.payload.data
        setHabitList(habits)
        setLoadingState('resolved')
      })
      .catch((err: any) => {
        setLoadingState('rejected')
        console.error(err.message)
      })
  }

  function handleAddHabit(habit: Habit | DeletedHabit) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(createHabit(habit))
        .unwrap()
        .then(() => {
          console.log('here')
          dispatchHabits()
          resolve()
        })
        .catch((err: any) => {
          console.error('err', err)
          reject()
        }),
    )

    displayNotif('Add ', notify)
  }

  function handleEditHabit(id: string, habit: Habit) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(updateHabit({ id, habit }))
        .then(() => {
          resolve()
          dispatchHabits()
        })
        .catch((err: any) => {
          reject()
          console.error(err.status)
        }),
    )
    displayNotif('Update ', notify)
  }

  function handleDeleteHabit(habit: Habit) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(deleteHabit(habit._id ?? ''))
        .then(() => {
          resolve()
          dispatchHabits()
        })
        .catch((err: any) => {
          reject()
          console.error(err.message)
        }),
    )

    displayNotif('Delete ', notify)
  }

  function displayNotif(msg: string, notify: Promise<void>) {
    toast.promise(notify, {
      pending: 'Working on it...',
      success: {
        render() {
          return msg + 'habit successfully!'
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
    <MainLayout habits={habitList} onSearchTextChange={handleSearchTextChange}>
      {loadingState === 'resolved' ? (
        <div>
          <div className={clsx('header', sidebarOpen && windowWidth <= 480 && 'bigger-header')}>
            <span>
              <h3>{today}</h3>
              <h2>{greetingText}</h2>
            </span>

            <button
              className={clsx('btn show-all-btn', sidebarOpen && windowWidth <= 480 && 'left-zero')}
              onClick={handleChangeHabitListDisplay}>
              {showTodaysHabits ? 'Show all habits' : "Show today's habits"}
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
            habitList={habitList}
            onGetHabits={dispatchHabits}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={numOfPages}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
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
