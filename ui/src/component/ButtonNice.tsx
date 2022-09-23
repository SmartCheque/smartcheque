import Button from 'react-bootstrap/Button'

const ButtonNice = (props:{
  onClick ?: (e ?: any) => void
  children ?: any
}) => {
  return <Button
    variant='dark'
    style={{/*backgroundColor:'#00000080'*/}}
    onClick={props.onClick}>
    {props.children}
  </Button>
}

export default ButtonNice
