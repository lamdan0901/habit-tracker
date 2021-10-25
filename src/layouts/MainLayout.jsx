import React from 'react'
import { ToastContainer } from 'react-toastify'
import SideNav from 'components/SideNav/SideNav'
import NavBar from 'components/NavBar/NavBar'
import './MainLayout.scss'

export default function MainLayout(props) {
  return (
    <main>
      <ToastContainer autoClose={2000} />
      <React.StrictMode>
        <div className="main-layout">
          <SideNav />
          <div className="content">
            <NavBar />
            <div className="children">{props.children}</div>
          </div>
        </div>
      </React.StrictMode>
    </main>
  )
}
