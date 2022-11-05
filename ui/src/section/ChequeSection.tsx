//import NFTCollectionWidget from '../component/NFT/NFTCollectionWidget'
import { getNetworkList } from 'ethers-network/network'
import { Row, Col} from 'react-bootstrap'

import { useAppSelector } from '../hooks'

import nfc from '../nfc.svg';
import Scan from '../containers/Scan';
import Write from '../containers/Write';
import { useState } from 'react';
import { ActionsContext } from '../contexts/context';


const ChequeSection = () => {
  const [actions, setActions] = useState<any>(null);
  const {scan, write} = actions || {};

  const actionsValue = {actions,setActions} as any;

  const onHandleAction = (actions:any) =>{
    setActions({...actions});
  }

  return (
      <div className="App">
        <img src={nfc} className="App-logo" alt="logo" />
        <h1>NFC Tool</h1>
    <h2>Hello world</h2>
        <div className="App-container">
          <button onClick={()=>onHandleAction({scan: 'scanning', write: null})} className="btn">Scan</button>
          <button onClick={()=>onHandleAction({scan: null, write: 'writing'})} className="btn">Write</button>
        </div>
        <ActionsContext.Provider value={actionsValue}>
          {scan && <Scan/>}
          {write && <Write/>}
        </ActionsContext.Provider>
      </div>
  );

}

export default ChequeSection
