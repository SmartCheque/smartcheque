import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import SpaceWidget from '../component/SpaceWidget'
import NetworkInfoWidget from '../component/wallet/NetworkInfoWidget'
import WalletInfoWidget from '../component/wallet/WalletInfoWidget'
import NetworkSelectWidget from '../component/wallet/NetworkSelectWidget'
import NetworkSwitchWidget from '../component/wallet/NetworkSwitchWidget'
import WalletSelectWidget from '../component/wallet/WalletSelectWidget'
import Logo from '../component/broswerWallet/Logo'
import Introduction from '../component/broswerWallet/Introduction'
import Option from '../component/broswerWallet/Option'
import OptionButton from '../component/broswerWallet/OptionButton'
import BroswerWalletButton from '../component/broswerWallet/BroswerWalletButton'
import MetamaskButton from '../component/broswerWallet/MetamaskButton'
import WalletAddWidget from '../component/wallet/WalletAddWidget'

import { TransactionManager } from 'ethers-network/transaction'
import DivNice from '../component/DivNice'
import RequireFaucet from '../component/backend/RequireFaucet'

import WalletPassword from '../component/wallet/WalletPassword'
import StepMessageNiceWidget from '../component/StepMessageNiceWidget'
import {
  walletStorageSetType,
  walletStorageClearPassword,
  walletStorageSetNetworkId,
} from 'ethers-network/storage'

import {
  Step,
  StepId,
  isStep,
  updateStep,
  getStep,
  clearError,
} from '../reducer/contractSlice'

import {
  clearPassword
} from '../reducer/walletSlice'

import { useAppSelector, useAppDispatch } from '../hooks'

