import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Define a type for the slice state
interface MessageState {
  message: string
}

const initialState: MessageState = { message: "" }

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<{ message: string }>) => {
      state.message = action.payload.message
    },
    clearMessage: (state) => {
      state.message = ""
    },
  },
})

export const { setMessage, clearMessage } = messageSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const lastMessage = (state: RootState) => state.messageSlice.message

export default messageSlice.reducer
