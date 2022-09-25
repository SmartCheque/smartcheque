import NFTCollectionWidget from '../component/NFT/NFTCollectionWidget'
import { getNetworkList } from 'ethers-network/network'
import { Row, Col} from 'react-bootstrap'

import { useAppSelector } from '../hooks'

const CollectionSection = () => {
  const networkList = getNetworkList()

  const wallet = useAppSelector((state) => state.walletSlice.wallet)

  const render = (address : string) => {
    return networkList.map(network => {
      return (
        <Col lg={ 2 } key = { network.chainId } > <NFTCollectionWidget network={ network } address={ address }/></Col >
      )
    })
  }

  if (wallet.address){
    return (
      <>
      <Row >
      {render(wallet.address) }
      </Row>
      </>
    )
  }

  return (<>No wallet address</>)


}

export default CollectionSection
