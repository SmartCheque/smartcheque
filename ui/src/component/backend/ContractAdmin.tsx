import { useEffect } from 'react'

import { NetworkType } from 'ethers-network/network'
import { getContractBankList, getHashContractBankList } from 'contract/contract'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { getContract, deployContract } from '../../reducer/backend/contractSlice'

import BalanceWidget from '../wallet/BalanceWidget'
import AddressWidget from '../AddressWidget'
import BankCollectionWidget from '../Bank/BankCollectionWidget'

import DivFullNice from '../DivFullNice'
import Button from 'react-bootstrap/Button'

import { TMWallet } from 'ethers-network/transaction'

const ContractList = [ 'BankList'  ]

const ContractAdmin = (props : {
  network : NetworkType,
  tMWallet : TMWallet,
}) => {

  const dispatch = useAppDispatch()

  const contractList = useAppSelector((state) => state.contractSlice.contract).filter(_contract => {
    return _contract.chainId === props.network.chainId
  })

  const isAdmin = useAppSelector((state) => state.authSlice.isAdmin)

  useEffect(() =>{
    dispatch(getContract({
      chainId : props.network.chainId,
      name : 'BankList',
      hash : getHashContractBankList().toHexString(),
    }))
  }, [props.network])

  const render = (_name : string) => {
    const contract = contractList.filter(_contract => {
      return _contract.name === _name && _contract.hash === getHashContractBankList().toHexString()
    })[0]
    let button
    if (contract && !contract.pending && !contract.address && isAdmin) {
      button = (<><br/><Button onClick={() => {dispatch(deployContract({
        chainId : props.network.chainId,
        name : _name,
        hash : getHashContractBankList().toHexString(),
      }))}}>Deploy</Button></>)
    }
    let text
    let signer = props.tMWallet.getTMNetwork(props.network.chainId)?.transactionManager.signer
    if (!contract) {
      text = 'not found'
    } else if (contract.pending){
      text = 'pending'
    } else if (contract.address){
      text = <><AddressWidget address={contract.address}/>{
        !!signer && <BankCollectionWidget
          network={props.network}
          bankList={getContractBankList(contract.address, signer)}
        />
      }</>
    } else {
      text = 'not deployed'
    }
    return (<div>{_name} {text} {button}</div>)
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
