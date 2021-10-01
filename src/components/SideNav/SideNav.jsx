import { Link } from 'react-router-dom'
import * as Bs from 'react-icons/bs'
import './SideNav.scss'

export default function SideNav() {
  return (
    <ul className="menu">
      <li className="menu-item">avatar</li>
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
        <Link to="/settings">
          <Bs.BsFillPeopleFill />
          <span className="menu-text">Settings</span>
        </Link>
      </li>
    </ul>
  )
}
