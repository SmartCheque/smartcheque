import Faucet from './Faucet'
import DivNice from '../DivNice'
import BalanceWidget from '../wallet/BalanceWidget'

import { useAppSelector } from '../../hooks'

const RequireFaucet = () => {

  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const network = useAppSelector((state) => state.walletSlice.network)

  console.log(network, network?.warningBalance, wallet.balance)

  if (!network) {
    return (
      <></>
    )
  }

  if ((!network.warningBalance ||  (wallet.balance && wallet.balance >= network.warningBalance))) {
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
      <p>You have <BalanceWidget/></p>
    }
    { wallet.address &&
      <>
      <p>Get more Test token with faucet</p>
      <p><Faucet address={wallet.address}/></p>
      </>
    }
    { network.faucet &&
      <>

      <p>Get more Test token with {network.name} faucet at:</p>
      <p><a href={network.faucet} target="_blank" rel="noreferrer">{network.faucet}</a></p>
      </>
    }
    </DivNice>
  )
}

export default RequireFaucet
