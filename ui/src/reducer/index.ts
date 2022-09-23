import { combineReducers } from "redux"
import contractSlice from './contractSlice'
import walletSlice from './walletSlice'
import configSlice from './configSlice'
import authSlice from './backend/authSlice'
import messageSlice from './backend/messageSlice'
import faucetSlice from './backend/faucetSlice'


export default combineReducers({
  contractSlice,
  walletSlice,
  configSlice,
  authSlice,
  messageSlice,
  faucetSlice,
})
