import request from 'supertest'
import appInit from '../utils/appInit'
import { Server } from 'http'
import * as ethers from 'ethers'
import models from '../models'

import { getProvider, getNetworkFromName } from 'ethers-network/network'

const networkName = "ganache"
//const networkName = "Emerald Testnet"
//const networkName = "Arbitrum Testnet"
//const networkName = "Matic Mumbai Testnet"
//const networkName = "Matic Mainnet"


/*
function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
*/
jest.setTimeout(60000)

let server: Server
let provider: ethers.providers.Provider

const testServer = () => {

  beforeAll(async () => {
    server = appInit()
    const network = getNetworkFromName(networkName)
    const providerTmp = getProvider(network)
    expect(providerTmp).toBeDefined
    if (providerTmp) {
      provider = providerTmp
    }
    //await sleep(1000);
  })

  describe('Post Endpoint', () => {
    it('test server ok', async () => {
      const res = await request(server)
        .get('/')
      console.log(res.body)
      expect(res.statusCode).toEqual(200)

    })

    it('test wallet fund', async () => {
      const wallet = ethers.Wallet.createRandom({ provider })
      const balance0 = await provider.getBalance(wallet.address)
      expect(balance0.eq(0)).toBeTruthy()
      const res = await request(server)
        .post('/api/wallet/fund')
        .send({
          address: wallet.address,
          networkName,
        })
      console.log(res.body)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')

      const balance1 = await provider.getBalance(wallet.address)
      expect(balance1.eq(ethers.utils.parseEther('0.01'))).toBeTruthy()

      const res2 = await request(server)
        .post('/api/wallet/fund')
        .send({
          address: wallet.address,
          networkName,
        })
      console.log(res2.body)
      expect(res2.statusCode).toEqual(403)
      expect(res2.body).toHaveProperty('message')
    })
  })

  afterAll(done => {
    models.sequelize.close()
    server.close();
    done();
  })
}

testServer()
