import habitsApi from '../apis/habitsApi'
import * as types from './types'

export const getAllHabits = () => async (dispatch) => {
  try {
    const res = await habitsApi.getAllHabits()
    dispatch({
      type: types.GET_ALL_HABITS,
      payload: res,
    })
    return res
  } catch (error) {
    throw error
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
    throw error
  }
}

export const putHabit = (id, habit) => async (dispatch) => {
  try {
    await habitsApi.putHabit(id, habit)
    dispatch({
      type: types.UPDATE_HABIT,
      payload: [id, habit],
    })
  } catch (error) {
    throw error
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
    throw error
  }
}
