import { utils, constants } from 'ethers'
import nftPortConfig from '../config/nftPortConfig'

const getChainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return "ethereum"
    case 137:
      return "polygon"
    case 420:
      return "goerli"
    case 4:
      return "rinkeby"
  }
  throw new Error('Chain not supported')
}

export const nfts = async (
  chainId: number,
) => {
  const url = new URL(nftPortConfig.url + '/nfts')
  const param = new URLSearchParams()
  param.set('chain', getChainName(chainId))
  url.search = param.toString()
  console.log(url.toString())
  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: {
        Authorization: nftPortConfig.apiKey
      }
    }
  )
  console.log(response)
  return await response.json()
}

export const nftsOwner = async (
  chainId: number,
  address: string,
  contractAddress?: string,
) => {
  const url = new URL(nftPortConfig.url + '/accounts/' + address)
  const param = new URLSearchParams()
  param.set('chain', getChainName(chainId))
  param.set('account_address', address)
  contractAddress && param.set('contract_address', contractAddress)
  url.search = param.toString()
  console.log(url.toString())
  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: {
        Authorization: nftPortConfig.apiKey
      }
    }
  )
  console.log(response)
  return await response.json()
}

export const nftInfo = async (
  chainId: number,
  contractAddress: string,
  tokenId: number,
) => {
  const url = new URL(nftPortConfig.url + '/nfts/' + contractAddress + '/' + tokenId)
  const param = new URLSearchParams()
  param.set('chain', getChainName(chainId))
  param.set('contract_address', contractAddress)
  param.set('token_id', tokenId.toString())
  url.search = param.toString()
  console.log(url.toString())
  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers: {
        Authorization: nftPortConfig.apiKey
      }
    }
  )
  console.log(response)
  return await response.json()
}
