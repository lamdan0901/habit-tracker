import { NavLink } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { useSidebar } from '../../contexts/SidebarProvider'

import { BsFillHouseDoorFill } from 'react-icons/bs'
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillPieChart } from 'react-icons/ai'
import { GiNightSleep } from 'react-icons/gi'
import { BiSearch } from 'react-icons/bi'

import aibLogo from '../../assets/img/aib-logo.jpg'
import './Searchbox.scss'
import './Sidebar.scss'

interface IHabit {
  id?: number
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
  performances?: { time: string; isChecked: boolean }[]
  createdAt?: Date
}

type SidebarProps = {
  habits: IHabit[]
  setIsSearching: (isSearching: boolean) => void
  onSetSearchHabits: (searchHabits: IHabit[]) => void
}

export default function Sidebar(props: SidebarProps) {
  const [sidebarOpen, toggleSidebar]: any = useSidebar()
  const debounced = useDebouncedCallback(handleTextChange, 500)

  function handleTextChange(searchTextBox: string) {
    if (searchTextBox) {
      let filteredHabits = props.habits.filter((habit: IHabit) =>
        habit.title.toLowerCase().includes(searchTextBox.toLowerCase()),
      )
      props.setIsSearching(true)
      props.onSetSearchHabits(filteredHabits)
    } else props.setIsSearching(false)
  }

  return (
    <div className={sidebarOpen ? 'menu' : 'menu minimized'}>
      <img src={aibLogo} alt="aib-logo" className="aib-logo" />

      <div className="sidebar-top">
        <div></div>
        <span className="show-sidebar-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </span>
      </div>

      <form className="search-box">
        <button
          className="trigger-search-btn"
          onClick={(e: any) => {
            e.stopPropagation()
            e.preventDefault()
            toggleSidebar()
          }}>
          <BiSearch />
        </button>

        <input
          id="search"
          type="search"
          onChange={(e) => debounced(e.target.value)}
          placeholder={sidebarOpen ? 'Search...' : ' '}
        />
      </form>

      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'menu-item item-active' : 'menu-item')}>
        <BsFillHouseDoorFill />
        <span className="menu-text">Home</span>
      </NavLink>

      <NavLink
        to="/sleep-calculator"
        className={({ isActive }) => (isActive ? 'menu-item item-active' : 'menu-item')}>
        <GiNightSleep />
        <span className="menu-text">Sleep Calculator</span>
      </NavLink>

      <NavLink
        to="/statistics"
        className={({ isActive }) => (isActive ? 'menu-item item-active' : 'menu-item')}>
        <AiFillPieChart />
        <span className="menu-text">Statistics</span>
      </NavLink>
    </div>
  )
}
