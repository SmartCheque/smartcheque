import { useEffect } from 'react'

import Button from 'react-bootstrap/Button'

import { useAppSelector, useAppDispatch } from '../../hooks'

import { faucet, checkFaucet } from '../../reducer/backend/faucetSlice'

import Message from './Message'

const Faucet = (props : {
  address : string
}) => {

  const dispatch = useAppDispatch()

  const network = useAppSelector((state) => state.walletSlice.network)

  const pending = useAppSelector((state) => state.faucetSlice.pending)

  useEffect(() =>{
    if (network){
      dispatch(checkFaucet({address : props.address, networkName : network.name}))
    }
  }, [network, props.address])

  if (pending) {
    return (
      <p>Pending...</p>
    )
  }

  return (
    <Message>
    <Button onClick={() => {
      if (network){
        dispatch(faucet({address : props.address, networkName : network.name}))
      }
    }}>Faucet</Button>
    </Message>
  )
}

export default Faucet
