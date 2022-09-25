import { nfts, nftsOwner, nftInfo } from '../service/nftPort'

jest.setTimeout(60000)

const testNFTPort = () => {

  describe('NFTPort test', () => {
    it('NFTPort nfts', async () => {
      console.log(await nfts(
        1, //Ethereum
      ))
    })
    it('NFTPort nftsOwner', async () => {
      console.log(await nftsOwner(
        1, //Ethereum
        '0x942878558bC523777fE11e6d725AF93c86458050'
      ))
    })
    it('NFTPort nftInfo', async () => {
      console.log(await nftInfo(
        1, //Ethereum
        '0xc2bae2cdef63bcb0ba60bb02cd67d912f8371c3d',
        2030
      ))
    })
  })
}

testNFTPort()
