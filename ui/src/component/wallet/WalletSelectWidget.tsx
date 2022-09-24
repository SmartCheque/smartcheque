import { useState, useEffect } from 'react'
import SelectWidget from '../SelectWidget'
import { walletNiceName } from 'ethers-network/wallet'


import { useAppSelector, useAppDispatch } from '../../hooks'

import { WalletInfo } from 'ethers-network/wallet'

import {
  updateStep,
  Step,
  StepId,
} from '../../reducer/stateSlice'

import {
  walletStorageSetWallet,
} from 'ethers-network/storage'

const _setWallet2 = (
  walletAddress : string | undefined,
  wallet : WalletInfo,
  dispatch : any,
) => {
  console.log(walletAddress)
  if (walletAddress !== wallet.address){
    walletStorageSetWallet(walletAddress)
    dispatch(updateStep({id : StepId.Wallet, step : Step.Init}))
  }
}

const WalletSelectWidget = () => {

  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const walletList = useAppSelector((state) => state.walletSlice.walletList)
  const dispatch = useAppDispatch()

  const [option, setOption] = useState<Array<{
    name: string,
    value: string,
  }>>([])

  const _setWallet = (event : {target : {name : string, value : string}}) => {
    _setWallet2(event.target.value, wallet, dispatch)
  }

  useEffect(() => {
    const _option = walletList.map(wallet => {
      return {
        value: wallet.address,
        name: walletNiceName(wallet),
      }
    })
    if (_option[0] && !wallet.address)
      _setWallet2(_option[0].value, wallet, dispatch)
    setOption(_option)
  }, [walletList, wallet, dispatch])



  return (
    <>
    { option.length > 0 &&
      <>
      <SelectWidget
        name='Select widget'
        value={wallet.address}
        onChange={_setWallet}
        option={option}
        />


      </>
    }
    </>
  )
}

export default WalletSelectWidget
