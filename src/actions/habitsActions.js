import usersApi from '../apis/habitsApi'
import * as types from './types'

export const getAllHabits = () => async (dispatch) => {
  try {
    const res = await usersApi.getAllHabits()
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
    const res = await usersApi.postHabit(data)
    console.log(res)
    dispatch({
      type: types.CREATE_HABIT,
      payload: res,
    })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const putHabit = (id, user) => async (dispatch) => {
  try {
    await usersApi.putHabit(id, user)
    dispatch({
      type: types.UPDATE_HABIT,
      payload: [id, user],
    })
  } catch (error) {
    Promise.reject(error)
  }
}

export const deleteHabit = (id) => async (dispatch) => {
  try {
    await usersApi.deleteHabit(id)
    dispatch({
      type: types.DELETE_HABIT,
      payload: id,
    })
  } catch (error) {
    Promise.reject(error)
  }
}
