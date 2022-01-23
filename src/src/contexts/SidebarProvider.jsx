import React, { useContext, useState } from 'react'

const SidebarContext = React.createContext()
const SidebarUpdateContext = React.createContext()

export function useSidebar() {
  return useContext(SidebarContext)
}
export function useSidebarUpdate() {
  return useContext(SidebarUpdateContext)
}

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <SidebarContext.Provider value={sidebarOpen}>
      <SidebarUpdateContext.Provider value={toggleSidebar}>
        {children}
      </SidebarUpdateContext.Provider>
    </SidebarContext.Provider>
  )
}
