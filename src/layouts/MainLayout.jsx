import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { ToastContainer } from 'react-toastify'
import Sidebar from 'components/Sidebar/Sidebar'
import NavBar from 'components/NavBar/NavBar'
import './MainLayout.scss'

export default function MainLayout(props) {
  return (
    <main>
      <ToastContainer autoClose={2000} />
      <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="main-layout">
            <Sidebar
              habits={props.habits}
              handleSetSearchedHabits={props.handleSetSearchedHabits}
              setIsSearching={props.setIsSearching}
              sidebarOpened={props.sidebarOpened}
              setSidebarOpened={props.setSidebarOpened}
            />
            <div className="content">
              <NavBar clockState={props.clockState} />
              <div className="children">{props.children}</div>
            </div>
          </div>
        </LocalizationProvider>
      </React.StrictMode>
    </main>
  )
}
