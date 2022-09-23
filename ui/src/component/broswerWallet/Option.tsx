import DivNice from '../DivNice'
import WalletAddWidget from '../wallet/WalletAddWidget'
import WalletDelete from '../wallet/WalletDelete'

const Option = () => {
  return (
  <>
    <DivNice title='Add wallet'>
      <WalletAddWidget/>
    </DivNice>
    <DivNice title='Delete wallet'>
      <WalletDelete/>
    </DivNice>
  </>)
}

export default Option
