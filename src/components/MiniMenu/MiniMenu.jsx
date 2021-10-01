import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'

export default function MiniMenu({ menuIcon }) {
  return (
    <Menu menuButton={<MenuButton>{menuIcon}</MenuButton>} transition>
      <MenuItem onClick={() => console.log('clicked!')}>Edit Habit</MenuItem>
      <MenuItem>Delete Habit</MenuItem>
      <MenuItem>Cancel</MenuItem>
    </Menu>
  )
}
