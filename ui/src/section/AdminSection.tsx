import UserSection from './UserSection'
import ContractAdminSection from './ContractAdminSection'
//import CollectionSection from './CollectionSection'
import ChequeSection from './ChequeSection'

import { TMWallet } from 'ethers-network/transaction'

const AdminSection = (props: {
  tMWallet: TMWallet | undefined,
  section : string | undefined,
})=> {

  const render = () => {
    switch (props.section){
      case 'user':
      return <UserSection/>
      case 'contractAdmin':
      return <ContractAdminSection/>
      case 'smartCheque':
      return <ChequeSection/>
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
