import DivNice from '../DivNice'
import Button from 'react-bootstrap/Button'
import SpaceWidget from '../SpaceWidget'

const OptionButton = (props : {
  displayOption : boolean
  setDisplayOption : (displayOption : boolean) => void
}) => {
  return (<>
  <SpaceWidget>
    <Button variant="primary" onClick={() => {
      props.setDisplayOption(!props.displayOption)
    }}>{props.displayOption ? "Back" : "Option"}</Button>
  </SpaceWidget>
  </>)
}

export default OptionButton
