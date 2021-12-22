import { NavLink } from 'react-router-dom'
import { BsFillHouseDoorFill } from 'react-icons/bs'
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillPieChart } from 'react-icons/ai'
import { GiNightSleep } from 'react-icons/gi'
import { BiSearch } from 'react-icons/bi'
import aibLogo from '../../assets/img/aib-logo.png'
import './Searchbox.scss'
import './Sidebar.scss'
import { useState } from 'react'

export default function SideNav(props) {
  const [searchText, setSearchText] = useState('')

  function handleTextChange(e) {
    setSearchText(e.target.value)
  }

  function handleSearchHabit(e) {
    e.preventDefault()

    let habitsFiltered = props.habits.filter((habit) =>
      habit.name.toLowerCase().includes(searchText.toLowerCase()),
    )
    props.handleSetSearchedHabits(habitsFiltered)
    props.setIsSearching(true)
  }

  return (
    <div className={props.sidebarOpened ? 'menu' : 'menu minimized'}>
      <img src={aibLogo} alt="aib-logo" className="aib-logo" />

      <div className="sidebar-top">
        <div></div>
        <span
          className="show-sidebar-btn"
          onClick={() => {
            props.setSidebarOpened(!props.sidebarOpened)
          }}>
          {props.sidebarOpened ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </span>
      </div>

      <form className="search-box">
        <button
          className="trigger-search-btn"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            props.setSidebarOpened(true)
          }}>
          <BiSearch />
        </button>

        <input
          id="search"
          type="search"
          value={searchText}
          onChange={handleTextChange}
          placeholder={props.sidebarOpened ? 'Search...' : ' '}
          required
        />

        <button className="main-search-btn" title="Click to search" onClick={handleSearchHabit}>
          <BiSearch />
        </button>
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
