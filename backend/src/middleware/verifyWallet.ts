import * as ethers from 'ethers'
import { RequestHandler } from 'express'

export const verifyChainId: RequestHandler = (req, res, next) => {
  if (!req.body.chainId || typeof req.body.chainId !== 'number') {
    return res.status(403).send({
      message: "No chainId set"
    })
  }

  next()
}

export const verifyAddress: RequestHandler = (req, res, next) => {

  if (!req.body.address) {
    return res.status(403).send({
      message: "No wallet address set"
    })
  }

  try {
    req.body.address = ethers.utils.getAddress(req.body.address)
    next()
    return
  } catch (e: any) {
    return res.status(403).send({
      message: "Not valid wallet address " + req.body.address + " " + e.message
    })
  }
}
