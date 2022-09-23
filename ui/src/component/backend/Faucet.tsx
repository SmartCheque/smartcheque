import { useEffect } from 'react'

import Button from 'react-bootstrap/Button'

import { useAppSelector, useAppDispatch } from '../../hooks'

import { faucet, checkFaucet } from '../../reducer/backend/faucetSlice'

import { NetworkType } from 'ethers-network/network'

import Message from './Message'

const Faucet = (props : {
  network : NetworkType
  address : string
}) => {

  const dispatch = useAppDispatch()

  const pending = useAppSelector((state) => state.faucetSlice.pending)

  useEffect(() =>{
    dispatch(checkFaucet({address : props.address, networkName : props.network.name}))
  }, [props.network, props.address])

  if (pending) {
    return (
      <p>Pending...</p>
    )
  }

  return (
    <Message>
    <Button onClick={() => {
      dispatch(faucet({address : props.address, networkName : props.network.name}))
    }}>Faucet</Button>
    </Message>
  )
}

export default Faucet
