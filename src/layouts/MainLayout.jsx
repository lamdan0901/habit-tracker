import React from 'react'
import SideNav from 'components/SideNav/SideNav'
import NavBar from 'components/NavBar/NavBar'
import './MainLayout.scss'

export default function MainLayout(props) {
  return (
    <main>
      <div className="main-layout">
        <SideNav />
        <div className="content">
          <NavBar />
          <div className="children">{props.children}</div>
        </div>
      </div>
    </main>
  )
}
