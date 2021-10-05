import React from 'react'
import SideNav from 'components/SideNav/SideNav'
import NavBar from 'components/NavBar/NavBar'
import './MainLayout.scss'

export default function MainLayout(props) {
  return (
    <main>
      <div className={props.isBlur ? 'main-layout blur-active' : 'main-layout'}>
        <SideNav />
        <div className="content">
          <NavBar></NavBar>
          <div className="children">{props.children}</div>
        </div>
      </div>
    </main>
  )
}
