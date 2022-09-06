import './Sidebar.scss'

import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import { BiSearch } from 'react-icons/bi'
import { BsFillHouseDoorFill } from 'react-icons/bs'
import { GiNightSleep } from 'react-icons/gi'
import { NavLink } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'

import aibLogo from '../../assets/img/aib-logo.jpg'
import { useUtilities } from '../../contexts/UtilitiesProvider'
import { Habit } from '../../reducers/habitSlice'

interface SidebarProps {
  habits: Habit[]
  setIsSearching(isSearching: boolean): void
  onSetSearchHabits(habits: Habit[]): void
}

const navLinkItems = [
  {
    to: '/',
    icon: <BsFillHouseDoorFill />,
    text: 'Home',
  },
  {
    to: '/sleep-calculator',
    icon: <GiNightSleep />,
    text: 'Sleep Time',
  },
  // {
  //   to: '/statistics',
  //   icon: <AiFillPieChart />,
  //   text: 'Statistics',
  // },
]

export default function Sidebar({ habits, setIsSearching, onSetSearchHabits }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUtilities()
  const debounced = useDebouncedCallback(handleTextChange, 500)

  function handleTextChange(searchTextBox: string) {
    if (searchTextBox) {
      let filteredHabits = habits.filter((habit: Habit) =>
        habit.title.toLowerCase().includes(searchTextBox.toLowerCase()),
      )
      setIsSearching(true)
      onSetSearchHabits(filteredHabits)
    } else setIsSearching(false)
  }

  return (
    <div className={sidebarOpen ? 'menu' : 'menu minimized'}>
      <img src={aibLogo} alt="aib-logo" className="aib-logo" />

      <div className="sidebar-top">
        <div></div>
        <span className="show-sidebar-btn" onClick={() => toggleSidebar()}>
          {sidebarOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </span>
      </div>

      <form className="search-box">
        <button
          className="trigger-search-btn"
          onClick={(e) => {
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

      {navLinkItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) => (isActive ? 'menu-item item-active' : 'menu-item')}>
          {item.icon}
          <span className="menu-text">{item.text}</span>
        </NavLink>
      ))}
    </div>
  )
}
