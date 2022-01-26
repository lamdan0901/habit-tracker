import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSidebar } from 'contexts/SidebarProvider'

import { BsFillHouseDoorFill } from 'react-icons/bs'
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillPieChart } from 'react-icons/ai'
import { GiNightSleep } from 'react-icons/gi'
import { BiSearch } from 'react-icons/bi'

import aibLogo from '../../assets/img/aib-logo.png'
import './Searchbox.scss'
import './Sidebar.scss'

export default function Sidebar(props) {
  const [sidebarOpen, toggleSidebar] = useSidebar()
  const [searchText, setSearchText] = useState({ text: '', timeOut: 0 })

  function handleTextChange(e) {
    const searchBoxText = e.target.value

    if (searchBoxText) {
      //The clearTimeout(timeoutVariable) method stops the execution of the function specified in setTimeout() and setInterval()
      if (searchText.timeOut) clearTimeout(searchText.timeOut)

      let habitsFiltered = props.habits.filter((habit) =>
        habit.name.toLowerCase().includes(searchBoxText.toLowerCase()),
      )

      setSearchText({
        text: searchBoxText,
        timeout: setTimeout(function () {
          props.setIsSearching(true)
          props.onSetSearchedHabits(habitsFiltered)
        }, 200),
      })
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
          onChange={handleTextChange}
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
