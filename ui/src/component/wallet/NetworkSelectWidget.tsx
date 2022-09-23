import { useState, useEffect } from 'react'
import SelectWidget from '../SelectWidget'
import { getNetworkList } from 'ethers-network/network'

import { useAppSelector, useAppDispatch } from '../../hooks'

import {
  walletStorageSetNetworkId,
} from 'ethers-network/storage'

import {
  updateStep,
  Step,
  StepId,
} from '../../reducer/contractSlice'

const NetworkSelectWidget = () => {

  const network = useAppSelector((state) => state.walletSlice.network)
  const dispatch = useAppDispatch()

  const _setNetwork = async (event : {target : {name : string, value : string}}) => {
    _setNetwork2(parseInt(event.target.value))
  }

  const _setNetwork2 = async (chainId : number | undefined) => {
    if (chainId !== network?.chainId){
      walletStorageSetNetworkId(chainId)
      dispatch(updateStep({id : StepId.Wallet, step : Step.Init}))
    }
  }

  const [option, setOption] = useState<Array<{
    name: string
    value: string
  }>>([])

  useEffect(() => {
    if (option.length === 0) {
      const networkList = getNetworkList()
      const _option = networkList.map(_network => {
        return {
          value: _network.chainId.toString(),
          name: _network.name,
        }
      })
      if (_option[0] && !network){
        let defautNetwork = networkList.filter(_network => {
          return _network.default
        })[0]
        if (!defautNetwork){
          defautNetwork = networkList[0]
        }
        if (defautNetwork){
          _setNetwork2(defautNetwork.chainId)
        }
      }
      setOption(_option)
    }
  })

  return (
    <SelectWidget
      name='networkSelect'
      value={network?.chainId.toString()}
      onChange={_setNetwork}
      option={option}
    />
  )
}

export default NetworkSelectWidget
