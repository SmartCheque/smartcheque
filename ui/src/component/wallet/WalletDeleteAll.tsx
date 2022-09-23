import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { walletListDelete } from 'ethers-network/storage'

const WalletDeleteAll = () => {

  const [step, setStep] = useState(0)

  const deleteAllWallet = (event : any) => {
    if (event.target.value === "yes"){
      walletListDelete()
      window.location.reload()
    }
  }

  return (
    <>
    <p>Reset password and local wallet</p>
    { step === 0 &&
      <Button variant="danger" onClick={() => {setStep(1)}} >Delete all broswer wallets</Button>
    }
    {
      step === 1 &&
        <Form.Control type="test" placeholder="Enter yes to confirm" onChange={deleteAllWallet} />
    }
    </>
  )
}

export default WalletDeleteAll
