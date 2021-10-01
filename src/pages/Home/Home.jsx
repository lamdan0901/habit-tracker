import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import HabitList from 'components/HabitList/HabitList'
import MainLayout from 'layouts/MainLayout'
import * as actions from 'actions/habitsActions'

import './Home.scss'

export default function Home() {
  document.title = 'Home | Habit App'

  let today = new Date(Date.now()).toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  useEffect(() => {
    dispatch(actions.getAllHabits())
  }, [dispatch])

  return (
    <MainLayout>
      <div className="home">
        <h3>Welcome + user name!</h3>
        <h2>{today}</h2>
        <HabitList habits={habits} />
      </div>
    </MainLayout>
  )
}
