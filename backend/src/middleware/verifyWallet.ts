import * as ethers from 'ethers'
import { RequestHandler } from 'express'

export const verifyNetwork: RequestHandler = (req, res, next) => {
  if (!req.body.networkName) {
    return res.status(403).send({
      message: "No networkName set"
    })
  }

  if (!req.body.networkName.match(/^[0-9a-zA-Z ]+$/)) {
    return res.status(403).send({
      message: "No networkName or invalid : " + req.body.networkName
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
