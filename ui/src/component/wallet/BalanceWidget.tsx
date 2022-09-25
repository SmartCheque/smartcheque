
import { useAppSelector } from '../../hooks'

import { NetworkType } from 'ethers-network/network'

const BalanceWidget = (props : {
  network : NetworkType
}) => {
  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const balanceObj = wallet.balance.filter(_balance => {return _balance.chainId === props.network.chainId})[0]

  if (balanceObj === undefined || balanceObj.balance === undefined){
    return <span style={{paddingLeft : '.2em', color : 'orangered'}}>XXX {props.network.tokenName}</span>
  }

  const balance = balanceObj.balance

  if (balance === 0){
    return <span style={{paddingLeft : '.2em', color : 'orangered'}}>0 {props.network.tokenName}</span>
  }

  let balanceNbr
  if (balance > 100){
    balanceNbr = Math.floor(balance)
  } else if (balance > 1) {
    balanceNbr = Math.floor(balance * 100) / 100
  } else if (balance > 0.1) {
    balanceNbr = Math.floor(balance * 1000) / 1000
  } else {
    balanceNbr = Math.floor(balance * 10000) / 10000
  }

  if (props.network.warningBalance && balance < props.network.warningBalance){
    return <span style={{paddingLeft : '.2em', color : 'orange'}}>{balanceNbr} {props.network.tokenName}</span>
  }
  return <span style={{paddingLeft : '.2em', color : 'lightgreen'}}>{balanceNbr} {props.network.tokenName}</span>
}

export default BalanceWidget
