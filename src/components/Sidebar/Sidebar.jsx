import { NavLink } from 'react-router-dom'
import { BsFillHouseDoorFill } from 'react-icons/bs'
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillPieChart } from 'react-icons/ai'
import { GiNightSleep } from 'react-icons/gi'
import { BiSearch } from 'react-icons/bi'
import aibLogo from '../../assets/img/aib-logo.png'
import './Sidebar.scss'
import './Searchbox.scss'

export default function SideNav(props) {
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

      <form role="search" className="search-box">
        <input id="search" type="search" placeholder="Search..." required />
        <button
          title="Click to search"
          type="submit"
          onClick={(e) => {
            e.preventDefault()
          }}>
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
