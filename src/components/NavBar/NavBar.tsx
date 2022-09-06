import clsx from 'clsx'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import useDropdownMenu from 'react-accessible-dropdown-menu-hook'
import { useUtilities } from '../../contexts/UtilitiesProvider'
import { useAuth } from '../../contexts/AuthProvider'

import { MdDarkMode } from 'react-icons/md'
import { GoSignOut } from 'react-icons/go'
import './NavBar.scss'

export default function NavBar() {
  const { clockState } = useUtilities()
  const { signOut, username } = useAuth()
  const { buttonProps, isOpen } = useDropdownMenu(2)

  const msg = `⚠️ Dark theme will be available soon!`

  return (
    <nav className="navbar">
      <h3 className="digi-clock">{clockState}</h3>

      {/* @ts-ignore */}
      <div {...buttonProps} className="user-info">
        <label className="user-name">{username}</label>
      </div>

      <div className={clsx(isOpen && 'visible')} role="menu">
        <Link
          to="/#"
          className="dropdown-item"
          onClick={(e: any) => {
            e.stopPropagation()
            toast(msg, {
              position: 'top-right',
              hideProgressBar: true,
              closeOnClick: true,
              progress: undefined,
            })
          }}>
          <MdDarkMode />
          Dark theme
        </Link>
        <Link
          to="/#"
          className="dropdown-item"
          onClick={(e: any) => {
            e.stopPropagation()
            signOut()
          }}>
          <GoSignOut />
          Sign out
        </Link>
      </div>
    </nav>
  )
}
