import DivNice from '../DivNice'
import Button from 'react-bootstrap/Button'

const BroswerWalletButton = (props : {
  setWalletType : (name : string) => void
}) => {
  return (
    <DivNice title='Broswer Wallet'>
      <p>Use your internet broswer cache to keep your wallet</p>
      <p>Good for testing the game</p>
      <p>You will lose your wallet when the broswer cache is cleared</p>
      <Button onClick={() => props.setWalletType('Broswer')}>
        Enter with broswer wallet
      </Button>
    </DivNice>
  )
}

export default BroswerWalletButton
