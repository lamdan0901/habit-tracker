import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import userAvatar from '../../assets/img/demo-avatar.gif'
import { AiTwotoneSetting } from 'react-icons/ai'
import { MdDarkMode } from 'react-icons/md'
import { GoSignOut } from 'react-icons/go'
import './NavBar.scss'

export default function NavBar({ clockState }) {
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
          className="dropdown-item"
          {...itemProps[0]}
          href="/#"
          onClick={(e) => {
            e.stopPropagation()
            console.log('1 clicked')
          }}>
          <AiTwotoneSetting />
          Settings
        </a>
        <a
          className="dropdown-item"
          {...itemProps[1]}
          href="/#"
          onClick={(e) => {
            e.stopPropagation()
            console.log('2 clicked')
          }}>
          <MdDarkMode />
          Dark theme
        </a>
        <a
          className="dropdown-item"
          {...itemProps[2]}
          href="/#"
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
