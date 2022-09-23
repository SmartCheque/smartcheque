import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WalletInfo } from 'ethers-network/wallet'
import type { WalletType } from 'ethers-network/wallet'

// Define a type for the slice state
interface UserState {
  wallet: WalletInfo,
  password: {
    password: string | undefined,
    passwordCheck: string | undefined
  },
  walletList: WalletType[]
}

// Define the initial state using that type
const initialState: UserState = {
  wallet: { balance: [] },
  password: {
    password: undefined,
    passwordCheck: undefined
  },
  walletList: []
}

export const walletSlice = createSlice({
  name: 'wallet',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPassword: (state, action: PayloadAction<string | undefined>) => {
      state.password.password = action.payload
    },
    setPasswordCheck: (state, action: PayloadAction<{ password: string | undefined, passwordCheck: string | undefined }>) => {
      state.password = action.payload
    },
    setWallet: (state, action: PayloadAction<WalletInfo>) => {
      state.wallet = action.payload
    },
    setWalletList: (state, action: PayloadAction<WalletType[] | undefined>) => {
      if (action.payload)
        state.walletList = action.payload
      else
        state.walletList = []
    },
    setBalance: (state, action: PayloadAction<{ address: string, chainId: number, balance: number | undefined }>) => {
      if (
        state.wallet.address === action.payload.address
      ) {
        const walletBalance = state.wallet.balance.filter(_balance => _balance.chainId === action.payload.chainId)[0]
        if (walletBalance) {
          walletBalance.balance = action.payload.balance
        } else {
          state.wallet.balance.push({
            balance: action.payload.balance,
            chainId: action.payload.chainId,
          })
        }
      } else {
        console.error("Wrong balance update ", action.payload)
      }
    },
    clearPassword: (state) => {
      state.password.password = undefined
    },
    clearWallet: (state) => {
      state.wallet = { balance: [] }
    },
    clearWalletList: (state) => {
      state.walletList = []
    },
  },
})

export const {
  setBalance,
  setWallet,
  setWalletList,
  setPassword,
  setPasswordCheck,
  clearWallet,
  clearWalletList,
  clearPassword,
} = walletSlice.actions

export default walletSlice.reducer
