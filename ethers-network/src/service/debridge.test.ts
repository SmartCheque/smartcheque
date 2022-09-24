import { estimate } from '../service/debridge'

jest.setTimeout(60000)

const testDeBridge = () => {

  describe('DeBridge test', () => {
    it('DeBridge estimation', async () => {
      console.log(await estimate(
        1, //Ethereum
        1, // 1 ETH
        56, //Binance
      ))
    })
  })
}

testDeBridge()
