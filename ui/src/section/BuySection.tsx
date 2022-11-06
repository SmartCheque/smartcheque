//import NFTCollectionWidget from '../component/NFT/NFTCollectionWidget'
import { getNetworkList } from 'ethers-network/network'
import { Row, Col} from 'react-bootstrap'

import { useAppSelector } from '../hooks'

import { TMWallet } from 'ethers-network/transaction'
import { QrReader } from 'react-qr-reader';
import QRCode from "react-qr-code";
import { utils, BigNumber } from 'ethers';


import Scan from '../containers/Scan';
//import Write from '../containers/Write';
import { useState } from 'react';
//import { ActionsContext } from '../contexts/context';

const BuySection = (props: {
  tMWallet: TMWallet | undefined,
}) => {
  const [actions, setActions] = useState<any>(null);
  const [qrData, setQrData] = useState('');
  const [qrMessage, setQrMessage] = useState('No result');
  const [payMessage, setPayMessage] = useState('No payment');
  

  const {scan, write} = actions || {};

  const actionsValue = {actions,setActions} as any;

  const onHandleAction = (actions:any) =>{
    setActions({...actions});
  }

  const wallet = useAppSelector((state) => state.walletSlice.wallet);

  const chainId = 42261;

console.log(props.tMWallet?.getTMNetwork(chainId));

//window['signer'] = props.tMWallet?.getTMNetwork(chainId)?.transactionManager.signer;
  const message_signed = props.tMWallet?.getTMNetwork(chainId)?.transactionManager.signer.signMessage('hello')
  console.log(message_signed);

  const cachedBanks = ['0xb00685ACeC0267140d4cFda29f8Cae51A4879822'];
  const merchants = { 'TomoCafe': '0xcF948e41Ce0A7b1c71e2734f6B240323AceD5828' };

  //const value = 'TomoCafe|3.25 USDC|0x77942899fb90af0d629674f426f43d268b4ff1c29fe28b09f89d817d0a7fc1f2649b08eadecc6d91a25c99803d1f709834bac237bd65a9aa5588477a765720371b'; // signed by bank

// temp1.transactionManager.signer.signMessage('TomoCafe|0xcF948e41Ce0A7b1c71e2734f6B240323AceD5828|1667685518')
// = 0xf725ba031e875f5191a9e719643932b1d8b1ee38b83f5a0e5659eb7edda72a1325ebbb274c604c7018c4c5688da3f6ac66449b13fd76d1d9ddf0e9996c290c021c
// merchantCert: $merchantName|$merchantAddress|$timestamp|$bankSig
// payRequest: $merchantCert|$amount|$merchantSig

  const merchantCertTomoCafe = 'TomoCafe|0xcF948e41Ce0A7b1c71e2734f6B240323AceD5828|1667685518|0xf725ba031e875f5191a9e719643932b1d8b1ee38b83f5a0e5659eb7edda72a1325ebbb274c604c7018c4c5688da3f6ac66449b13fd76d1d9ddf0e9996c290c021c'; // signed by bank 0xb006
  const price = '3.25 USDC';
  const priceTime = 1667688454; // parseInt((new Date()).valueOf() / 1000)
  // await temp1.transactionManager.signer.signMessage('3.25 USDC|1667688454')
  const priceTimeSig = '0x00b4cd4810782b892a14cc231608cc554da527c6d1c864a4f57c20c972a3f4610e76fbf608828ef24e63d2e52e407808d3f1bb55d499f19df621d288e8a3fbc21c'; // signed by merchant 0xcF9
  const payRequest = [merchantCertTomoCafe, price, priceTime, priceTimeSig].join('|');
  
  const payRequest__demo = 'TomoCafe|0xcF948e41Ce0A7b1c71e2734f6B240323AceD5828|1667685518|0xf725ba031e875f5191a9e719643932b1d8b1ee38b83f5a0e5659eb7edda72a1325ebbb274c604c7018c4c5688da3f6ac66449b13fd76d1d9ddf0e9996c290c021c|3.25 USDC|1667688454|0x00b4cd4810782b892a14cc231608cc554da527c6d1c864a4f57c20c972a3f4610e76fbf608828ef24e63d2e52e407808d3f1bb55d499f19df621d288e8a3fbc21c';

  const _demo = (request:any) => {
    const [name, addr, tstamp, bankSig, price, priceTime, priceTimeSig] = request.split('|');
    const bankSigner = utils.verifyMessage([name, addr, tstamp].join('|'), bankSig);
    console.log('ASSERT ', bankSigner, '==', cachedBanks[0]);
    const priceSigner = utils.verifyMessage(price + '|' + priceTime, priceTimeSig);
    console.log('ASSERT ', priceSigner, '==', addr);
  };
  _demo(payRequest);

  //const [actions, setActions] = useState<any>(null);

  const craftPayInfo = (qrData:any) => {
    const myAddr = wallet.address;
    const bankAddr = cachedBanks[0]; // default choice
    const [merchant, merchantAddr, merchantStamp, bankSig, price, priceTime, priceTimeSig] = qrData.split('|');
    return 'You (' + myAddr + ') will send ' + price + ' to ' + merchantAddr + ' using bank ' + bankAddr;
  };
  const craftSignedPayment = async (qrData:any) => {
if (!wallet.address) return;
    const myAddr = wallet.address;
    const bankAddr = cachedBanks[0]; // default choice
    const [merchant, merchantAddr, merchantStamp, bankSig, price, priceTime, priceTimeSig] = qrData.split('|');
    const tstampHex = utils.hexZeroPad(utils.hexValue(BigNumber.from(parseInt('' + (new Date()).valueOf() / 1000))), 32);
    const amountHex = utils.hexZeroPad(utils.hexValue(utils.parseEther("3.25")), 32);

    // spending message: spender|bank|merchant|tstamp|amount
    const bytes = utils.concat([myAddr, bankAddr, merchantAddr, tstampHex, amountHex].map(h => utils.arrayify(h)));
    console.log(bytes);
    return await props.tMWallet?.getTMNetwork(chainId)?.transactionManager.signer.signMessage(bytes)
  };
  craftSignedPayment(payRequest__demo).then(res => console.log('signed payment message: ', res));

  return (
      <div className="App">
        <h2>Hello Customer {wallet.address}</h2>
        <h2>Cached Bank Address/Pubkey</h2>
        <ol><li>{cachedBanks[0]} (default)</li></ol>

        <h2>Merchant Offer</h2>

        <div><code>{payRequest}</code></div>
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
            <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={payRequest}
            viewBox={`0 0 256 256`}
            />
        </div>

        <QrReader
          constraints={{ facingMode: /*'environment'*/ 'user' }}
          onResult={(result, error) => {
            if (!!result) {
              const res = result.toString();
              const [merchant, merchantAddr, merchantStamp, bankSig, price, priceTime, priceTimeSig] = res.split('|');
              const bankSigner = utils.verifyMessage([merchant, merchantAddr, merchantStamp].join('|'), bankSig);
              console.log(bankSigner);
  
              if (bankSigner == cachedBanks[0]) {
                setQrData(res);
                setQrMessage('OK!! ' + res + ', signed by ' + bankSigner);
              } else {
                setQrMessage('BAD SIGNATURE from ' + bankSigner + ': ' + res);
              }

              const priceSigner = utils.verifyMessage(price + '|' + priceTime, priceTimeSig);
              if (priceSigner == merchantAddr) {
                console.log('price and time signed by merchant');
              } else {
                console.log('bad sig for ' + price + ' at ' + priceTime + ': ' + priceTimeSig);
              }
            }

            if (!!error) {
              //console.info(error);
            }
          }}
          /*style={{ width: '100%' }}*/
        />
        <p>QR status: {qrMessage}</p>
        <p>raw: <code>{qrData}</code></p>

        <div>
          <h2>Confirm payment</h2>
          { qrData === '' ? '' : craftPayInfo(qrData) }
        </div>

      </div>
  );

}

export default BuySection
