import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'
import Modal from 'react-modal'
import { SidebarProvider } from 'contexts/SidebarProvider'

Modal.setAppElement('#root')

const rootElement = document.getElementById('root')
ReactDOM.render(
  <div>
    <SidebarProvider>
      <App></App>
    </SidebarProvider>
  </div>,
  rootElement,
)
