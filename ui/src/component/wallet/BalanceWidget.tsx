
import { useAppSelector } from '../../hooks'

const BalanceWidget = () => {
  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const network = useAppSelector((state) => state.walletSlice.network)

  if (wallet.balance === undefined){
    return <span style={{paddingLeft : '.2em', color : 'orangered'}}>XXX {network?.tokenName}</span>
  }
  if (wallet.balance === 0){
    return <span style={{paddingLeft : '.2em', color : 'orangered'}}>0 {network?.tokenName}</span>
  }
  if (network && network.warningBalance && wallet.balance < network.warningBalance){
    return <span style={{paddingLeft : '.2em', color : 'orange'}}>{Math.floor(wallet.balance * 100) / 100} {network?.tokenName}</span>
  }
  return <span style={{paddingLeft : '.2em', color : 'lightgreen'}}>{Math.floor(wallet.balance * 100) / 100} {network?.tokenName}</span>
}

export default BalanceWidget
