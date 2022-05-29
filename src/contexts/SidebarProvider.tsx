import React, { useContext, useState } from 'react'

const SidebarContext = React.createContext([{}, () => {}])

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <SidebarContext.Provider value={[sidebarOpen, toggleSidebar]}>
      {children}
    </SidebarContext.Provider>
  )
}
