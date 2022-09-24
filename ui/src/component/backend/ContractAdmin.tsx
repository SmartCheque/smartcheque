import { useEffect } from 'react'

import { NetworkType } from 'ethers-network/network'

import { getHashContractNFT } from 'contract/contract'

import { useAppSelector, useAppDispatch } from '../../hooks'

import { getContract, deployContract } from '../../reducer/backend/contractSlice'

import BalanceWidget from '../wallet/BalanceWidget'

import AddressWidget from '../AddressWidget'

import DivFullNice from '../DivFullNice'

import Button from 'react-bootstrap/Button'

const ContractList = [ 'NFT' ]

const ContractAdmin = (props : {
  network : NetworkType
}) => {

  const dispatch = useAppDispatch()

  const contractList = useAppSelector((state) => state.contractSlice.contract).filter(_contract => {
    return _contract.chainId === props.network.chainId
  })

  const isAdmin = useAppSelector((state) => state.authSlice.isAdmin)

  useEffect(() =>{
    dispatch(getContract({
      chainId : props.network.chainId,
      name : 'NFT',
      hash : getHashContractNFT().toHexString(),
    }))
  }, [props.network])

  const render = (_name : string) => {
    const contract = contractList.filter(_contract => {
      return _contract.name === _name && _contract.hash === getHashContractNFT().toHexString()
    })[0]
    let button
    if (contract && !contract.pending && !contract.address && isAdmin) {
      button = (<Button onClick={() => {dispatch(deployContract({
        chainId : props.network.chainId,
        name : _name,
        hash : getHashContractNFT().toHexString(),
      }))}}>Deploy</Button>)
    }
    let text
    if (!contract) {
      text = 'not found'
    } else if (contract.pending){
      text = 'pending'
    } else if (contract.address){
      text = <AddressWidget address={contract.address}/>
    } else {
      text = 'not deployed'
    }
    return (<p>{_name} {text} {button}</p>)
  }

  return (
    <DivFullNice title={props.network.name}>
      <BalanceWidget network={props.network}/>
      {ContractList.map(_name => {
        return render(_name)
      })}
    </DivFullNice>
  )
}

export default ContractAdmin
