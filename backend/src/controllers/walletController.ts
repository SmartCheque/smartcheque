import db from '../models'
const Wallet = db.wallet
import { RequestHandler } from 'express'
import { faucet, checkFaucet } from 'ethers-network/faucet'
import { Transaction } from 'sequelize'
import { getPrivateKey } from '../utils/privateKey'


const faucetWallet = async (req: any, t: Transaction, res: any) => {
  try {
    const privateKeys = getPrivateKey(req.body.chainId)
    await faucet(req.body.address, req.body.chainId, privateKeys)
    console.log("faucet", req.ip, req.body.address)
    t.commit().then(() => {
      res.send({ message: "Wallet funded successfully!" })
    })
  }
  catch (err: any) {
    t.rollback()
    res.status(500).send({ message: err.message });
  };
}

export const checkFaucetController: RequestHandler = async (req, res) => {
  try {
    const privateKeys = getPrivateKey(req.body.chainId)
    const faucetAmount = await checkFaucet(req.body.chainId, privateKeys, req.body.address)
    if (faucetAmount) {
      return res.send({ message: "Faucet ready", faucetAmount });
    }
    return res.status(403).send({ message: "Faucet not ready" });
  }
  catch (err: any) {
    res.status(500).send({ message: err.message });
  };
}

export const fundWallet: RequestHandler = (req, res) => {
  db.sequelize.transaction().then(t => {
    Wallet.findOne({
      where: {
        address: req.body.address
      }, transaction: t
    })
      .then((wallet) => {
        if (wallet && wallet.lastFunding && wallet.lastFunding.getTime() + (1000 * 120) > new Date().getTime()) {
          t.rollback()
          const remaining = wallet.lastFunding.getTime() + (1000 * 120) - new Date().getTime()
          const remaining_min = Math.floor(remaining / (60 * 1000))
          const remaining_sec = Math.floor(remaining % 60000 / 1000)
          return res.status(403).send({ message: "Wallet already funded last hour wait " + remaining_min + "min " + remaining_sec + "sec" });
        }
        else if (!wallet) {
          Wallet.create({
            address: req.body.address,
            lastFunding: new Date()
          }, { transaction: t }).then(() => {
            faucetWallet(req, t, res)
          })
        } else {
          wallet.lastFunding = new Date()
          wallet.save({ transaction: t }).then(() => {
            faucetWallet(req, t, res)
          })
        }
      })
      .catch(err => {
        t.rollback()
        res.status(500).send({ message: err.message });
      });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};
