import { useEffect } from 'react'

import { TMWallet } from 'ethers-network/transaction'

import {
  Step,
  StepId,
  isInit,
  updateStep,
  setError,
  resetAllStep,
} from '../reducer/stateSlice'

import {
  walletListLoadAddress,
  walletStorageLoad,
} from 'ethers-network/storage'

import {
  setWallet,
  setWalletList,
  setPasswordCheck,
  setBalance,
} from '../reducer/walletSlice'

import {
  getWalletList,
} from 'ethers-network/network'

import { useAppSelector, useAppDispatch } from '../hooks'

const loadWalletFromBroswer = async (
  dispatch: any,
  password: { password: string | undefined, passwordCheck: string | undefined },
  setTMWallet: (tMWallet: TMWallet) => void,
) => {
  dispatch(updateStep({ id: StepId.Wallet, step: Step.Loading }))
  const walletStorage = walletStorageLoad()
  try {
    switch (walletStorage.walletType) {
      case 'Broswer':
        dispatch(setWallet({
          type: 'Broswer',
          balance: []
        }))
        dispatch(setPasswordCheck({
          password: password.password? password.password : walletStorage.password,
          passwordCheck: walletStorage.passwordCheck
        }))
        if (!password.password) {
          password = {
            password: walletStorage.password,
            passwordCheck: walletStorage.passwordCheck,
          }
        }
        if (password.password) {
          if (walletStorage.walletAddress) {
            dispatch(setWalletList(await getWalletList(password.password)))
            const walletStorageWithKey = await walletListLoadAddress(
              walletStorage.walletAddress,
              password.password
            )
            if (walletStorageWithKey) {
              dispatch(setWallet({
                type: 'Broswer',
                name: walletStorageWithKey.name,
                address: walletStorageWithKey.address,
                balance : []
              }))
              if (walletStorageWithKey.pkey) {
                setTMWallet(
                  new TMWallet(
                    walletStorageWithKey.pkey,
                    dispatch,
                    setBalance,
                  )
                )
              }
              dispatch(setWallet({
                type: 'Broswer',
                name: walletStorageWithKey.name,
                address: walletStorageWithKey.address,
                balance : []
              }))
              dispatch(resetAllStep())
              dispatch(updateStep({ id: StepId.Wallet, step: Step.Ok }))
            } else {
              dispatch(updateStep({ id: StepId.Wallet, step: Step.NoAddress }))
            }
          } else {
            dispatch(updateStep({ id: StepId.Wallet, step: Step.NoAddress }))
          }
        } else {
          dispatch(updateStep({ id: StepId.Wallet, step: Step.NoPassword }))
        }
        break
        default :
        throw new Error('Unsuported wallet ' + walletStorage.walletType)
      }
  } catch (err: any) {
    console.error(err)
    dispatch(setError({ id: StepId.Wallet, error: err.toString() }))
  }
}

const WalletLoader = (props: {
  tMWallet: TMWallet | undefined
  setTMWallet: (tMWallet: TMWallet) => void
}) => {

  const step = useAppSelector((state) => state.stateSlice.step)
  const password = useAppSelector((state) => state.walletSlice.password)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isInit(StepId.Wallet, step)) {
      loadWalletFromBroswer(
        dispatch,
        password,
        props.setTMWallet,
      )
    }
  }, [
      dispatch,
      step,
      password,
      props.setTMWallet,
    ])

  return (<></>)
}

export default WalletLoader
