import { createSlice, SerializedError, createAsyncThunk } from '@reduxjs/toolkit'

import habitsApi from '../apis/habitsApi'
import { sortHabits } from '../utils/utilityFunctions'

export type Performance = { id: number; time: string; isChecked: boolean; habitId: number }

export interface Habit {
  id?: number
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
  performances?: Performance[]
  createdAt?: Date
  checked?: boolean
}

export interface DeletedHabit {
  title: string
  description: string
  reminderTime: Date | string
  reminderDays: number[]
}

interface UpdateHabitPayload {
  id: number
  habit: Habit
}

export interface HabitState {
  value: Habit[]
  isFetching?: boolean
  error?: SerializedError
}

const initialState: HabitState = {
  value: [],
  isFetching: false,
  error: undefined,
}

export const getHabits = createAsyncThunk('getHabits', async () => {
  return habitsApi.getAllHabits() as unknown as Habit[]
})

export const createHabit = createAsyncThunk('postHabit', async (habit: Habit | DeletedHabit) => {
  return habitsApi.postHabit(habit)
})

export const updateHabit = createAsyncThunk(
  'putHabit',
  async ({ id, habit }: UpdateHabitPayload) => {
    return habitsApi.putHabit(id, habit)
  },
)

export const deleteHabit = createAsyncThunk('deleteHabit', async (id: number) => {
  return habitsApi.deleteHabit(id)
})

export const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // * --- getHabits ---
    builder.addCase(getHabits.pending, (state) => {
      state.isFetching = true
    })
    builder.addCase(getHabits.fulfilled, (state, { payload }) => {
      state.isFetching = false
      state.value = sortHabits(payload)
    })
    builder.addCase(getHabits.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.error
    })

    // * --- createHabit ---
    builder.addCase(createHabit.pending, (state) => {
      state.isFetching = true
    })
    builder.addCase(createHabit.fulfilled, (state) => {
      state.isFetching = false
    })
    builder.addCase(createHabit.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.error
    })

    // * --- updateHabit ---
    builder.addCase(updateHabit.pending, (state) => {
      state.isFetching = true
    })
    builder.addCase(updateHabit.fulfilled, (state) => {
      state.isFetching = false
    })
    builder.addCase(updateHabit.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.error
    })

    // * --- deleteHabit ---
    builder.addCase(deleteHabit.pending, (state) => {
      state.isFetching = true
    })
    builder.addCase(deleteHabit.fulfilled, (state) => {
      state.isFetching = false
    })
    builder.addCase(deleteHabit.rejected, (state, action) => {
      state.isFetching = false
      state.error = action.error
    })
  },
})

export const habitReducer = habitSlice.reducer

export default habitSlice.reducer
