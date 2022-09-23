import Button from 'react-bootstrap/Button'

import { useAppSelector, useAppDispatch } from '../../hooks'

import { clearMessage } from '../../reducer/backend/messageSlice'

const Message = (props : {
  children ?: any
}) => {

  const dispatch = useAppDispatch()

  const message = useAppSelector((state) => state.messageSlice.message)

  if (message){
    return (
      <>
      <p>{message}</p>
      <p>
      <Button onClick={() => {
        dispatch(clearMessage())
      }}>Clear message</Button>
      </p>
      </>
    )
  }

  return <>{props.children}</>
}

export default Message
