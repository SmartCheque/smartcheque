import { useState} from 'react'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';


const SimpleButton = (props: {
  name: string,
  onClick: (event: any) => void,
  variant?: string,
}) => {

  const [process, setProcess] = useState<boolean>(false)

  const onClick = async (event : any) => {
    setProcess(true)
    props.onClick(event)
    setProcess(false)
  }

  return (
    <>
      {!process && <Button
        variant={props.variant}
        onClick={onClick}
        >{props.name}</Button>}
      {process && <Spinner animation="border" variant="primary" />}
    </>
  )
}

export default SimpleButton
