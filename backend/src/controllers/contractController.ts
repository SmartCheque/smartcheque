import { BigNumber } from 'ethers'
import db from '../models'
const Contract = db.contract
import { RequestHandler } from 'express'
import { getNetworkFromChainId } from 'ethers-network/network'
import { getWallet } from 'ethers-network/network'
import {
  createContractBankList,
  createContractBank,
  getHashContractBankList,
  getHashContractBank,
  getContractBankList,
} from 'contract/contract'
import { getPrivateKey } from '../utils/privateKey'

export const deployContract: RequestHandler = async (req, res) => {
  try {
    const chainId = req.body.chainId
    const network = getNetworkFromChainId(chainId)
    if (network) {
      const privateKeys = getPrivateKey(req.body.chainId)
      const wallet = getWallet(network, privateKeys)
      const hash = BigNumber.from(req.body.hash)
      const name = req.body.name
      let contract
      switch (name) {
        case 'BankList':
          contract = await createContractBankList(
            hash,
            wallet,
          )
          break
        default:
          return res.status(403).send({ message: "Contract not found" })
      }
      Contract.create({
        chainId,
        hash: hash.toHexString(),
        name: name,
        address: contract.address,
      })
      return res.send({
        address: contract.address,
      })
    }
  }
  catch (err: any) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}

export const getContract: RequestHandler = async (req, res) => {
  try {
    Contract.findOne({
      where: {
        chainId: req.body.chainId,
        hash: req.body.hash,
        name: req.body.name,
      }
    }).then(contract => {
      if (contract) {
        return res.send({
          address: contract.address
        })
      }
      return res.status(403).send({ message: "Contract not found" })
    })
  } catch (err: any) {
    res.status(500).send({ message: err.message })
  }
}

export const createBank: RequestHandler = async (req, res) => {
  try {
    Contract.findOne({
      where: {
        chainId: req.body.chainId,
        hash: getHashContractBankList().toHexString(),
        name: 'BankList',
      }
    }).then(async (contract) => {
      if (contract) {
        const network = getNetworkFromChainId(req.body.chainId)
        if (network) {
          const privateKeys = getPrivateKey(req.body.chainId)
          const wallet = getWallet(network, privateKeys)
          const contractBankList = getContractBankList(contract.address, wallet)
          const hash = getHashContractBank()
          const name = req.body.name
          const contractBank = await createContractBank(
            name,
            hash,
            wallet,
          )
          console.log('Bank contract created', contractBank.address)
          const fee = await contractBankList.registerFee()
          const tx = await contractBankList.registerBank(contractBank.address, { value: fee })
          await tx.wait()
          return res.send({
            address: contractBank.address
          })
        }
        return res.status(403).send({ message: "Network not found" })
      }
      return res.status(403).send({ message: "Contract not found" })
    })
  } catch (err: any) {
    res.status(500).send({ message: err.message })
  }
}
