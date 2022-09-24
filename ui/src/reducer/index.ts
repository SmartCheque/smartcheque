import { combineReducers } from "redux"
import stateSlice from './stateSlice'
import walletSlice from './walletSlice'
import configSlice from './configSlice'
import authSlice from './backend/authSlice'
import messageSlice from './backend/messageSlice'
import faucetSlice from './backend/faucetSlice'
import contractSlice from './backend/contractSlice'


export default combineReducers({
  contractSlice,
  stateSlice,
  walletSlice,
  configSlice,
  authSlice,
  messageSlice,
  faucetSlice,
})
