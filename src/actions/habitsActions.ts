import { AppDispatch } from '../redux/store'
import habitsApi from '../apis/habitsApi'
import * as types from './types'

type TPerformance = { id: number; time: string; isChecked: boolean; habitId: number }

interface IHabit {
  id: number
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
  performances: TPerformance[]
  createdAt?: Date
}

interface IDeletedHabit {
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
}

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

export const postHabit = (habit: IHabit | IDeletedHabit) => async (dispatch: AppDispatch) => {
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

export const putHabit = (id: number, habit: IHabit) => async (dispatch: AppDispatch) => {
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
