import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { walletDelete } from 'ethers-network/storage'

import { useAppSelector, useAppDispatch } from '../../hooks'

import {
  updateStep,
  Step,
  StepId,
} from '../../reducer/stateSlice'

const WalletDelete = () => {

  const wallet = useAppSelector((state) => state.walletSlice.wallet)
  const password = useAppSelector((state) => state.walletSlice.password)
  const dispatch = useAppDispatch()

  const [step, setStep] = useState(0)

  const deleteWallet = (event : any) => {
    if (event.target.value === "yes" && wallet.address && password.password){
      walletDelete(wallet.address, password.password)
      dispatch(updateStep({id : StepId.Wallet, step : Step.Init}))
    }
  }

  return (
    <>
    { step === 0 &&
      <>
        <p>Delete wallet with public address {wallet.address}</p>
        <Button variant="danger" onClick={() => {setStep(1)}} >Delete wallet</Button>
      </>
    }
    {
      step === 1 &&
        <Form.Control type="test" placeholder="Enter yes to confirm" onChange={deleteWallet} />
    }
    </>
  )
}

export default WalletDelete
