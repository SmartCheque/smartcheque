import { BigNumber, utils } from 'ethers'

import AddressWidget from '../AddressWidget'

import DivFullNice from '../DivFullNice'

import { useAppDispatch, useAppSelector } from '../../hooks'

import { setBankAddress } from '../../reducer/configSlice'
import { getAllowance } from '../../reducer/backend/contractSlice'

import { Button } from 'react-bootstrap'

import { getContractBank, getHashContractBank } from 'contract/contract'

import { useEffect, useState } from 'react'

import { NetworkType } from 'ethers-network/network'

import BalanceWidget from '../wallet/BalanceWidget'

const BankLoadWidget = (props : {
  bankContract : any,
  network : NetworkType,
}) => {

  const dispatch = useAppDispatch()

  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const allowance = useAppSelector((state) => state.contractSlice.allowance)

  const [bankInfo, setBankInfo] = useState< {
    network: NetworkType,
    certificate : string,
    name : string,
    balance : BigNumber,
    stake : BigNumber,
    contract : string,
  }>()

  const load = async () => {
    try{
      const bankHash = await props.bankContract.contractHash()

      if (bankHash != getHashContractBank()) {
        console.error('Wrong contract version')
        setBankInfo(undefined)
      }

      const certificate = await props.bankContract.getCertificate()
      const name = await props.bankContract.getName()
      const balance = await props.bankContract.getBalance()
      const stake = await props.bankContract.getStake()

      setBankInfo({
        network : props.network,
        certificate,
        name,
        balance,
        stake,
        contract : props.bankContract.address
      })
    } catch (e : any){
      console.error(e)
      setBankInfo(undefined)
    }

  }

  useEffect(() =>{
    load()
  }, [props.bankContract])

  if (!bankInfo) {
    return <>No info</>
  }

  const addBalance = async (value : number) => {
    await props.bankContract.addBalance({value : utils.parseEther(value.toString())})
    await load()
  }

  const addStake = async (value : number) => {
    await props.bankContract.addStake(0, {value : utils.parseEther(value.toString())})
    await load()
  }

  const chainId = props.network.chainId
  const contractAddress = props.bankContract.address


  const _getAllowance = async () => {
    const customer = wallet.address
    if (customer){
      await dispatch(getAllowance({chainId : chainId, contractAddress :  contractAddress, customer : customer}))
      await load()
    }

  }

  return <DivFullNice>
    Blockchain : {bankInfo.network?.name}<br/>
    Bank name : {bankInfo.name}<br/>
    Bank Certificate : <AddressWidget address={bankInfo.certificate}/><br/>
    Bank Contract : <AddressWidget address={bankInfo.contract}/><br/><br/>
    my bank balance : {utils.formatEther(bankInfo.balance)}<br/>
    my bank stake : {utils.formatEther(bankInfo.stake)}<br/><br/>
    wallet balance <BalanceWidget network={bankInfo.network}/><br/><br/>
    {allowance && allowance.chainId === chainId && allowance.contractAddress === contractAddress &&
      <>
      allowance certificate : {allowance.customerCertificate}<br/>
      allowance time : {new Date(allowance.timestamp).toLocaleString()}<br/>
      allowance : {utils.formatEther(allowance.allowance)}<br/>
      </>
    }<br/><br/>
    <Button onClick={() => addBalance(0.1)}>Add money</Button><br/><br/>
    <Button onClick={() => addStake(0.1)}>Add stake money</Button><br/><br/>
    <Button onClick={() => _getAllowance()}>Get Allowance</Button><br/><br/>
  </DivFullNice>

}

export default BankLoadWidget
