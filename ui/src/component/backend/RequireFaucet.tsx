import Faucet from './Faucet'
import DivNice from '../DivNice'
import BalanceWidget from '../wallet/BalanceWidget'

import { useAppSelector } from '../../hooks'

import { NetworkType } from 'ethers-network/network'

const RequireFaucet = (props : {
  network : NetworkType
}) => {

  const wallet = useAppSelector((state) => state.walletSlice.wallet)

  const balanceObj = wallet.balance.filter(_balance => _balance.chainId === props.network.chainId)[0]

  if (!balanceObj){
    return (<></>)
  }

  const balance = balanceObj.balance

  if ((!props.network.warningBalance ||  (balance && balance >= props.network.warningBalance))) {
    return (
      <></>
    )
  }

  return (
    <DivNice>
    { !wallet.balance &&
      <p>Wallet balance is empty, add some tokens!</p>
    }
    {
      !!wallet.balance &&
      <p>On {props.network.name} ({props.network.chainId}) you have <BalanceWidget network={props.network}/></p>
    }
    { wallet.address &&
      <>
      <p>Get up to {props.network.faucetAmount} Test token with faucet</p>
      <p><Faucet network={props.network} address={wallet.address}/></p>
      </>
    }
    { props.network.faucet &&
      <>
      <p>Get more Test token with {props.network.name} faucet at:</p>
      <p><a href={props.network.faucet} target="_blank" rel="noreferrer">{props.network.faucet}</a></p>
      </>
    }
    </DivNice>
  )
}

export default RequireFaucet
