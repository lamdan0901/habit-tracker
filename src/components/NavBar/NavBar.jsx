import { useClockState } from 'contexts/SidebarProvider'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import userAvatar from '../../assets/img/demo-avatar.gif'

import { AiTwotoneSetting } from 'react-icons/ai'
import { MdDarkMode } from 'react-icons/md'
import { GoSignOut } from 'react-icons/go'
import './NavBar.scss'

export default function NavBar() {
  const clockState = useClockState()
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(3) //3 is the number of items in the dropdown menu

  return (
    <nav className="navbar">
      <h3 className="digi-clock">{clockState}</h3>

      <div {...buttonProps} className="user-info">
        <img src={userAvatar} alt="user-avatar" className="user-avatar" />
        <div className="user-name">Edward</div>
      </div>

      <div className={isOpen ? 'visible' : ''} role="menu">
        <a
          {...itemProps[0]}
          href="/#"
          className="dropdown-item"
          onClick={(e) => {
            e.stopPropagation()
            console.log('1 clicked')
          }}>
          <AiTwotoneSetting />
          Settings
        </a>
        <a
          {...itemProps[1]}
          href="/#"
          className="dropdown-item"
          onClick={(e) => {
            e.stopPropagation()
            console.log('2 clicked')
          }}>
          <MdDarkMode />
          Dark theme
        </a>
        <a
          {...itemProps[2]}
          href="/#"
          className="dropdown-item"
          onClick={(e) => {
            e.stopPropagation()
            console.log('3 clicked')
          }}>
          <GoSignOut />
          Sign out
        </a>
      </div>
    </nav>
  )
}
