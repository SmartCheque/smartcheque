import { BigNumber } from 'ethers'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import backendConfig from "../../config/backendconfig"

import {
  addCaseWithPending,
  axiosThunk,
  axiosThunkData,
} from '../../util/reducersUtil'

interface ContractInfoState {
  chainId: number,
  name: string,
  address: string | undefined,
  hash: string,
  pending: boolean,
}

// Define a type for the slice state
interface ContractState {
  message: string | undefined
  contract: Array<ContractInfoState>
  allowance?: {
    chainId: number
    contractAddress: string
    timestamp: number
    allowance: BigNumber
    customerCertificate: string
  } | undefined
}

const API_URL = backendConfig.url;

const initialState: ContractState = {
  message: undefined,
  contract: [],
};

export const getContract = axiosThunkData<{ chainId: number, name: string, hash: string }>(
  'contract/get',
  API_URL + "contract/get",
)

export const deployContract = axiosThunkData<{ chainId: number, name: string, hash: string }>(
  'contract/deploy',
  API_URL + "contract/deploy",
)

export const createBank = axiosThunkData<{ chainId: number, name: string }>(
  "bank/create",
  API_URL + "bank/create",
)

export const getAllowance = axiosThunkData<{ chainId: number, contractAddress: string, customer: string }>(
  "bank/allowance",
  API_URL + "bank/allowance",
)

const filterContract = (state: { contract: Array<any> }, action: any) => {
  return state.contract.filter(_contract => {
    return _contract.chainId === action.meta.arg.chainId && _contract.name === action.meta.arg.name && _contract.hash === action.meta.arg.hash
  })[0]
}

export const contractSlice = createSlice({
  name: 'contract',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getAllowance.fulfilled, (state, action) => {
      state.allowance = {
        chainId: action.meta.arg.chainId,
        contractAddress: action.meta.arg.contractAddress,
        timestamp: action.payload.timestamp,
        allowance: action.payload.allowance,
        customerCertificate: action.payload.customerCertificate,
      }
    })
    builder.addCase(getAllowance.rejected, (state, action) => {
      state.allowance = undefined
    })
    builder.addCase(getAllowance.pending, (state, action) => {
      state.allowance = undefined
    })
    builder.addCase(getContract.fulfilled, (state, action) => {
      const contract = filterContract(state, action)
      if (contract) {
        contract.address = action.payload.address
        contract.pending = false
      } else {
        state.contract.push({
          chainId: action.meta.arg.chainId,
          name: action.meta.arg.name,
          hash: action.meta.arg.hash,
          pending: false,
          address: action.payload.address
        })
      }
    })
    builder.addCase(getContract.rejected, (state, action) => {
      const contract = filterContract(state, action)
      if (contract) {
        contract.address = undefined
        contract.pending = false
      } else {
        state.contract.push({
          chainId: action.meta.arg.chainId,
          name: action.meta.arg.name,
          hash: action.meta.arg.hash,
          pending: false,
          address: undefined
        })
      }
    })
    builder.addCase(getContract.pending, (state, action) => {
      const contract = filterContract(state, action)
      if (contract) {
        contract.pending = true
      } else {
        state.contract.push({
          chainId: action.meta.arg.chainId,
          name: action.meta.arg.name,
          hash: action.meta.arg.hash,
          pending: false,
          address: undefined
        })
      }
    })
    builder.addCase(deployContract.fulfilled, (state, action) => {
      const contract = filterContract(state, action)
      if (contract) {
        contract.address = action.payload.address
        contract.pending = false
      } else {
        state.contract.push({
          chainId: action.meta.arg.chainId,
          name: action.meta.arg.name,
          hash: action.meta.arg.hash,
          pending: false,
          address: action.payload.address
        })
      }
    })
    builder.addCase(deployContract.rejected, (state, action) => {
      const contract = filterContract(state, action)
      if (contract) {
        contract.address = undefined
        contract.pending = false
      } else {
        state.contract.push({
          chainId: action.meta.arg.chainId,
          name: action.meta.arg.name,
          hash: action.meta.arg.hash,
          pending: false,
          address: undefined
        })
      }
    })
    builder.addCase(deployContract.pending, (state, action) => {
      const contract = filterContract(state, action)
      if (contract) {
        contract.pending = true
      } else {
        state.contract.push({
          chainId: action.meta.arg.chainId,
          name: action.meta.arg.name,
          hash: action.meta.arg.hash,
          pending: false,
          address: undefined
        })
      }
    })

  }
})


export const { } = contractSlice.actions

export default contractSlice.reducer
