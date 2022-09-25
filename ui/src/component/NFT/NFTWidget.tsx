import { useEffect, useState } from 'react'

import { NetworkType } from 'ethers-network/network'

import { nftInfo } from 'ethers-network/service'

import DivFullNice from '../DivFullNice'

import { Image, Button } from 'react-bootstrap'

import AddressWidget from '../AddressWidget'

const NFTWidget = (props : {
  network : NetworkType
  contractAddress : string
  tokenId : number
}) => {

  const [nft, setNft] = useState<any>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() =>{
    const load = async () => {
      try {
        setNft(await nftInfo(props.network.chainId, props.contractAddress, props.tokenId))
      } catch (error : any) {
        setError(error.toString())
      }
    }
    load()
  }, [props.network, props.contractAddress, props.tokenId])

  if (error) {
    return (
    <DivFullNice title={'Error'}>
      <AddressWidget address={props.contractAddress}/><br/>{props.tokenId}<br/>{error}
    </DivFullNice>
  )
  }

  if (!nft) {
    return (
    <DivFullNice title={'loading...'}>
      <AddressWidget address={props.contractAddress}/><br/>{props.tokenId}
    </DivFullNice>
  )
  }

  if (nft.metadata && nft.cached_file_url){
    return (
      <DivFullNice title={nft.metadata.name}>
        <Image fluid src={nft.cached_file_url}/>
      </DivFullNice>
      )
  } else {
    return (<>NFT metadata is empty</>)
  }

}

export default NFTWidget
