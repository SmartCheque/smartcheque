import ContractAdmin from '../component/backend/ContractAdmin'
import Message from '../component/backend/Message'
import { getNetworkList } from 'ethers-network/network'

import { Row, Col} from 'react-bootstrap'

import { TMWallet } from 'ethers-network/transaction'

const ContractAdminSection = (props: {
  tMWallet: TMWallet,
})=> {

  const networkList = getNetworkList()

  const render = () => {
    return networkList.map(network => {
      return <Col lg={2} key={network.chainId}><ContractAdmin
      network={network}
      tMWallet={props.tMWallet}
      /></Col>
    })
  }

  return (
    <>
    <Message/>
    <Row>
    {render()}
    </Row>
    </>
  )

}


export default ContractAdminSection
