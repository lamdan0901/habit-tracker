import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const rootElement = document.getElementById('root')
ReactDOM.render(
  <div>
    <App></App>
  </div>,
  rootElement,
)
