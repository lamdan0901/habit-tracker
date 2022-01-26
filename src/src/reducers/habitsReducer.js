import * as types from '../actions/types'

const initialState = []

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_HABITS:
      return action.payload

    case types.CREATE_HABIT:
      return [...state, action.payload]

    case types.UPDATE_HABIT: {
      const index = state.findIndex((user) => user.id === action.payload[0])

      const newState = [...state]
      newState[index] = action.payload[1]
      newState[index].id = action.payload[0]
      return newState
    }

    case types.DELETE_HABIT: {
      const index = state.findIndex((user) => user.id === action.payload)

      const newState = [...state]
      newState.splice(index, 1)
      return [...newState]
    }

    default:
      return state
  }
}