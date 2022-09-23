import { ethers, BigNumber } from 'ethers'

import { useEffect } from 'react'

import { TransactionManager } from 'ethers-network/transaction'
import { TimerSemaphore } from 'ethers-network/util'
import { NetworkType } from 'ethers-network/network'

import {
  Step,
  StepId,
  isInit,
  updateStep,
  updateStepIf,
  setError,
  resetAllStep,
} from '../reducer/contractSlice'

import {
  walletListLoadAddress,
  walletStorageLoad,
} from 'ethers-network/storage'

import {
  setWallet,
  setWalletList,
  setNetwork,
  setPasswordCheck,
  setBalance,
} from '../reducer/walletSlice'

import {
  getWeb3Wallet,
  addHooks,
  getProvider,
  getNetworkFromChainId,
  getWalletList,
} from 'ethers-network/network'

import { useAppSelector, useAppDispatch } from '../hooks'

const updateBalance =  async (
  dispatch: any,
  balance: BigNumber,
  address: string,
  chainId: number,
) => {
  const _balance = parseFloat(
    ethers.utils.formatEther(
      balance
    )
  )
  dispatch(
    setBalance({
      chainId: chainId,
      address: address,
      balance: _balance
    })
  )
  if (_balance){
    dispatch(updateStepIf({ id: StepId.Wallet, ifStep: Step.NoBalance, step: Step.Init }))
  }
  return _balance
}

const refreshBalance = async (
  dispatch: any,
  transactionManager: TransactionManager,
) => {
  return updateBalance(
    dispatch,
    await transactionManager.getBalance(),
    await transactionManager.getAddress(),
    await transactionManager.getChainId(),
  )
}

const setTransactionManagerUpdate = async (
  dispatch: any,
  provider: ethers.providers.Provider,
  setTransactionManager: (transactionManager: TransactionManager) => void,
  network : NetworkType,
  signer : ethers.Signer
) => {
  let timerSemaphore
  if (network.timeBetweenRequest) {
    timerSemaphore = new TimerSemaphore(
      network.timeBetweenRequest,
      network.retry,
    )
  }
  const transactionManager = new TransactionManager(
    signer,
    timerSemaphore,
  )
  setTransactionManager(transactionManager)
  const balance = refreshBalance(dispatch, transactionManager)
  if (network.refreshBalance) {
    transactionManager.refreshBalance(
      network.refreshBalance,
      dispatch,
      updateBalance
    )
  } else {
    provider.on('block', () => {
      refreshBalance(dispatch, transactionManager)
    })
  }
  return balance
}

const loadWalletFromBroswer = async (
  dispatch: any,
  password: { password: string | undefined, passwordCheck: string | undefined },
  setTransactionManager: (transactionManager: TransactionManager) => void,
) => {
  dispatch(updateStep({ id: StepId.Wallet, step: Step.Loading }))
  const walletStorage = walletStorageLoad()
  try {
    switch (walletStorage.walletType) {
      case 'Broswer':
        dispatch(setWallet({
          type: 'Broswer',
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
              }))
              let balance
              if (walletStorageWithKey.pkey) {
                const _network = getNetworkFromChainId(walletStorage.chainId)
                if (_network) {
                  dispatch(setNetwork(_network))
                  const setErrorWallet = (error: string) => {
                    setError({ id: StepId.Wallet, error })
                  }
                  const provider = getProvider(_network, setErrorWallet)
                  if (provider) {
                    const balance = await setTransactionManagerUpdate(
                      dispatch,
                      provider,
                      setTransactionManager,
                      _network,
                      new ethers.Wallet(
                        walletStorageWithKey.pkey,
                        provider
                      ),
                    )
                    if (!balance) {
                      dispatch(updateStep({ id: StepId.Wallet, step: Step.NoBalance }))
                      return
                    }
                  }
                } else {
                  dispatch(updateStep({ id: StepId.Wallet, step: Step.NoNetwork }))
                  return
                }
              }
              dispatch(setWallet({
                type: 'Broswer',
                name: walletStorageWithKey.name,
                address: walletStorageWithKey.address,
                balance,
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
      case 'Metamask':
        dispatch(setWallet({
          type: 'Metamask',
        }))
        const web3Wallet = await getWeb3Wallet()
        const address = await web3Wallet.signer.getAddress()
        if (web3Wallet.network){
          dispatch(setNetwork(web3Wallet.network))
          dispatch(setWallet({
            type: 'Metamask',
            address,
          }))
          dispatch(resetAllStep())
          dispatch(updateStep({ id: StepId.Wallet, step: Step.Ok }))
          const balance = await setTransactionManagerUpdate(
            dispatch,
            web3Wallet.signer.provider,
            setTransactionManager,
            web3Wallet.network,
            web3Wallet.signer,
          )
          if (!balance) {
            dispatch(updateStep({ id: StepId.Wallet, step: Step.NoBalance }))
            return
          }
          addHooks()
        } else {
          dispatch(updateStep({ id: StepId.Wallet, step: Step.NoNetwork }))
          return
        }
        break
      default:
        dispatch(updateStep({ id: StepId.Wallet, step: Step.NotSet }))
    }
  } catch (err: any) {
    console.error(err)
    dispatch(setError({ id: StepId.Wallet, error: err.toString() }))
  }
}

const WalletLoader = (props: {
  transactionManager: TransactionManager | undefined
  setTransactionManager: (transactionManager: TransactionManager) => void
}) => {

  const step = useAppSelector((state) => state.contractSlice.step)
  const password = useAppSelector((state) => state.walletSlice.password)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isInit(StepId.Wallet, step)) {
      loadWalletFromBroswer(
        dispatch,
        password,
        props.setTransactionManager,
      )
    }
  }, [
      dispatch,
      step,
      password,
      props.setTransactionManager,
    ])

  return (<></>)
}



export default WalletLoader
