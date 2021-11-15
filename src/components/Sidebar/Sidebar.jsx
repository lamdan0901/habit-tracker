import { NavLink } from 'react-router-dom'
import { BsFillHouseDoorFill } from 'react-icons/bs'
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillPieChart } from 'react-icons/ai'
import { GiNightSleep } from 'react-icons/gi'
import './Sidebar.scss'

export default function SideNav(props) {
  return (
    <div className={props.sidebarOpened ? 'menu' : 'menu minimized'}>
      <div className="sidebar-top">
        <div></div>
        <span
          className="sidebar-icon"
          onClick={() => {
            props.setSidebarOpened(!props.sidebarOpened)
          }}>
          {props.sidebarOpened ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </span>
      </div>

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
