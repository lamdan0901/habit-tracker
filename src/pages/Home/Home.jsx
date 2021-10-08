import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import HabitList from 'components/HabitList/HabitList'
import MainLayout from 'layouts/MainLayout'
import * as actions from 'actions/habitsActions'

import './Home.scss'
import AddHabit from 'components/Add Habit/AddHabit'

export default function Home() {
  document.title = 'Home - Habit Tracker'

  let today = new Date(Date.now()).toDateString()
  today = today.slice(0, 3) + ', ' + today.slice(3)

  const [isBlur, setIsBlur] = useState(false)

  function setBlurBg(value) {
    setIsBlur(value)
  }

  const dispatch = useDispatch()
  const habits = useSelector((state) => state.habits)

  function handleAddHabit(value) {
    dispatch(actions.postHabit(value))
    // console.log(value)
  }

  useEffect(() => {
    dispatch(actions.getAllHabits())
  }, [dispatch])

  return (
    <MainLayout isBlur={isBlur}>
      <div className="home">
        <div className="header">
          <span>
            <h3>Welcome + user name!</h3>
            <h2>{today}</h2>
          </span>
          <AddHabit setBlurBg={setBlurBg} addHabit={handleAddHabit} />
        </div>
        <HabitList habits={habits} />
      </div>
    </MainLayout>
  )
}
