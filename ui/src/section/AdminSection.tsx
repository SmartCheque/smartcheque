import UserSection from './UserSection'
import ContractAdminSection from './ContractAdminSection'
//import CollectionSection from './CollectionSection'
import ChequeSection from './ChequeSection'
import BuySection from './BuySection'

import { TMWallet } from 'ethers-network/transaction'

const AdminSection = (props: {
  tMWallet: TMWallet,
  section : string | undefined,
})=> {

  const render = () => {
    switch (props.section){
      case 'user':
      return <UserSection/>
      case 'contractAdmin':
      return <ContractAdminSection tMWallet={props.tMWallet}/>
      case 'smartCheque':
      return <ChequeSection tMWallet={props.tMWallet} />
      case 'buy':
      return <BuySection tMWallet={props.tMWallet} />
      default :
      return (<p></p>)
    }
  }

  return (
    <>
    {render()}
    </>
  )

}


export default AdminSection
