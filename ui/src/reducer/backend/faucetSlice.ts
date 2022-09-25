import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import backendConfig from "../../config/backendconfig"

import {
  addCaseWithPending,
  axiosThunk,
  axiosThunkData,
} from '../../util/reducersUtil'

// Define a type for the slice state
interface FaucetState {
  network: Array<{ networkName: string, lastRequest: Date }>
  message: string | undefined
  pending: boolean
  enable: boolean
  faucetAmount: number | undefined
}

const API_URL = backendConfig.url;

const initialState: FaucetState = {
  network: [] as Array<{ networkName: string, lastRequest: Date }>,
  message: undefined,
  pending: false,
  enable: false,
  faucetAmount: undefined,
};

export const checkFaucet = axiosThunkData<{ address: string, chainId: number }>(
  'wallet/checkFaucet',
  API_URL + "wallet/checkFaucet",
)

export const faucet = axiosThunk<{ address: string, chainId: number }>(
  'wallet/fund',
  API_URL + "wallet/fund",
)

export const faucetSlice = createSlice({
  name: 'faucet',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(checkFaucet.fulfilled, (state, action: PayloadAction<{ faucetAmount: number | undefined }>) => {
      state.faucetAmount = action.payload.faucetAmount
      state.enable = true
      state.pending = false
    })
    builder.addCase(checkFaucet.rejected, (state) => {
      state.faucetAmount = undefined
      state.enable = false
      state.pending = false
    })
    builder.addCase(checkFaucet.pending, (state) => {
      state.faucetAmount = undefined
      state.pending = true
    })
    /*
    builder.addCase(faucet.fulfilled, (state, action: PayloadAction<{message : string}>) => {
      state.message = action.payload.message
      state.pending = false
    })
    builder.addCase(faucet.rejected, (state) => {
      state.pending = false
    })
    builder.addCase(faucet.pending, (state) => {
      state.pending = true
    })
    */

    addCaseWithPending(builder, faucet)
  }
})


export const { } = faucetSlice.actions

export default faucetSlice.reducer
