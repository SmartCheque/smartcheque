import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
interface ConfigState {
  displayAdmin: boolean
}

// Define the initial state using that type
const initialState: ConfigState = {
  displayAdmin: localStorage.getItem("displayAdmin") === "true",
}

export const configSlice = createSlice({
  name: 'config',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDisplayAdmin: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        localStorage.setItem("displayAdmin", "true")
      } else {
        localStorage.removeItem("displayAdmin")
      }
      state.displayAdmin = action.payload
    },
  },
})

export const {
  setDisplayAdmin,
} = configSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const displayAdmin = (state: RootState) => state.configSlice.displayAdmin

export default configSlice.reducer
