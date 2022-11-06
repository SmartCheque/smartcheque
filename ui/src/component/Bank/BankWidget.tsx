import { NetworkType } from 'ethers-network/network'
import AddressWidget from '../AddressWidget'

import DivFullNice from '../DivFullNice'

import { useAppDispatch, useAppSelector } from '../../hooks'

import { setBankAddress } from '../../reducer/configSlice'

import { Button } from 'react-bootstrap'

const BankWidget = (props : {
  network : NetworkType
  bank : any
}) => {

  const dispatch = useAppDispatch()

  const bankAddress = useAppSelector((state) => state.configSlice.bankAddress)

  const bankAddress2 = props.network.chainId + "|" + props.bank.bankContract

  console.log(props.bank)

  if (props.bank){
    return (
      <DivFullNice title={(bankAddress === bankAddress2 ? 'X - ' : '') + props.bank.grade + " - "+ props.bank.name}>
        Address:<br/>
        <AddressWidget address={props.bank.bankContract}/> <br/>
        Certificate:<br/>
        <AddressWidget address={props.bank.certificate}/> <br/>
        <Button onClick={() => {dispatch(setBankAddress(
          bankAddress2
        ))}}>Go to bank</Button>
      </DivFullNice>
      )
  } else {
    return (<>Bank metadata is empty</>)
  }

}

export default BankWidget
