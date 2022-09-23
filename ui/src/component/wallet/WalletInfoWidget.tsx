import AddressWidget from '../AddressWidget'
import BalanceWidget from './BalanceWidget'

import { useAppSelector } from '../../hooks'

const WalletInfoWidget = () => {

  const wallet = useAppSelector((state) => state.walletSlice.wallet)

  return (
    <>
    { !!wallet.address &&
      <>
      <p>Wallet address : <AddressWidget address={wallet.address}/><br/>
      Balance : <BalanceWidget/></p>
      </>
    }

    </>
  )
}

export default WalletInfoWidget
