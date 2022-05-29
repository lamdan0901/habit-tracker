import { combineReducers } from 'redux'
import habitsReducer from './habitsReducer'

export default combineReducers({
  habits: habitsReducer,
})
