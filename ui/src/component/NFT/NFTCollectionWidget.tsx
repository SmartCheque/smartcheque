import { useEffect, useState } from 'react'

import { NetworkType } from 'ethers-network/network'

import { nftsOwner } from 'ethers-network/service'

import DivFullNice from '../DivFullNice'

import NFTWidget from './NFTWidget'

const NFTCollectionWidget = (props : {
  network : NetworkType
  address : string
}) => {

  const [nfts, setNfts] = useState<Array<any> | undefined>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    const load = async () => {
      try {
        setNfts(await nftsOwner(props.network.chainId, props.address))
      } catch (error : any) {
        setError(error.toString())
      }

    }
    load()
  }, [props.network, props.address])
  if (error) {
    return <DivFullNice title={props.network.name}>{error}</DivFullNice>
  }
  if (!nfts) {
    return <DivFullNice title={props.network.name}>loading ...</DivFullNice>
  }
  return (
    <DivFullNice title={props.network.name}>
    {nfts.map(nft => {
    return <div key={nft.contract_address + ' ' + nft.token_id}><NFTWidget network={props.network} contractAddress={nft.contract_address} tokenId={nft.token_id}/></div>
  })}
    </DivFullNice>
  )
}

export default NFTCollectionWidget
