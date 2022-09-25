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

  return (await response.json()).nfts
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
  const json = await response.json()
  console.log(json)
  if (!json.nft) {
    if (json.error) {
      throw new Error(json.error.message)
    }
  }
  return json.nfts
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
  const json = await response.json()
  console.log(json)
  if (!json.nft) {
    if (json.error) {
      throw new Error(json.error.message)
    }
  }
  return json.nft
}

export const nftMint = async (
  chainId: number,
  name: string,
  description: string,
  fileUrl: string,
  address: string,
) => {
  const url = new URL(nftPortConfig.url + '/mints/easy/urls')
  const data = {
    chain: getChainName(chainId),
    name,
    description,
    file_url: fileUrl,
    mint_to_address: address,
  }
  console.log(url.toString())
  const response = await fetch(
    url.toString(),
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: nftPortConfig.apiKey
      }
    }
  )
  const json = await response.json()
  console.log(json)
  if (!json.nft) {
    if (json.error) {
      throw new Error(json.error.message)
    }
  }
  return json.nft
}