const WalletConnection = (props: {
  transactionManager: TransactionManager | undefined
  setSection: (section: string) => void
  setDisplayConfig: (arg : boolean) => void
}) => {

  const dispatch = useAppDispatch()

  const step = useAppSelector((state) => state.contractSlice.step)
  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const network = useAppSelector((state) => state.walletSlice.network)
  const displayAdmin = useAppSelector((state) => state.configSlice.displayAdmin)

  const [ displayOption, setDisplayOption ] = useState<boolean>(false)

  const setWalletType = (type?: string) => {
    walletStorageSetType(type)
    dispatch(updateStep({ id: StepId.Wallet, step: Step.Init }))
  }

  const renderDisconnect = () => {
    return (
      <SpaceWidget>
        <Button variant="warning" onClick={() => {
          walletStorageClearPassword()
          dispatch(clearPassword())
          dispatch(updateStep({ id: StepId.Wallet, step: Step.Init }))
        }}>Disconnect</Button>
      </SpaceWidget>
    )
  }

  const renderHome = () => {
    return (
      <SpaceWidget>
        <Button variant="primary" onClick={() => setWalletType()}>Home</Button>
      </SpaceWidget>
    )
  }

  const renderOption = () => {
    return (
      <OptionButton displayOption={displayOption} setDisplayOption={setDisplayOption}/>
    )
  }

  const render = () => {

    if (isStep(StepId.Wallet, Step.Loading, step)) {
      return (
        <>
          <SpaceWidget>
          </SpaceWidget>
          <DivNice>
            <p>Loading wallet ...</p>
            <Button variant="danger" onClick={() => {
              walletStorageSetNetworkId(undefined)
              window.location.reload()
            }}>Cancel</Button>
          </DivNice>
        </>
      )
    }
    if (isStep(StepId.Wallet, Step.NotSet, step)) {
      return (
        <>
          <SpaceWidget>
          </SpaceWidget>
          <Logo/>
          <Introduction/>

          <BroswerWalletButton
            setWalletType={setWalletType}
          />

          { displayAdmin &&
            <MetamaskButton
              setWalletType={setWalletType}
            />
          }

          <DivNice title='Options'>
            <Button onClick={() => props.setDisplayConfig(true)}>
              Advanced option
            </Button>
          </DivNice>
        </>
      )
    }
    switch (wallet.type) {
      case 'Broswer':
        if (isStep(StepId.Wallet, Step.Init, step)) {
          return (
            <DivNice title='Broswer wallet'>
                <p>Loading...</p>
            </DivNice>
          )
        }
        if (isStep(StepId.Wallet, Step.NoAddress, step)) {
          return (
            <DivNice title='Broswer wallet create'>
                <WalletAddWidget/>
              {renderDisconnect()}
              {renderHome()}
            </DivNice>
          )
        }
        if (isStep(StepId.Wallet, Step.NoPassword, step)) {
          return (
            <DivNice title='Broswer wallet setup'>
                <p>Use your internet broswer cache to keep your wallet</p>
                <SpaceWidget>
                  <WalletPassword />
                </SpaceWidget>
                {renderHome()}
            </DivNice>
          )
        }
        if (isStep(StepId.Wallet, Step.Ok, step) || isStep(StepId.Wallet, Step.NoNetwork, step) || isStep(StepId.Wallet, Step.NoBalance, step)) {
          if (displayOption){
            return (
              <>
              <Option/>
              <DivNice>
              {renderOption()}
              </DivNice>
              </>
            )
          }
          return (
            <>
            <DivNice title='Select network'>
                <NetworkSelectWidget />
                {!!network && displayAdmin &&
                  <NetworkInfoWidget
                    network={network}
                  />
                }
            </DivNice>
            <DivNice title='Select wallet'>
            <WalletSelectWidget/>
            </DivNice>

            <DivNice title='Wallet info'>
            <WalletInfoWidget/>
            </DivNice>

            <RequireFaucet/>

            {isStep(StepId.Wallet, Step.Ok, step) &&
              <DivNice>
              <Button onClick={() => props.setSection('game')}>Start game</Button>
              </DivNice>
            }
            <DivNice>
            {renderOption()}
            {renderDisconnect()}
            {renderHome()}
            </DivNice>
            </>
          )
        }
        if (isStep(StepId.Wallet, Step.Error, step)) {
          return (
            <>
            <DivNice title='Select network'>
                <NetworkSelectWidget />
                {!!network && displayAdmin &&
                  <NetworkInfoWidget
                    network={network}
                  />
                }
            </DivNice>
            <DivNice title='Network Error'>
                <p>Is the network connected?</p>
                <p>Cannot reach {network?.url}</p>
                <p>Click ok to re-test</p>
                <StepMessageNiceWidget
                  title='Wallet'
                  step={getStep(StepId.Wallet, step)}
                  resetStep={() => { dispatch(clearError(StepId.Wallet)) }}
                />
            </DivNice>
            <DivNice>
            {renderOption()}
            {renderHome()}
            </DivNice>
            </>
          )
        }
        return (
          <DivNice title='Error wallet step'>
            {'Unknow step ' + Step[getStep(StepId.Wallet, step).step]}
          </DivNice>
        )
      case 'Metamask':
      case 'WalletConnect':
      if (isStep(StepId.Wallet, Step.Init, step)) {
        return (
          <DivNice title='Metamask'>
              <p>Loading...</p>
          </DivNice>
        )
      }
        if (isStep(StepId.Wallet, Step.NoAddress, step)) {
          return (
            <DivNice title='Metamask'>
                <Button size='sm' variant="warning" onClick={() => {
                  window.ethereum.enable().then()
                }}>Connect wallet</Button>
                {renderHome()}
            </DivNice>
          )
        }
        if (isStep(StepId.Wallet, Step.Ok, step)) {
          return (
            <>
            <DivNice title='Network'>
              <NetworkSwitchWidget/>
              { network &&
                <NetworkInfoWidget
                  network={network}
                />
              }
            </DivNice>
            <DivNice title='Metamask Wallet'>
              { wallet &&
                <WalletInfoWidget/>
              }
              </DivNice>
              <RequireFaucet/>
              {isStep(StepId.Wallet, Step.Ok, step) &&
                <DivNice>
                <Button onClick={() => props.setSection('game')}>Start game</Button>
                </DivNice>
              }
              <DivNice>
                {renderHome()}
              </DivNice>
              </>
          )
        }
        if (isStep(StepId.Wallet, Step.Error, step)) {
          return (
            <>
              <DivNice title='Metamask Error'>
                <p>Is your metamask connected?</p>
                <Button size='sm' variant="warning" onClick={() => {
                  window.ethereum.enable().then()
                }}>Connect metamask</Button>
                <p>When connected, click ok to re-test</p>
                <StepMessageNiceWidget
                  title='Wallet'
                  step={getStep(StepId.Wallet, step)}
                  resetStep={() => { dispatch(clearError(StepId.Wallet)) }}
                /
                >

              </DivNice>
              <DivNice>
              {renderHome()}
              </DivNice>
            </>
          )
        }
        return (
          <DivNice title='Metamask Error wallet step'>
            {'Unknow step ' + Step[getStep(StepId.Wallet, step).step]}
            {renderHome()}
          </DivNice>
        )
      default:
        return (
            <DivNice title='Error wallet type'>
              <p>Unkonw type : {wallet.type}</p>
              {renderHome()}
            </DivNice>
        )
    }
  }
  return render()
}

export default WalletConnection
