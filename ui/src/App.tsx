import { useState } from 'react';

import './App.css';
import AppNav from './AppNav'

import Container from 'react-bootstrap/Container';

import { TransactionManager } from 'ethers-network/transaction'
import WalletConnection from './section/WalletConnection'
import OptionConnection from './section/OptionConnection'
import AdminSection from './section/AdminSection'
import WalletLoader from './loader/walletLoader'

import 'bootstrap/dist/css/bootstrap.min.css';

import { useAppSelector } from './hooks'

import {
  StepId,
  isOk,
} from './reducer/contractSlice'

function App() {

  const [section, setSection] = useState<string | undefined>()
  const [transactionManager, setTransactionManager] = useState<TransactionManager>()
  const [displayConfig, setDisplayConfig] = useState<boolean>(false)

  const updateTransactionManager = (_transactionManager : TransactionManager) => {
    console.log("update transaction Manager", transactionManager)
    if (transactionManager){
      transactionManager.release()
    }
    setTransactionManager(_transactionManager)
  }

  const step = useAppSelector((state) => state.contractSlice.step)

  const isWallet = (section === 'wallet' || !isOk(StepId.Wallet, step))

  return (
    <div className="App" style={isWallet ? {top : '0px'} : {}}>
      <Container fluid>
        <WalletLoader
          transactionManager={transactionManager}
          setTransactionManager={updateTransactionManager}
        />
        {!isWallet && <AppNav
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
              transactionManager={transactionManager}
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
