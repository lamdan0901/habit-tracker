import { createSlice, SerializedError, createAsyncThunk } from '@reduxjs/toolkit'

import habitsApi from '../apis/habitsApi'

interface UpdateHabitPayload {
  id: string
  habit: Habit
}

interface HabitResponse {
  data: Habit[]
  numOfPages: number
}

interface HabitState {
  value: HabitResponse
  error?: SerializedError
}

const initialState: HabitState = {
  value: { data: [], numOfPages: 1 },
  error: undefined,
}

export const getHabits = createAsyncThunk(
  'getHabits',
  async (params?: GetHabitsParams) => await habitsApi.getAllHabits(params),
)

export const createHabit = createAsyncThunk('postHabit', async (habit: Habit | DeletedHabit) => {
  await habitsApi.postHabit(habit)
})

export const updateHabit = createAsyncThunk(
  'putHabit',
  async ({ id, habit }: UpdateHabitPayload) => {
    await habitsApi.putHabit(id, habit)
  },
)

export const deleteHabit = createAsyncThunk('deleteHabit', async (id: string) => {
  await habitsApi.deleteHabit(id)
})

export const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // * --- getHabits ---
    builder.addCase(getHabits.fulfilled, (state, { payload }) => {
      //@ts-ignore
      state.value = payload
    })
    builder.addCase(getHabits.rejected, (state, action) => {
      state.error = action.error
    })

    // * --- createHabit ---
    builder.addCase(createHabit.fulfilled, (state) => {
      state.error = undefined
    })
    builder.addCase(createHabit.rejected, (state, action) => {
      state.error = action.error
    })

    // * --- updateHabit ---
    builder.addCase(updateHabit.fulfilled, (state) => {
      state.error = undefined
    })
    builder.addCase(updateHabit.rejected, (state, action) => {
      state.error = action.error
    })

    // * --- deleteHabit ---
    builder.addCase(deleteHabit.fulfilled, (state) => {
      state.error = undefined
    })
    builder.addCase(deleteHabit.rejected, (state, action) => {
      state.error = action.error
    })
  },
})

export const habitReducer = habitSlice.reducer

export default habitSlice.reducer
