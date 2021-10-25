import { NavLink } from 'react-router-dom'
import * as Bs from 'react-icons/bs'
import { useState } from 'react'
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiFillPieChart } from 'react-icons/ai'
import './SideNav.scss'

export default function SideNav() {
  const [sidebarOpened, setSidebarOpened] = useState(true)

  return (
    <div className={sidebarOpened ? 'menu' : 'menu minimized'}>
      <div className="sidebar-top">
        <div></div>
        <span
          className="sidebar-icon"
          onClick={() => {
            setSidebarOpened(!sidebarOpened)
          }}>
          {sidebarOpened ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </span>
      </div>

      <NavLink to="/" exact={true} className="menu-item" activeClassName="item-active">
        <Bs.BsFillHouseDoorFill />
        <span className="menu-text">Home</span>
      </NavLink>

      <NavLink to="/schedule" className="menu-item" activeClassName="item-active">
        <Bs.BsFillCalendarFill />
        <span className="menu-text">Schedule</span>
      </NavLink>

      <NavLink to="/statistics" className="menu-item" activeClassName="item-active">
        <AiFillPieChart />
        <span className="menu-text">Statistics</span>
      </NavLink>
    </div>
  )
}
