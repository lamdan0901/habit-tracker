import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import App from './App/App'

Modal.setAppElement('#root')

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
