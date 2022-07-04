import habitsApi from '../apis/habitsApi'
import { DeletedHabit, Habit } from '../pages/Home/Home'
import { AppDispatch } from '../redux/store'
import * as types from './types'

export const getAllHabits = () => async (dispatch: AppDispatch) => {
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

export const postHabit = (habit: Habit | DeletedHabit) => async (dispatch: AppDispatch) => {
  try {
    const res = await habitsApi.postHabit(habit)
    dispatch({
      type: types.CREATE_HABIT,
      payload: res,
    })
  } catch (error) {
    throw error
  }
}

export const putHabit = (id: number, habit: Habit) => async (dispatch: AppDispatch) => {
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

export const deleteHabit = (id: number) => async (dispatch: AppDispatch) => {
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
