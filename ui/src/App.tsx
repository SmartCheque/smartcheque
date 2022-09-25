import { useState } from 'react';

import './App.css';
import AppNav from './AppNav'

import Container from 'react-bootstrap/Container';

import { TMWallet } from 'ethers-network/transaction'
import WalletConnection from './section/WalletConnection'
import OptionConnection from './section/OptionConnection'
import AdminSection from './section/AdminSection'
import WalletLoader from './loader/walletLoader'

import 'bootstrap/dist/css/bootstrap.min.css';

import { useAppSelector } from './hooks'

import {
  StepId,
  isOk,
} from './reducer/stateSlice'

function App() {

  const [section, setSection] = useState<string | undefined>()
  const [tMWallet, setTMWallet] = useState<TMWallet>()
  const [displayConfig, setDisplayConfig] = useState<boolean>(false)

  const updateTMWallet = (_tMWallet : TMWallet) => {
    console.log("update transaction Manager", tMWallet)
    if (tMWallet){
      tMWallet.release()
    }
    setTMWallet(_tMWallet)
  }

  const step = useAppSelector((state) => state.stateSlice.step)

  const isWallet = (section === 'wallet' || !isOk(StepId.Wallet, step))

  return (
    <div className="App" style={isWallet ? {top : '0px'} : {}}>
      <Container fluid>
        { <WalletLoader
          tMWallet={tMWallet}
          setTMWallet={updateTMWallet}
        />}
        {<AppNav
          section={section}
          setSection={setSection}
        />}
        { !!isWallet &&
          <>
          { !!displayConfig &&
            <OptionConnection
              setDisplayConfig={setDisplayConfig}
            />
          }
          { !displayConfig &&
            <WalletConnection
              tMWallet={tMWallet}
              setSection={setSection}
              setDisplayConfig={setDisplayConfig}
            />
          }
          </>

        }

        { !isWallet && (
          <AdminSection
            section={section}
          />
        )}

      </Container>

    </div>
  );
}

export default App;
