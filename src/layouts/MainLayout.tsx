import AdapterDateFns from '@date-io/date-fns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { ToastContainer } from 'react-toastify'

import Sidebar from '../components/Sidebar/Sidebar'
import NavBar from '../components/NavBar/NavBar'
import 'react-toastify/dist/ReactToastify.css'
import './MainLayout.scss'
import { Habit } from '../reducers/habitSlice'

interface MainLayoutProps {
  habits: Habit[]
  onSearchTextChange(search: string): void
  children: React.ReactNode
}

export default function MainLayout({ habits, onSearchTextChange, children }: MainLayoutProps) {
  return (
    <main>
      <ToastContainer autoClose={2000} pauseOnFocusLoss={false} pauseOnHover />
      {/* @ts-ignore */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="main-layout">
          <Sidebar habits={habits} onSearchTextChange={onSearchTextChange} />
          <div className="content-and-nav">
            <NavBar />
            <div className="children">{children}</div>
          </div>
        </div>
      </LocalizationProvider>
    </main>
  )
}
