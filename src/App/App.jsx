import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from 'pages/Home/Home'
import Schedule from 'pages/Schedule/Schedule'
import store from 'redux/store'
import './App.scss'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/schedule" component={Schedule} />
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}
