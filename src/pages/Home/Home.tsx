import { useEffect, useState } from 'react'
import { toast, cssTransition } from 'react-toastify'
import { Loading } from '@nextui-org/react'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'

import MainLayout from '../../layouts/MainLayout'
import HabitList from '../../components/HabitList/HabitList'
import HabitModal from '../../components/HabitModal/HabitModal'
import * as actions from '../../actions/habitsActions'

import 'react-toastify/dist/ReactToastify.css'
import './animate.min.css'
import './Home.scss'

type TPerformance = { id: number; time: string; isChecked: boolean; habitId: number }

interface IHabit {
  id: number
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
  performances: TPerformance[]
  createdAt?: Date
}

interface IDeletedHabit {
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
}

export default function Home() {
  document.title = 'Home - Habit App'

  let today = new Date().toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const fullName = localStorage.getItem('fullName')

  const currentHour = parseInt(new Date().toString().slice(16, 18))
  let greetingText = 'Good morning, '
  if (currentHour >= 12) {
    if (currentHour < 18) greetingText = 'Good afternoon, '
    else greetingText = 'Good evening, '
  }
  greetingText += fullName !== null ? fullName + '!' : 'user!'

  const [loadingState, setLoadingState] = useState('pending')

  const dispatch = useAppDispatch()
  const habits: IHabit[] = useAppSelector((state) => state.habits)

  const [isSearching, setIsSearching] = useState(false)
  const [searchHabits, setSearchHabits] = useState(habits)

  const [displayAllHabits, setDisplayAllHabits] = useState(false)
  const [habitList, setHabitList] = useState(habits)
  let deletedHabit: IDeletedHabit

  function handleChangeHabitListDisplay() {
    if (!displayAllHabits) {
      setHabitList(habits)
    } else {
      const todayHabitList = setTodayHabitList(habits)
      setHabitList(todayHabitList)
    }
  }

  useEffect(() => {
    dispatchHabits('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function setTodayHabitList(habits: IHabit[]) {
    let todayHabitList: IHabit[] = []
    const thisDay = new Date().getDay()

    habits.forEach((habit: IHabit) => {
      if (habit.reminderDays.includes(thisDay)) {
        todayHabitList.push(habit)
      }
    })
    return todayHabitList
  }

  function handleSetSearchHabits(searchHabits: IHabit[]) {
    setSearchHabits(searchHabits)
  }

  function dispatchHabits(commandText: string) {
    dispatch(actions.getAllHabits())
      // @ts-ignore
      .then((res: IHabit[]) => {
        if (commandText === 'display all') {
          setHabitList(res)
        } else {
          const todayHabitList = setTodayHabitList(res)
          setHabitList(todayHabitList)
        }
        setLoadingState('resolved')
      })
      .catch((err: any) => {
        setLoadingState('rejected')
        console.error(err)
      })
  }

  function handleAddHabit(habit: IHabit | IDeletedHabit, msg: string) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(actions.postHabit(habit))
        // @ts-ignore
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits('')
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err: any) => {
          reject()
          console.error(err)
        }),
    )
    displayNotif(msg ? msg : 'Habit is saved', notify, '')
  }

  function handleEditHabit(id: number, habit: IHabit) {
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(actions.putHabit(id, habit))
        // @ts-ignore
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits('')
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err: any) => {
          reject()
          console.error(err)
        }),
    )

    displayNotif('Habit is saved', notify, '')
  }

  function handleDeleteHabit(habit: IHabit) {
    deletedHabit = habit
    const notify = new Promise<void>((resolve, reject) =>
      dispatch(actions.deleteHabit(habit.id as number))
        // @ts-ignore
        .then(() => {
          resolve()
          if (!displayAllHabits) {
            dispatchHabits('')
          } else {
            dispatchHabits('display all')
          }
        })
        .catch((err: any) => {
          reject()
          console.error(err)
        }),
    )
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
              <h2>{greetingText}</h2>
            </span>

            <button
              className={habits.length !== 0 ? 'btn show-all-btn' : 'btn show-all-btn disabled'}
              onClick={() => {
                setDisplayAllHabits(!displayAllHabits)
                handleChangeHabitListDisplay()
              }}>
              {!displayAllHabits ? 'All habits' : "Today's habits"}
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
