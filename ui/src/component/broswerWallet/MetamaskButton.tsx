import DivNice from '../DivNice'
import SpaceWidget from '../SpaceWidget'
import Button from 'react-bootstrap/Button'

import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from "@web3-react/injected-connector"

const Injected = new InjectedConnector({
 //supportedChainIds: [1, 3, 4, 5, 42]
});

const MetamaskButton = (props : {
  setWalletType : (name : string) => void
}) => {

  const { activate } = useWeb3React();

  return (
    <DivNice title='Metamask Wallet'>
      <p>Use wallet and network configured within Metamask</p>
      <p><a href='https://metamask.io/' target='_blank' rel="noreferrer">get Metamask here</a></p>
      <SpaceWidget>
        <Button onClick={() => {
           activate(Injected).then(() => {props.setWalletType('Metamask')})
        }}>
          Enter with Metamask
        </Button>
      </SpaceWidget>
    </DivNice>
  )
}

export default MetamaskButton
