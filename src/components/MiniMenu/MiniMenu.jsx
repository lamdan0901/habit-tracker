import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import * as HiIcons from 'react-icons/hi'
import './MiniMenu.scss'

export default function MiniMenu() {
  return (
    <Menu
      //để ý kĩ, làm cái button vs list giống fb ý
      menuButton={
        <button>
          <HiIcons.HiDotsVertical />
        </button>
      }
      transition>
      <MenuItem onClick={() => console.log('details clicked!')}>See Details</MenuItem>
      <MenuItem onClick={() => console.log('edit clicked!')}>Edit Habit</MenuItem>
      <MenuItem onClick={() => console.log('delete clicked!')}>Delete Habit</MenuItem>
      <MenuItem>Cancel</MenuItem>
    </Menu>
  )
}
