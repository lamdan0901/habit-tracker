import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import App from './App/App'
import { SidebarProvider } from 'contexts/SidebarProvider'

Modal.setAppElement('#root')

const rootElement = document.getElementById('root')
ReactDOM.render(
  <div>
    <React.StrictMode>
      <SidebarProvider>
        <App></App>
      </SidebarProvider>
    </React.StrictMode>
  </div>,
  rootElement,
)
