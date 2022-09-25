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
  switch (chainId) {
    case 1:

  }
  const param = new URLSearchParams()
  param.set('executionFeeAmount', 'auto')
  url.search = param.toString()
  console.log(url.toString())
  const response = await fetch(url.toString())
  console.log(response)
  return await response.json()
}
