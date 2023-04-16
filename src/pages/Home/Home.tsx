import './Home.scss'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { CircularProgress, Stack } from '@mui/material'

import HabitList from '../../components/HabitList/HabitList'
import HabitModal from '../../components/HabitModal/HabitModal'
import { useAuth } from '../../contexts/AuthProvider'
import { useUtilities } from '../../contexts/UtilitiesProvider'
import MainLayout from '../../layouts/MainLayout'
import { createHabit, deleteHabit, getHabits, updateHabit } from '../../reducers/habitSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Pagination from '../../components/Pagination/Pagination'
import { greetingText } from '../../utils/utilityFunctions'

export default function Home() {
  document.title = 'Home - Habit App'
  const today = new Date().toDateString()

  const dispatch = useAppDispatch()
  const { username } = useAuth()
  const { sidebarOpen, windowWidth } = useUtilities()
  const { data: habits, numOfPages } = useAppSelector((state) => state.habits.value)

  const [currentPage, setCurrentPage] = useState(1)
  const [loadingState, setLoadingState] = useState('idle')
  const [searchText, setSearchText] = useState('')
  const [showTodaysHabits, setShowTodaysHabits] = useState(false)

  useEffect(() => {
    dispatchHabits({ search: searchText, page: currentPage, viewTodayHabits: showTodaysHabits })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchText])

  function handleChangeHabitListDisplay() {
    dispatchHabits({ search: searchText, page: 1, viewTodayHabits: !showTodaysHabits })
    setCurrentPage(1)
    setShowTodaysHabits(!showTodaysHabits)
  }

  function dispatchHabits(params?: GetHabitsParams) {
    if (!params) {
      params = { search: searchText, page: currentPage, viewTodayHabits: showTodaysHabits }
    }

    try {
      dispatch(getHabits(params))
      setLoadingState('resolved')
    } catch (err: any) {
      setLoadingState('rejected')
      console.error(err.message)
    }
  }

  function handleAddHabit(habit: Habit | DeletedHabit) {
    handlePromise(dispatch(createHabit(habit)))
  }

  function handleEditHabit(id: string, habit: Habit) {
    handlePromise(dispatch(updateHabit({ id, habit })))
  }

  function handleDeleteHabit(habit: Habit) {
    handlePromise(dispatch(deleteHabit(habit._id ?? '')))
  }

  function handlePromise(promise: Promise<any>) {
    toast.promise(promise, {
      pending: 'Working on it...',
      success: {
        render() {
          dispatchHabits()
          return 'Successfully!'
        },
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
      },
      error: {
        render() {
          return 'Something went wrong!'
        },
        hideProgressBar: true,
        closeOnClick: true,
        progress: undefined,
      },
    })
  }

  return (
    <MainLayout habits={habits} onSearchTextChange={(text: string) => setSearchText(text)}>
      {loadingState === 'resolved' ? (
        <>
          <div className={clsx('header', sidebarOpen && windowWidth <= 480 && 'bigger-header')}>
            <span>
              <h3>{today}</h3>
              <h2>{greetingText(username)}</h2>
            </span>

            <button
              className={clsx('btn show-all-btn', sidebarOpen && windowWidth <= 480 && 'left-zero')}
              onClick={handleChangeHabitListDisplay}>
              {showTodaysHabits ? 'Show all habits' : "Show today's habits"}
            </button>

            <HabitModal habit={habits[0]} habitList={habits} onAddHabit={handleAddHabit} />
          </div>

          <HabitList
            habitList={habits}
            onGetHabits={dispatchHabits}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={numOfPages}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </>
      ) : loadingState === 'rejected' ? (
        <>
          <h2>Error occurred while fetching data...</h2>
          <p>Please try again later</p>
        </>
      ) : (
        <Stack justifyContent="center" alignItems="center" width="100%" height="100%">
          <CircularProgress sx={{ color: '#ff7235' }} size={60} />
        </Stack>
      )}
    </MainLayout>
  )
}
