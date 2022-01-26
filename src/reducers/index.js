import { combineReducers } from 'redux'
import habitsReducer from './habitsReducer'
import habitsCheckReducer from './habitsCheckReducer'

export default combineReducers({
  habits: habitsReducer,
  habitsCheck: habitsCheckReducer,
})
