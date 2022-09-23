import AddressWidget from '../AddressWidget'
import BalanceWidget from './BalanceWidget'
import {getNetworkList} from 'ethers-network/network'

import { useAppSelector } from '../../hooks'

const WalletInfoWidget = () => {

  const wallet = useAppSelector((state) => state.walletSlice.wallet)

  return (
    <>
    { !!wallet.address &&
      <>
      <p>Wallet address : <AddressWidget address={wallet.address}/></p>
      { getNetworkList().map(network => {
        return <p key={network.chainId}>{network.name} balance: <BalanceWidget network={network}/></p>
      })}
      </>
    }

    </>
  )
}

export default WalletInfoWidget
