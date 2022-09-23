import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { WalletInfo } from 'ethers-network/wallet'
import type { WalletType } from 'ethers-network/wallet'
import type { NetworkType } from 'ethers-network/network'

// Define a type for the slice state
interface UserState {
  wallet: WalletInfo,
  network: NetworkType | undefined,
  password: {
    password: string | undefined,
    passwordCheck: string | undefined
  },
  walletList: WalletType[]
}

// Define the initial state using that type
const initialState: UserState = {
  wallet: {},
  network: undefined,
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
    setNetwork: (state, action: PayloadAction<NetworkType | undefined>) => {
      state.network = action.payload
    },
    setBalance: (state, action: PayloadAction<{ address: string, chainId: number, balance: number | undefined }>) => {
      if (
        state.wallet.address === action.payload.address &&
        state.network &&
        state.network.chainId &&
        state.network.chainId === action.payload.chainId
      ) {
        state.wallet.balance = action.payload.balance
      } else {
        console.error("Wrong balance update ", action.payload)
      }
    },
    clearPassword: (state) => {
      state.password.password = undefined
    },
    clearWallet: (state) => {
      state.wallet = {}
    },
    clearWalletList: (state) => {
      state.walletList = []
    },
    clearNetwork: (state) => {
      state.network = undefined
    }
  },
})

export const {
  setBalance,
  setWallet,
  setWalletList,
  setNetwork,
  setPassword,
  setPasswordCheck,
  clearWallet,
  clearWalletList,
  clearNetwork,
  clearPassword,
} = walletSlice.actions

export default walletSlice.reducer
