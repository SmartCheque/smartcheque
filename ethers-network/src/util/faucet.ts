import * as ethers from 'ethers'

import { network as networkList } from '../config/network.json'
import { NetworkType } from '../type/networkType'

export const getNetwork = (networkName: string) => {
  const network: NetworkType = networkList.filter((network) => network.name === networkName)[0]
  if (network) return network
  throw new Error('Network not found in configuration : ' + networkName)
}

export const getProvider = (network: NetworkType) => {
  if (network.url) {
    return new ethers.providers.StaticJsonRpcProvider(network.url, network.chainId)
  }
  throw new Error('Provider not found for network : ' + network.name)
}

export const getWallet = (network: NetworkType, privateKeys: any): ethers.Wallet => {
  const provider = getProvider(network)
  if (provider) {
    const walletList = privateKeys.map((pk: string): ethers.Signer => {
      return new ethers.Wallet(pk, provider)
    })
    return walletList[0]
  }
  throw new Error('Wallet not found for network : ' + network.name)
}

export const getFaucetAmount = async (network: NetworkType, wallet: ethers.Wallet, address: string) => {
  if (!network.faucetAmount || network.faucetAmount === 0) {
    throw new Error('Faucet not set for : ' + network.name)
  }
  const faucetBalance = await wallet.provider.getBalance(wallet.address)
  const faucetBalanceInEth = parseFloat(ethers.utils.formatEther(faucetBalance))
  if (network.faucetAmount > faucetBalanceInEth) {
    throw new Error('Faucet is empty for : ' + network.name)
  }
  const balance = await wallet.provider.getBalance(address)
  const balanceInEth = parseFloat(ethers.utils.formatEther(balance))
  if (network.faucetAmount <= balanceInEth) {
    throw new Error('Address balance is greater or equal than faucet : ' + balanceInEth)
  }
  return network.faucetAmount - balanceInEth
}

export const checkFaucet = async (networkName: string, privateKeys: any, address: string) => {
  const network = getNetwork(networkName)
  const wallet = getWallet(network, privateKeys)
  return await getFaucetAmount(network, wallet, address)
}

export const faucet = async (address: string, networkName: string, privateKeys: any) => {
  const network = getNetwork(networkName)
  const wallet = getWallet(network, privateKeys)
  const faucetAmount = await getFaucetAmount(network, wallet, address)
  console.log('Faucet ' + address + ' ' + faucetAmount)
  const ret = await wallet.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(faucetAmount.toString())
  })
  //console.log(ret)
  await ret.wait()
  return
}
