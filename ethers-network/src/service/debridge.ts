import { utils, constants } from 'ethers'
import { debridgeConfig } from '../config/debridgeConfig'

export const estimate = async (
  srcChainId: number,
  srcChainTokenInAmount: number,
  dstChainId: number,
  srcChainTokenIn?: string | undefined,
  dstChainTokenOut?: string | undefined,
) => {
  const url = new URL(debridgeConfig.url + '/estimation')
  const param = new URLSearchParams()
  param.set('srcChainId', srcChainId.toString())
  param.set('srcChainTokenIn', srcChainTokenIn ? srcChainTokenIn : constants.AddressZero)
  param.set('srcChainTokenInAmount', utils.parseEther(srcChainTokenInAmount.toString()).toString())
  param.set('slippage', '1')
  param.set('dstChainId', dstChainId.toString())
  param.set('dstChainTokenOut', dstChainTokenOut ? dstChainTokenOut : constants.AddressZero)
  param.set('executionFeeAmount', 'auto')
  url.search = param.toString()
  console.log(url.toString())
  const response = await fetch(url.toString())
  console.log(response)
  return await response.json()
}
