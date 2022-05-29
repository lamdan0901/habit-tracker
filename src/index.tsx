import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import App from './App/App'
import { SidebarProvider } from './contexts/SidebarProvider'

Modal.setAppElement('#root')

const rootElement = document.getElementById('root')
ReactDOM.render(
  <>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </>,
  rootElement,
)
