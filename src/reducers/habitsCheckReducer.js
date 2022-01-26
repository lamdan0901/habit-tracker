import * as types from '../actions/types'

const initialState = []

export default function habitsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_HABITS_CHECK: {
      return action.payload
    }

    case types.UPDATE_HABITS_CHECK: {
      const newState = [...state]
      newState[0] = [action.payload]
      newState[0].id = 1
      return newState
    }

    default:
      return state
  }
}
