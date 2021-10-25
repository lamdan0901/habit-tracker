import habitsApi from '../apis/habitsApi'
import * as types from './types'

export const getAllHabits = () => async (dispatch) => {
  try {
    const res = await habitsApi.getAllHabits()
    dispatch({
      type: types.GET_ALL_HABITS,
      payload: res,
    })
  } catch (error) {
    Promise.reject(error)
  }
}

export const postHabit = (data) => async (dispatch) => {
  try {
    const res = await habitsApi.postHabit(data)
    dispatch({
      type: types.CREATE_HABIT,
      payload: res,
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putHabit = (habit) => async (dispatch) => {
  try {
    await habitsApi.putHabit(habit.id, habit)
    dispatch({
      type: types.UPDATE_HABIT,
      payload: [habit.id, habit],
    })
  } catch (error) {
    Promise.reject(error)
  }
}

export const deleteHabit = (id) => async (dispatch) => {
  try {
    await habitsApi.deleteHabit(id)
    dispatch({
      type: types.DELETE_HABIT,
      payload: id,
    })
  } catch (error) {
    Promise.reject(error)
  }
}
