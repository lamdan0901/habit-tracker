import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import HabitList from 'components/HabitList/HabitList'
import MainLayout from 'layouts/MainLayout'
import AddHabit from 'components/Add Habit/AddHabit'
import * as actions from 'actions/habitsActions'

import './Home.scss'

export default function Home() {
  document.title = 'Home - Habit Tracker'

  let today = new Date(Date.now()).toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  useEffect(() => {
    dispatch(actions.getAllHabits())
  }, [dispatch])

  function handleAddHabit(habit) {
    dispatch(actions.postHabit(habit))
  }

  // function handleEditHabit(habit) {
  //   dispatch(actions.putHabit(habit))
  // }

  // function handleDeleteHabit(habit) {
  //   dispatch(actions.deleteHabit(habit))
  // }

  return (
    <MainLayout>
      <div className="home">
        <div className="header">
          <span>
            <h3>Welcome username!</h3>
            <h2>{today}</h2>
          </span>
          <AddHabit addHabit={handleAddHabit} />
        </div>
        <HabitList habits={habits} />
      </div>
    </MainLayout>
  )
}
