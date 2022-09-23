import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { isAdmin, isModerator } from '../../util/rolesUtils'

import backendConfig from "../../config/backendconfig"

import {
  addCaseWithPending,
  axiosThunk,
  axiosThunkData,
} from '../../util/reducersUtil'

import { User } from '../../type/user'

// Define a type for the slice state
interface AuthState {
  isLoggedIn: boolean,
  isModerator?: boolean,
  isAdmin?: boolean,
  pending: boolean,
  user: any,
}

const API_URL = backendConfig.url + "auth/";

const initialState: AuthState = {
  isLoggedIn: false,
  pending: false,
  user: null
};

export const login = axiosThunkData<{ email: string, password: string }>(
  'auth/login',
  API_URL + "signin",
)

export const register = axiosThunk<{ email: string, password: string }>(
  'auth/register',
  API_URL + "signup",
)

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loginFromCache: (state, action: PayloadAction<{ user: any }>) => {
      state.pending = false
      state.isLoggedIn = true
      state.isAdmin = isAdmin(action.payload)
      state.isModerator = isModerator(action.payload)
      state.user = action.payload
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.isLoggedIn = false
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User & { accessToken: string }>) => {
      if (action.payload.accessToken) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
      state.pending = false
      state.isLoggedIn = true
      state.isAdmin = isAdmin(action.payload)
      state.isModerator = isModerator(action.payload)
      state.user = action.payload
    })
    builder.addCase(login.rejected, (state) => {
      state.pending = false
    })
    builder.addCase(login.pending, (state) => {
      state.pending = true
    })

    addCaseWithPending(builder, register)
  }
})


export const { logout, loginFromCache } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.authSlice.isLoggedIn

export default authSlice.reducer
