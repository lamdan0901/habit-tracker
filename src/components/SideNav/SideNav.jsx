import { Link } from 'react-router-dom'
import * as Bs from 'react-icons/bs'
import { useState } from 'react'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import './SideNav.scss'

export default function SideNav() {
  const [sidebarOpened, setSidebarOpened] = useState(true)

  return (
    <ul className={sidebarOpened ? 'menu' : 'menu minimized'}>
      <li className="add-btn">
        <p>+</p>
        <span
          className="sidebar-icon"
          onClick={() => {
            setSidebarOpened(!sidebarOpened)
          }}>
          {sidebarOpened ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
        </span>
      </li>
      <li className="menu-item active">
        <Link to="/">
          <Bs.BsFillHouseDoorFill />
          <span className="menu-text">Home</span>
        </Link>
      </li>
      <li className="menu-item">
        <Link to="/schedule">
          <Bs.BsFillCalendarFill />
          <span className="menu-text">Schedule</span>
        </Link>
      </li>
      <li className="menu-item">
        <Link to="/">
          <Bs.BsFillPeopleFill />
          <span className="menu-text">Statistics</span>
        </Link>
      </li>
    </ul>
  )
}
