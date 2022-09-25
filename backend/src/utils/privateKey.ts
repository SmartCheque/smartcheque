import { getNetworkFromName } from 'ethers-network/network'

export const getPrivateKey = (chainId: number) => {
  if (chainId === getNetworkFromName("* Ganache").chainId) {
    return require("../../../key/ganachePrivateKeys.json")
  }
  return require("../../../key/privateKeys.json")
}
