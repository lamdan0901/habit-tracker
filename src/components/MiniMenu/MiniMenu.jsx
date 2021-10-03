import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import * as HiIcons from 'react-icons/hi'
//

export default function MiniMenu() {
  return (
    <Menu
      menuButton={
        <button className="mini-menu">
          <HiIcons.HiDotsVertical />
        </button>
      }
      transition>
      <MenuItem onClick={() => console.log('edit clicked!')}>Edit Habit</MenuItem>
      <MenuItem onClick={() => console.log('delete clicked!')}>Delete Habit</MenuItem>
      <MenuItem>Cancel</MenuItem>
    </Menu>
  )
}
