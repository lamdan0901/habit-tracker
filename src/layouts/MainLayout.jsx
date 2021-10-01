import React from 'react'
import SideNav from 'components/SideNav/SideNav'
import NavBar from 'components/NavBar/NavBar'
import './MainLayout.scss'

export default function MainLayout({ children }) {
  return (
    <main>
      <div className="main-layout">
        <SideNav />
        <div className="content">
          <NavBar></NavBar>
          <div className="children">{children}</div>
        </div>
      </div>
    </main>
  )
}
