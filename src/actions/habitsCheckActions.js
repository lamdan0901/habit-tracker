import habitsApi from '../apis/habitsCheckApi'
import * as types from './types'

export const getHabitsCheck = () => async (dispatch) => {
  try {
    const res = await habitsApi.getHabitsCheck()
    dispatch({
      type: types.GET_HABITS_CHECK,
      payload: res,
    })
  } catch (error) {
    Promise.reject(error)
  }
}

export const putHabitsCheck = (habitCheck) => async (dispatch) => {
  try {
    await habitsApi.putHabitsCheck(habitCheck)
    dispatch({
      type: types.UPDATE_HABITS_CHECK,
      payload: habitCheck,
    })
  } catch (error) {
    Promise.reject(error)
  }
}
