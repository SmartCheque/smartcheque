//import NFTCollectionWidget from '../component/NFT/NFTCollectionWidget'
import { useEffect, useState } from 'react'

import { Row, Col} from 'react-bootstrap'

import { useAppSelector } from '../hooks'

import { TMWallet } from 'ethers-network/transaction'

import { getContractBank, getHashContractBank } from 'contract/contract'

import BankLoadWidget from '../component/Bank/BankLoadWidget'


import {getNetworkFromChainId} from 'ethers-network/network'

const BankSection = (props: {
  tMWallet: TMWallet,
}) => {

  const bankAddress = useAppSelector((state) => state.configSlice.bankAddress)

  if (!bankAddress) {
    return (<>No bank</>)
  }

  const chainId = parseInt(bankAddress.split('|')[0])
  const contractAddress = bankAddress.split('|')[1]

  const network = getNetworkFromChainId(chainId)

  if (!network) {
    return (<>No network</>)
  }

  let signer = props.tMWallet.getTMNetwork(network.chainId)?.transactionManager.signer
  if (!signer) {
    return (<>No signer</>)
  }
  const bankContract = getContractBank(contractAddress, signer)

  return <BankLoadWidget bankContract={bankContract} network={network}/>


}

export default BankSection
